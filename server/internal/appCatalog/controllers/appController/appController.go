package appControllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	appModels "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/model"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)
type AppController struct {
	Client *mongo.Client
	DBName string
}
const (
	AppDataID = "692e77248c5fdd219c63966b"
)

func NewAppController(client *mongo.Client, dbName string) *AppController {
	return &AppController{
		Client: client,
		DBName: dbName,
	}
}

// All are public Data no need for any Auth
func (ac *AppController) GetAppData() gin.HandlerFunc {
	return func(c *gin.Context) {

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		appDataCol := database.GetCollection(
			ac.Client.Database(ac.DBName),
			"appDatas",
		)

		objID, err := primitive.ObjectIDFromHex(AppDataID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "invalid AppData ID configuration",
			})
			return
		}

		var data appModels.AppData
		err = appDataCol.FindOne(ctx, bson.M{"_id": objID}).Decode(&data)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "app data not found",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch app data",
			})
			return
		}

		c.JSON(http.StatusOK, data)
	}
}
