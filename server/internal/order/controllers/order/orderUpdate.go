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
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
)

// Request DTO
type updateOrderReq struct {
	OrderID string             `json:"orderId"`
	Items   []orderModels.Item `json:"items"`
}

//Update Order
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
			c.JSON(http.StatusBadRequest, gin.H{"error": "orderId is required"})
			return
		}

		orderObjID, err := primitive.ObjectIDFromHex(req.OrderID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid orderId"})
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
				c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch order"})
			return
		}

		if role == "customer" && oldOrder.UserID != userID {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "you cannot update someone else's order",
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

		total, err := CalculateTotal(ctx, req.Items, oldOrder.IsCustomOrder, centerID, oc.Client, oc.DBName)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		update := bson.M{
			"$set": bson.M{
				"items":       req.Items,
				"totalAmount": total,
				"updatedAt":   time.Now(),
			},
		}

		_, err = orderCol.UpdateOne(ctx, bson.M{"_id": orderObjID}, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to update order",
			})
			return
		}

		oldOrder.Items = req.Items
		oldOrder.TotalAmount = total
		oldOrder.UpdatedAt = time.Now()

		c.JSON(http.StatusOK, gin.H{
			"message": "order updated successfully",
			"order":   oldOrder,
		})
	}
}
