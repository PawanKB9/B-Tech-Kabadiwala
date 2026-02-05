package cartControllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
)

type CartController struct {
	Client *mongo.Client
	DBName string
}

func NewCartController(client *mongo.Client, dbName string) *CartController {
	return &CartController{
		Client: client,
		DBName: dbName,
	}
}

// Helper Func
func validateItems(items []orderModels.Item) error {
	if len(items) == 0 {
		return fmt.Errorf("items cannot be empty")
	}

	for _, it := range items {
		if it.ProductID.IsZero() {
			return fmt.Errorf("invalid productId")
		}
		if it.MeasureType != "weight" && it.MeasureType != "piece" {
			return fmt.Errorf("measureType must be weight or piece")
		}
		if it.MeasureType == "weight" && it.Weight <= 0 {
			return fmt.Errorf("weight must be greater than 0")
		}
		if it.MeasureType == "piece" && it.Piece <= 0 {
			return fmt.Errorf("piece must be greater than 0")
		}
	}

	return nil
}

// 1. GET CART (Customer Only)
func (uc *CartController) GetCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		cartCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"carts",
		)

		var cart orderModels.Cart
		err := cartCollection.FindOne(ctx, bson.M{"userId": userID}).Decode(&cart)

		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusOK, gin.H{"items": []orderModels.Item{}})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		c.JSON(http.StatusOK, cart)
	}
}

// 2. UPSERT CART (Customer Only)
func (uc *CartController) UpsertCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		var req struct {
			Items []orderModels.Item `json:"items"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := validateItems(req.Items); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		cartCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"carts",
		)

		now := time.Now()

		update := bson.M{
			"$set": bson.M{
				"items":     req.Items,
				"updatedAt": now,
			},
			"$setOnInsert": bson.M{
				"_id":       primitive.NewObjectID(),
				"userId":    userID,
				"createdAt": now,
			},
		}

		_, err := cartCollection.UpdateOne(
			ctx,
			bson.M{"userId": userID},
			update,
			options.Update().SetUpsert(true),
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "cart updated"})
	}
}

// 3. CLEAR CART (Customer Only)
func (uc *CartController) ClearCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		userID, ok := auth.AllowCustomerOnly(c)
		if !ok {
			return
		}

		cartCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"carts",
		)

		_, err := cartCollection.DeleteOne(ctx, bson.M{"userId": userID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "cart cleared"})
	}
}
