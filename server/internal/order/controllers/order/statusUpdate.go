package orderControllers

// Status Enum:
// ["Confirmed", "Out for Pickup", "Arrived", "Cancelled", "Picked", "Sold", "Recycled"]

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
)

const DB_NAME = "btech_kabadiwala"
// -------------------- STATUS VALIDATION --------------------

const (
	StatusConfirmed      = "Confirmed"
	StatusOutForPickup   = "Out for Pickup"
	StatusArrived        = "Arrived"
	StatusPicked         = "Picked"
	StatusSold           = "Sold"
	StatusCancelled      = "Cancelled"
	StatusRecycled       = "Recycled"
)

var allowedStatuses = map[string]bool{
	"Confirmed":      true,
	"Out for Pickup": true,
	"Arrived":        true,
	"Picked":         true,
	"Sold":           true,
	"Cancelled":      true,
	"Recycled":       true,
}

func ValidateOrderStatus(status string) error {
	if _, ok := allowedStatuses[status]; !ok {
		return fmt.Errorf("invalid status: %s", status)
	}
	return nil
}

// -------------------- REQUEST DTO --------------------
type updateStatusReq struct {
	OrderID string `json:"orderId"`
	Status  string `json:"status"`
}

// for Invoice
type UserSnapshot struct {
	ID       primitive.ObjectID `bson:"_id"`
	Name     string             `bson:"name"`
	Phone    string             `bson:"phone"`
}


// User Sold Activity
func (oc *OrderController) updateUserActivityOnSold(
	userID primitive.ObjectID,
	order orderModels.Order,
	) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	activityCol := database.GetCollection(
		oc.Client.Database(oc.DBName),
		"userActivity",
	)

	now := time.Now()
	_, _ = activityCol.UpdateOne(
		ctx,
		bson.M{"userID": userID},
		bson.M{
			"$inc": bson.M{
				"totalEarned":   order.TotalAmount,
				"completionCnt": 1,
			},
			"$set": bson.M{"updatedAt": now},
			"$setOnInsert": bson.M{
				"userID":    userID,
				"createdAt": now,
			},
		},
		options.Update().SetUpsert(true),
	)
}

// User Cancell Activity
func (oc *OrderController) updateUserActivityOnCancel(userID primitive.ObjectID) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	activityCol := database.GetCollection(
		oc.Client.Database(oc.DBName),
		"user_activity",
	)

	now := time.Now()
	_, _ = activityCol.UpdateOne(
		ctx,
		bson.M{"userId": userID},
		bson.M{
			"$inc": bson.M{"cancelCnt": 1},
			"$set": bson.M{"updatedAt": now},
			"$setOnInsert": bson.M{
				"userId":    userID,
				"createdAt": now,
			},
		},
		options.Update().SetUpsert(true),
	)
}

// ADMIN: UPDATE ORDER STATUS
func (oc *OrderController) UpdateOrderStatus() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		var req updateStatusReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
			return
		}

		req.OrderID = strings.TrimSpace(req.OrderID)
		req.Status  = strings.TrimSpace(req.Status)

		if req.OrderID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "orderId is required"})
			return
		}

		if err := ValidateOrderStatus(req.Status); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		orderObjID, err := primitive.ObjectIDFromHex(req.OrderID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid orderId"})
			return
		}

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		ctx := c.Request.Context()

		var order orderModels.Order
		err = orderCol.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&order)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if order.Status == req.Status {
			c.JSON(http.StatusOK, gin.H{
				"message": "status unchanged",
				"status":  req.Status,
			})
			return
		}

		_, err = orderCol.UpdateOne(
			ctx,
			bson.M{"_id": order.ID},
			bson.M{"$set": bson.M{
				"status":    req.Status,
				"updatedAt": time.Now(),
			}},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update status"})
			return
		}

		go oc.handlePostStatusActions(order, req.Status)

		c.JSON(http.StatusOK, gin.H{
			"message": "status updated successfully",
			"status":  req.Status,
		})
	}
}

// USER ACTIVITY HELPERS
func (oc *OrderController) handlePostStatusActions(order orderModels.Order, status string) {
	switch status {

	case StatusSold:
		oc.updateUserActivityOnSold(order.UserID, order)

		if err := oc.createInvoiceIfNotExists(order); err != nil {
			// log only — do NOT panic
			log.Printf("invoice creation failed for order %s: %v", order.ID.Hex(), err)
		}

	case StatusCancelled:
		oc.updateUserActivityOnCancel(order.UserID)
	}
}

