package userActivityControllers

// create & update ( later )

// clear everything of user's ( later by clear my data )

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	userModels "github.com/PawanKB9/BTechKabadiwala/internal/user/model"
)

type UserActivityController struct {
	Collection *mongo.Collection
}

func NewUserActivityController(db *mongo.Database) *UserActivityController {
	return &UserActivityController{
		Collection: db.Collection("userActivity"),
	}
}

// GET /user/activity
func (uc *UserActivityController) GetUserActivity() gin.HandlerFunc {
	return func(c *gin.Context) {

		roleVal, exists := c.Get("role")
		if !exists || roleVal != "customer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized access",
			})
			return
		}

		userIDVal, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "user not authenticated",
			})
			return
		}

		userID, ok := userIDVal.(primitive.ObjectID)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "invalid user id",
			})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var activity userModels.UserActivity

		err := uc.Collection.FindOne(ctx, bson.M{
			"userId": userID,
		}).Decode(&activity)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{
					"message": "user activity not found",
				})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "failed to fetch user activity",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": activity,
		})
	}
}
