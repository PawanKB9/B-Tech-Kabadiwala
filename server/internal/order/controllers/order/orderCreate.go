package orderControllers

import (
	"context"
	"fmt"
	// "net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	itemsControllers "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/controllers/items"
	appModels "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/model"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
	userModels "github.com/PawanKB9/BTechKabadiwala/internal/user/model"
)

// type OrderController struct {
// 	Client *mongo.Client
// 	DBName string
// }

// Request DTOs
type CreateOrderRequest struct {
	UserID          primitive.ObjectID      `json:"userId"`
	CenterID        primitive.ObjectID      `json:"centerId"`
	Location        orderModels.GeoJSONPoint `json:"location"`
	Items           []orderModels.Item      `json:"items"`
	IsCustomOrder   bool                    `json:"isCustomOrder"`
}

// Validations
func ValidateOrderItems(items []orderModels.Item, isCustom bool) error {
	if len(items) == 0 {
		return fmt.Errorf("items cannot be empty")
	}

	for _, it := range items {
		if isCustom {
			if it.ScrapName == "" {
				return fmt.Errorf("scrapName required for custom order")
			}
			if it.Weight <= 0 && it.Piece <= 0 {
				return fmt.Errorf("weight or piece must be > 0")
			}
		} else {
			if it.ProductID.IsZero() {
				return fmt.Errorf("productId is required")
			}
			if it.MeasureType == "weight" && it.Weight <= 0 {
				return fmt.Errorf("invalid weight")
			}
			if it.MeasureType == "piece" && it.Piece <= 0 {
				return fmt.Errorf("invalid piece")
			}
		}
	}
	return nil
}

// Price Calculation
func CalculateTotal(
	ctx context.Context,
	items []orderModels.Item,
	isCustom bool,
	centerID primitive.ObjectID,
	client *mongo.Client,
    dbName string,
	) (float64, error) {

	if isCustom {
		return 0, nil
	}

	itemsCtrl := itemsControllers.NewItemsController(client, dbName)
	productsByCategory, err := itemsCtrl.GetProductsByCenterID(ctx, centerID)
	if err != nil {
		return 0, err
	}

	var total float64

	for _, it := range items {
		var matched *appModels.Product

		for _, products := range productsByCategory {
			for _, p := range products {
				if  p.ID == it.ProductID {
					matched = &p
					break
				}
			}
			if matched != nil {
				break
			}
		}

		if matched == nil {
			return 0, fmt.Errorf("product not found: %s", it.ProductID.Hex())
		}

		switch it.MeasureType {
		case "weight":
			total += it.Weight * matched.Rate
		case "piece":
			total += float64(it.Piece) * matched.Rate
		default:
			return 0, fmt.Errorf("invalid measureType")
		}
	}

	return total, nil
}

// Internal DB Operations
func (oc *OrderController) processOrder(ctx context.Context, order *orderModels.Order) error {
	orderCol := database.GetCollection(
		oc.Client.Database(oc.DBName),
		"orders",
	)

	if _, err := orderCol.InsertOne(ctx, order); err != nil {
		return err
	}

	go oc.clearUserCart(order.UserID)

	return nil
}

func (oc *OrderController) clearUserCart(userID primitive.ObjectID) {
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()

	cartCol := database.GetCollection(
		oc.Client.Database(oc.DBName),
		"carts",
	)

	_, _ = cartCol.DeleteOne(ctx, bson.M{"userId": userID})
}