// USER: UPDATE ORDER STATUS (Arrived → Picked)
func (oc *OrderController) UserUpdateOrderStatus() gin.HandlerFunc {
	return func(c *gin.Context) {

		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		var req updateStatusReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
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

		orderCol := database.GetCollection(
			oc.Client.Database(oc.DBName),
			"orders",
		)

		ctx := c.Request.Context()

		var order orderModels.Order
		err = orderCol.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&order)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if order.UserID != userID {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		if order.Status != StatusArrived {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "order can only be picked after arrival",
			})
			return
		}

		res, err := orderCol.UpdateOne(
			ctx,
			bson.M{
				"_id":    order.ID,
				"status": StatusArrived,
			},
			bson.M{"$set": bson.M{
				"status":    StatusPicked,
				"updatedAt": time.Now(),
			}},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update order"})
			return
		}

		if res.MatchedCount == 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "order already updated"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "order picked successfully",
			"status":  StatusPicked,
		})
	}
}

// Generate Invoice Number
func NextInvoiceNumber(ctx context.Context, db *mongo.Database) (string, error) {
	fy := FinancialYear(time.Now())
	counterID := "invoice_" + fy

	var result struct {
		Seq int64 `bson:"seq"`
	}

	err := db.Collection("counters").FindOneAndUpdate(
		ctx,
		bson.M{"_id": counterID},
		bson.M{"$inc": bson.M{"seq": 1}},
		options.FindOneAndUpdate().
			SetUpsert(true).
			SetReturnDocument(options.After),
	).Decode(&result)

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("BK/%s/%06d", fy, result.Seq), nil
}

// Invoice Handler
func (oc *OrderController) createInvoiceIfNotExists(order orderModels.Order) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	invoiceCol := database.GetCollection(
		oc.Client.Database(oc.DBName),
		"invoices",
	)

	// 1. Prevent duplicate invoice
	count, err := invoiceCol.CountDocuments(ctx, bson.M{
		"orderId": order.ID,
	})
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	// 2. Generate invoice number
	invoiceNumber, err := NextInvoiceNumber(ctx, oc.Client.Database(oc.DBName))
	if err != nil {
		return err
	}

	userCol := database.GetCollection(
		oc.Client.Database(oc.DBName),
		"users",
	)

	var user UserSnapshot
	err = userCol.FindOne(ctx, bson.M{"_id": order.UserID}).Decode(&user)
	if err != nil {
		return err
	}

	// 3. Build invoice snapshot
	invoice := orderModels.Invoice{
		ID:            primitive.NewObjectID(),
		OrderId:       order.ID,
		InvoiceNumber: invoiceNumber,

		Buyer: orderModels.Buyer{
			Name:    "Pawan Kumar Bind",
			Company: "B Tech Kabadiwala",
			UdyamNo: "UDYAM-XX-XXXXXXX",
		},

		Customer: orderModels.Customer{
			UserId:   user.ID,
			Name:     user.Name,
			Phone:    user.Phone,
			Location: order.Location,
		},

		Items: mapOrderItemsToInvoiceItems(order.Items),

		TotalAmount:   order.TotalAmount,
		PaymentStatus: "Paid",

		Date:      time.Now(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// 4. Save invoice
	_, err = invoiceCol.InsertOne(ctx, invoice)
	return err
}

func FinancialYear(t time.Time) string {
	year := t.Year()
	if t.Month() < time.April {
		return fmt.Sprintf("%d-%02d", year-1, year%100)
	}
	return fmt.Sprintf("%d-%02d", year, (year+1)%100)
}

// Helper func to convert order Item to-> Invoice Item
func mapOrderItemsToInvoiceItems(items []orderModels.Item) []orderModels.InvoiceItem {
	invoiceItems := make([]orderModels.InvoiceItem, 0, len(items))

	for _, it := range items {
		invoiceItems = append(invoiceItems, orderModels.InvoiceItem{
			ProductID:   it.ProductID,
			ScrapName:   it.ScrapName,
			MeasureType: it.MeasureType,
			Weight:      it.Weight,
			Piece:       it.Piece,
			Rate:        0,                    // already calculated elsewhere
			Amount:      0,                    // already calculated elsewhere
		})
	}

	return invoiceItems
}
