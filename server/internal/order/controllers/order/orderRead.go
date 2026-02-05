package orderControllers

import (
	"context"
	"math"
	"strconv"
	"time"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
)

type OrderController struct {
	Client *mongo.Client
	DBName string
}

func NewOrderController(client *mongo.Client, dbName string) *OrderController {
	return &OrderController{
		Client: client,
		DBName: dbName,
	}
}

// Customer – Active Orders
func (oc *OrderController) GetActiveOrders() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		activeStatuses := []string{
			"Confirmed",
			"Out for Pickup",
			"Arrived",
			"Picked",
		}

		filter := bson.M{
			"userId": userID,
			"status": bson.M{"$in": activeStatuses},
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		cursor, err := orderCol.Find(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to fetch orders"})
			return
		}
		defer cursor.Close(ctx)

		var orders []orderModels.Order
		if err := cursor.All(ctx, &orders); err != nil {
			c.JSON(500, gin.H{"error": "failed to decode orders"})
			return
		}

		c.JSON(200, gin.H{
			"activeOrders": orders,
		})
	}
}

// Customer – Order History
func (oc *OrderController) GetUserOrderHistory() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

		if page < 1 {
			page = 1
		}
		if limit < 1 {
			limit = 10
		}

		skip := (page - 1) * limit

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		opts := options.Find().
			SetSort(bson.D{{Key: "createdAt", Value: -1}}).
			SetLimit(int64(limit)).
			SetSkip(int64(skip))

		filter := bson.M{"userId": userID}

		cursor, err := orderCol.Find(ctx, filter, opts)
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to fetch orders"})
			return
		}
		defer cursor.Close(ctx)

		var orders []orderModels.Order
		if err := cursor.All(ctx, &orders); err != nil {
			c.JSON(500, gin.H{"error": "failed to decode orders"})
			return
		}

		total, err := orderCol.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to count orders"})
			return
		}

		totalPages := int(math.Ceil(float64(total) / float64(limit)))

		c.JSON(200, gin.H{
			"success":    true,
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
			"count":      len(orders),
			"orders":     orders,
		})
	}
}

// Admin – Center Orders
func (oc *OrderController) GetCenterOrdersAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !auth.AllowAdminOnly(c) {
			return
		}

		centerID := c.Param("centerId")
		if centerID == "" {
			c.JSON(400, gin.H{"error": "centerId is required"})
			return
		}

		centerObjID, err := primitive.ObjectIDFromHex(centerID)
		if err != nil {
			c.JSON(400, gin.H{"error": "invalid centerId"})
			return
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		cursor, err := orderCol.Find(ctx, bson.M{"centerId": centerObjID})
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to fetch orders"})
			return
		}
		defer cursor.Close(ctx)

		var orders []orderModels.Order
		if err := cursor.All(ctx, &orders); err != nil {
			c.JSON(500, gin.H{"error": "failed to decode orders"})
			return
		}

		result := map[string][]orderModels.Order{
			"pending":   {},
			"picked":    {},
			"sold":      {},
			"cancelled": {},
			"recycled":  {},
		}

		for _, order := range orders {
			switch order.Status {
			case "Confirmed", "Out for Pickup", "Arrived":
				result["pending"] = append(result["pending"], order)
			case "Picked":
				result["picked"] = append(result["picked"], order)
			case "Sold":
				result["sold"] = append(result["sold"], order)
			case "Cancelled":
				result["cancelled"] = append(result["cancelled"], order)
			case "Recycled":
				result["recycled"] = append(result["recycled"], order)
			}
		}

		c.JSON(200, gin.H{
			"success": true,
			"orders":  result,
		})
	}
}

// get order by orderId
func (oc *OrderController) GetOrderByID() gin.HandlerFunc {
	return func(c *gin.Context) {

		orderID := c.Param("orderId")
		if orderID == "" {
			c.JSON(400, gin.H{"error": "orderId is required"})
			return
		}

		orderObjID, err := primitive.ObjectIDFromHex(orderID)
		if err != nil {
			c.JSON(400, gin.H{"error": "invalid orderId"})
			return
		}

		role := c.GetString("role")

		userObjID, exists := c.Get("userID")
		fmt.Println(userObjID, role)
		if !exists {
			c.JSON(401, gin.H{"error": "user not authenticated"})
			return
		}

		userID, ok := userObjID.(primitive.ObjectID)
		if !ok {
			c.JSON(500, gin.H{"error": "invalid user context"})
			return
		}

		if role != "Admin" && role != "customer" {
			c.JSON(403, gin.H{"error": "unauthorized"})
			return
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var order orderModels.Order

		err = orderCol.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&order)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(404, gin.H{"error": "order not found"})
				return
			}
			c.JSON(500, gin.H{"error": "failed to fetch order"})
			return
		}

		// Ownership check
		if role == "customer" && order.UserID != userID {
			c.JSON(403, gin.H{"error": "access denied"})
			return
		}

		c.JSON(200, gin.H{
			"success": true,
			"order":   order,
		})
	}
}