// Create Order 
func (oc *OrderController) CreateOrder() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		roleAny, exists := c.Get("role")
		if !exists {
			c.JSON(401, gin.H{"error": "unauthorized"})
			return
		}

		role := roleAny.(string)

		var req CreateOrderRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "invalid request"})
			return
		}

		var userID, centerID primitive.ObjectID

		if role == "customer" {
			uid, _ := c.Get("userID")
			cid, _ := c.Get("centerID")

			userID = uid.(primitive.ObjectID)
			centerID = cid.(primitive.ObjectID)

			if !req.UserID.IsZero() || !req.CenterID.IsZero() {
				c.JSON(403, gin.H{"error": "customer cannot set userId or centerId"})
				return
			}
		}

		if role == "Admin" {
			if req.UserID.IsZero() || req.CenterID.IsZero() {
				c.JSON(400, gin.H{"error": "admin must provide userId and centerId"})
				return
			}

			userID = req.UserID
			centerID = req.CenterID
		}

		var orderLocation orderModels.GeoJSONPoint

		// ADMIN: location is mandatory
		if role == "Admin" {
			if req.Location.Type == "" || len(req.Location.Coordinates) != 2 {
				c.JSON(400, gin.H{"error": "location is required for admin orders"})
				return
			}
			orderLocation = req.Location
		}

		// CUSTOMER: use request location OR fallback to user.location
		if role == "customer" {
			if req.Location.Type != "" && len(req.Location.Coordinates) == 2 {
				orderLocation = req.Location
			} else {
				userCol := database.GetCollection(
					oc.Client.Database(oc.DBName),
					"users",
				)

				var user userModels.User
				err := userCol.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
				if err != nil {
					c.JSON(500, gin.H{"error": "failed to fetch user location"})
					return
				}

				if user.Location.Type == "" || len(user.Location.Coordinates) != 2 {
					c.JSON(400, gin.H{"error": "user location not found"})
					return
				}

				// Convert user location → order location
				orderLocation = orderModels.GeoJSONPoint{
					Type:        user.Location.Type,
					Coordinates: user.Location.Coordinates,
					Address:     user.Location.Address,
					Landmark:    user.Location.Landmark,
					Street:      user.Location.Street,
					Pincode:     user.Location.Pincode,
					HouseNo:     user.Location.HouseNo,
					ELoc:        user.Location.ELoc,
				}
			}
		}

		if role != "Admin" && role != "customer" {
			c.JSON(403, gin.H{"error": "invalid role"})
			return
		}

		if err := ValidateOrderItems(req.Items, req.IsCustomOrder); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// total, err := CalculateTotal(ctx, req.Items, req.IsCustomOrder, centerID)
		total, err := CalculateTotal(ctx, req.Items, req.IsCustomOrder, centerID, oc.Client, oc.DBName)

		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		order := &orderModels.Order{
			ID: primitive.NewObjectID(),
			BaseModel: orderModels.BaseModel{
				UserID:    userID,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			Items:           req.Items,
			TotalAmount:     total,
			IsCustomOrder: req.IsCustomOrder,
			Location: orderLocation,
			Status:          "Confirmed",
			Payment:         "Not Paid",
			CenterID:        &centerID,
		}

		if err := oc.processOrder(ctx, order); err != nil {
			c.JSON(500, gin.H{"error": "failed to create order"})
			return
		}

		c.JSON(201, gin.H{
			"message": "order created",
			"orderId": order.ID.Hex(),
		})
	}
}

// Delete Orders
func (oc *OrderController) DeleteOrder() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		var req struct {
			OrderID string `json:"orderId"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "invalid request"})
			return
		}

		oid, err := primitive.ObjectIDFromHex(strings.TrimSpace(req.OrderID))
		if err != nil {
			c.JSON(400, gin.H{"error": "invalid orderId"})
			return
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		var order orderModels.Order
		err = orderCol.FindOne(c.Request.Context(), bson.M{"_id": oid}).Decode(&order)
		if err == mongo.ErrNoDocuments {
			c.JSON(404, gin.H{"error": "order not found"})
			return
		}

		if order.UserID != userID {
			c.JSON(403, gin.H{"error": "forbidden"})
			return
		}

		_, err = orderCol.DeleteOne(c.Request.Context(), bson.M{"_id": oid})
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to delete order"})
			return
		}

		c.JSON(200, gin.H{"message": "order deleted"})
	}
}

func (oc *OrderController) DeleteAllOrders() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		res, err := orderCol.DeleteMany(c.Request.Context(), bson.M{"userId": userID})
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to delete orders"})
			return
		}

		c.JSON(200, gin.H{
			"deletedCount": res.DeletedCount,
		})
	}
}

func (oc *OrderController) DeleteMultipleOrders() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !auth.AllowAdminOnly(c) {
			return
		}

		var req struct {
			OrderIDs []string `json:"orderIds"`
		}

		if err := c.ShouldBindJSON(&req); err != nil || len(req.OrderIDs) == 0 {
			c.JSON(400, gin.H{"error": "invalid orderIds"})
			return
		}

		var ids []primitive.ObjectID
		for _, id := range req.OrderIDs {
			oid, err := primitive.ObjectIDFromHex(strings.TrimSpace(id))
			if err != nil {
				c.JSON(400, gin.H{"error": "invalid orderId"})
				return
			}
			ids = append(ids, oid)
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		res, err := orderCol.DeleteMany(
			c.Request.Context(),
			bson.M{"_id": bson.M{"$in": ids}},
		)

		if err != nil {
			c.JSON(500, gin.H{"error": "failed to delete orders"})
			return
		}

		c.JSON(200, gin.H{"deletedCount": res.DeletedCount})
	}
}
