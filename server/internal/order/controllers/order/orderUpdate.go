package orderControllers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	appModels "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/model"
	itemsControllers "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/controllers/items"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
)

// Request DTO
type updateOrderReq struct {
	OrderID string             `json:"orderId"`
	Items   []orderModels.Item `json:"items"`
}

// Update Order
func (oc *OrderController) UpdateOrder() gin.HandlerFunc {
	return func(c *gin.Context) {

		var req updateOrderReq

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			return
		}

		req.OrderID = strings.TrimSpace(req.OrderID)
		if req.OrderID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "orderId is required",
			})
			return
		}

		orderObjID, err := primitive.ObjectIDFromHex(req.OrderID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid orderId",
			})
			return
		}

		ctx := c.Request.Context()

		roleAny, _ := c.Get("role")
		role := roleAny.(string)

		var userID primitive.ObjectID
		if role == "customer" {
			uid, ok := auth.AllowCustomerOnly(c)
			if !ok {
				return
			}
			userID = uid
		} else {
			if !auth.AllowAdminOnly(c) {
				return
			}
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		var oldOrder orderModels.Order
		err = orderCol.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&oldOrder)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "order not found",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch order",
			})
			return
		}

		if role == "customer" && oldOrder.UserID != userID {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "you cannot update someone else's order",
			})
			return
		}

		if oldOrder.Status != "Confirmed" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "order cannot be modified after confirmation stage",
			})
			return
		}

		if err := ValidateOrderItems(req.Items, oldOrder.IsCustomOrder); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		centerID := primitive.NilObjectID
		if oldOrder.CenterID != nil {
			centerID = *oldOrder.CenterID
		}

		updatedItems, total, err := CalculateTotal(
			ctx,
			req.Items,
			oldOrder.IsCustomOrder,
			centerID,
			oc.Client,
			oc.DBName,
		)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		// Preserve ExtraBonus from original order
		finalTotal := total + oldOrder.ExtraBonus

		now := time.Now()
		update := bson.M{
			"$set": bson.M{
				"items":       updatedItems,   // contains Rate + Amount
				"totalAmount": finalTotal,
				"updatedAt":   now,
			},
		}

		_, err = orderCol.UpdateOne(ctx, bson.M{"_id": orderObjID}, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to update order",
			})
			return
		}

		oldOrder.Items = updatedItems
		oldOrder.TotalAmount = finalTotal
		oldOrder.UpdatedAt = now

		c.JSON(http.StatusOK, gin.H{
			"message": "order updated successfully",
			"order":   oldOrder,
		})
	}
}

// Final Order Update Only by Admin (Rate , Weight/Piece)
// Only allowed after Arrival stage. -> only after user verification(manualy)
// Rate is validated against DB base rate with bounded negotiation.
func (oc *OrderController) AdminUpdateOrderFinal() gin.HandlerFunc {
	return func(c *gin.Context) {

		var req updateOrderReq

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		req.OrderID = strings.TrimSpace(req.OrderID)
		if req.OrderID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "OrderID is required"})
			return
		}

		orderObjID, err := primitive.ObjectIDFromHex(req.OrderID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OrderID"})
			return
		}

		if !auth.AllowAdminOnly(c) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin access required"})
			return
		}

		ctx := c.Request.Context()

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		var oldOrder orderModels.Order
		err = orderCol.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&oldOrder)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order"})
			return
		}

		if oldOrder.Status != "Arrived" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Final update allowed only after arrival",
			})
			return
		}

		if len(req.Items) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Items required for final settlement",
			})
			return
		}

		var productMap map[primitive.ObjectID]appModels.Product

		if !oldOrder.IsCustomOrder {
			itemsCtrl := itemsControllers.NewItemsController(oc.Client, oc.DBName)

			centerID := primitive.NilObjectID
			if oldOrder.CenterID != nil {
				centerID = *oldOrder.CenterID
			}

			productsByCategory, err := itemsCtrl.GetProductsByCenterID(ctx, centerID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to fetch product base rates",
				})
				return
			}

			productMap = make(map[primitive.ObjectID]appModels.Product)
			for _, products := range productsByCategory {
				for _, p := range products {
					productMap[p.ID] = p
				}
			}
		}

		var finalTotal float64

		const maxIncrease = 5.0
		const maxDecrease = 5.0

		for i := range req.Items {

			item := &req.Items[i]

			if item.Rate <= 0 {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Final rate must be greater than zero",
				})
				return
			}

			// Validate rate bounds (only non-custom)
			if !oldOrder.IsCustomOrder {

				baseProduct, ok := productMap[item.ProductID]
				if !ok {
					c.JSON(http.StatusBadRequest, gin.H{
						"error": "Invalid product in settlement",
					})
					return
				}

				baseRate := baseProduct.Rate
				minAllowed := baseRate - maxDecrease
				maxAllowed := baseRate + maxIncrease

				if item.Rate < minAllowed || item.Rate > maxAllowed {
					c.JSON(http.StatusBadRequest, gin.H{
						"error": "Rate outside allowed negotiation range",
					})
					return
				}
			}

			// Validate quantity & compute amount
			switch item.MeasureType {

			case "weight":
				if item.Weight <= 0 {
					c.JSON(http.StatusBadRequest, gin.H{
						"error": "Final weight must be greater than zero",
					})
					return
				}
				item.Amount = item.Weight * item.Rate

			case "piece":
				if item.Piece <= 0 {
					c.JSON(http.StatusBadRequest, gin.H{
						"error": "Final piece must be greater than zero",
					})
					return
				}
				item.Amount = float64(item.Piece) * item.Rate

			default:
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid measureType",
				})
				return
			}

			finalTotal += item.Amount
		}

		// Preserve bonus
		finalTotal += oldOrder.ExtraBonus

		now := time.Now()

		update := bson.M{
			"$set": bson.M{
				"items":       req.Items,
				"totalAmount": finalTotal,
				"status":      "Picked",
				"updatedAt":   now,
			},
		}

		_, err = orderCol.UpdateOne(ctx, bson.M{"_id": orderObjID}, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to finalize order",
			})
			return
		}

		oldOrder.Items = req.Items
		oldOrder.TotalAmount = finalTotal
		oldOrder.Status = "Picked"
		oldOrder.UpdatedAt = now

		c.JSON(http.StatusOK, gin.H{
			"message": "Final order settlement completed successfully",
			"order":   oldOrder,
		})
	}
}
