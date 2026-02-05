package itemsControllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	appModels "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/model"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)

// type ItemController struct {
// 	Client *mongo.Client
// 	DBName string
// }

// 1. GET ALL ITEMS (ADMIN ONLY)
func (ic *ItemController) GetAllItems() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		itemCol := database.GetCollection(
			ic.Client.Database(ic.DBName),
			"items",
		)

		cursor, err := itemCol.Find(ctx, bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch items",
			})
			return
		}
		defer cursor.Close(ctx)

		var items []appModels.Item
		if err := cursor.All(ctx, &items); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to decode items",
			})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}

// 2. GET SINGLE ITEM BY ID (ADMIN)
func (ic *ItemController) GetItem() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		itemID := c.Param("id")
		objID, err := primitive.ObjectIDFromHex(itemID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid item ID",
			})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		itemCol := database.GetCollection(
			ic.Client.Database(ic.DBName),
			"items",
		)

		var item appModels.Item
		err = itemCol.FindOne(ctx, bson.M{"_id": objID}).Decode(&item)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "item not found",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch item",
			})
			return
		}

		c.JSON(http.StatusOK, item)
	}
}

// 3. CREATE ITEM (ADMIN ONLY)
func (ic *ItemController) CreateItem() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		var item appModels.Item
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			return
		}

		// Default category
		if item.Category == "" {
			item.Category = "Daily Scraps"
		}

		item.ID = primitive.NewObjectID()
		item.CreatedAt = time.Now()
		item.UpdatedAt = time.Now()

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		itemCol := database.GetCollection(
			ic.Client.Database(ic.DBName),
			"items",
		)

		if _, err := itemCol.InsertOne(ctx, item); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to create item",
			})
			return
		}

		c.JSON(http.StatusCreated, item)
	}
}
