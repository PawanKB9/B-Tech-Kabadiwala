package centerControllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	centerModels "github.com/PawanKB9/BTechKabadiwala/internal/admin/center/model"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)
type CenterController struct {
	Client *mongo.Client
	DBName string
}

// ADMIN ONLY — 1. Get Center by ID
func (cc *CenterController) GetCenterByID() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		centerIDParam := c.Param("id")
		centerID, err := primitive.ObjectIDFromHex(centerIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid centerId",
			})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		centerCol := database.GetCollection(
			cc.Client.Database(cc.DBName),
			"centers",
		)

		var center centerModels.Center
		err = centerCol.FindOne(ctx, bson.M{"_id": centerID}).Decode(&center)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "center not found",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch center",
			})
			return
		}

		c.JSON(http.StatusOK, center)
	}
}

// ADMIN ONLY — 2. Get Centers by Store ID
func (cc *CenterController) GetCentersByStoreID() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		storeIDParam := c.Param("storeId")
		storeID, err := primitive.ObjectIDFromHex(storeIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid storeId",
			})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		centerCol := database.GetCollection(
			cc.Client.Database(cc.DBName),
			"centers",
		)

		cursor, err := centerCol.Find(ctx, bson.M{"storeId": storeID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch centers",
			})
			return
		}
		defer cursor.Close(ctx)

		var centers []centerModels.Center
		if err := cursor.All(ctx, &centers); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to decode centers",
			})
			return
		}

		c.JSON(http.StatusOK, centers)
	}
}

// ADMIN ONLY — 3. Get All Centers
func (cc *CenterController) GetAllCenters() gin.HandlerFunc {
	return func(c *gin.Context) {

		if !auth.AllowAdminOnly(c) {
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		centerCol := database.GetCollection(
			cc.Client.Database(cc.DBName),
			"centers",
		)

		cursor, err := centerCol.Find(ctx, bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch centers",
			})
			return
		}
		defer cursor.Close(ctx)

		var centers []centerModels.Center
		if err := cursor.All(ctx, &centers); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to decode centers",
			})
			return
		}

		c.JSON(http.StatusOK, centers)
	}
}
