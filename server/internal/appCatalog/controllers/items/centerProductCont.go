package itemsControllers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	appData "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/appData"
	appModels "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/model"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)

type ItemController struct {
	Client *mongo.Client
	DBName string
}

func NewItemsController(client *mongo.Client, dbName string) *ItemController {
	return &ItemController{
		Client: client,
		DBName: dbName,
	}
}

// Helper Func
// getProductsByCenterID fetches categorized products for a center
func (ic *ItemController) GetProductsByCenterID(
	ctx context.Context,
	centerID primitive.ObjectID,
	) (map[string][]appModels.Product, error) {

	centerProductCol := database.GetCollection(
		ic.Client.Database(ic.DBName),
		"centerProducts",
	)

	pipeline := mongo.Pipeline{
		bson.D{{Key: "$match", Value: bson.M{
			"centerId": centerID,
			"isActive": true,
		}}},
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "items",
			"localField":   "scrapItemId",
			"foreignField": "_id",
			"as":           "item",
		}}},
		bson.D{{Key: "$unwind", Value: "$item"}},
		bson.D{{Key: "$project", Value: bson.M{
			"_id":         bson.M{"$toString": "$item._id"},
			"isActive":    1,
			"rate":        1,
			"minWeight":   1,
			"minPiece":    1,
			"measureType": "$item.measureType",
			"scrapName":   "$item.scrapName",
			"imgUrl":      "$item.imgUrl",
			"category":    "$item.category",
			"description": "$item.description",
		}}},
	}

	cursor, err := centerProductCol.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var products []appModels.Product
	if err := cursor.All(ctx, &products); err != nil {
		return nil, err
	}

	categorized := make(map[string][]appModels.Product)
	for _, p := range products {
		categorized[p.Category] = append(categorized[p.Category], p)
	}

	return categorized, nil
}

// Scrap Product Details [Dummy Sample data for public user,
//  Admin + Cutomer data According to their Center only, 
// No data for different, Another, Wrong and No CenterId]
func (ic *ItemController) GetProducts() gin.HandlerFunc {
	return func(c *gin.Context) {

		// ---------- REQUIRED CONTEXT ----------
		roleAny, roleExists := c.Get("role")
		centerAny, centerExists := c.Get("centerID")

		if !roleExists || !centerExists {
			c.JSON(http.StatusForbidden, gin.H{"error": "authentication context missing"})
			return
		}

		role, ok := roleAny.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid role format"})
			return
		}

		// Accept both string and primitive.ObjectID
		var tokenCenterID string
		switch v := centerAny.(type) {
		case string:
			tokenCenterID = v
		case primitive.ObjectID:
			tokenCenterID = v.Hex()
		case *primitive.ObjectID:
			tokenCenterID = v.Hex()
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid center id format in token"})
			return
		}

		if tokenCenterID == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "center access not allowed"})
			return
		}

		// ---------- URL PARAM ----------
		centerIDParam := c.Param("centerID")
		if centerIDParam == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "centerId is required",
			})
			return
		}

		// ---------- AUTHORIZATION ----------
		if role != "admin" && centerIDParam != tokenCenterID {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "unauthorized: cannot access another center's data",
			})
			return
		}

		// ---------- OBJECT ID ----------
		centerObjID, err := primitive.ObjectIDFromHex(centerIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid centerID",
			})
			return
		}

		// ---------- FETCH ----------
		categorized, err := ic.GetProductsByCenterID(
			c.Request.Context(),
			centerObjID,
		)
		if err != nil || len(categorized) == 0 {
			c.JSON(http.StatusOK, appData.SampleProducts)
			return
		}

		c.JSON(http.StatusOK, categorized)
	}
}


// creating center product
// func CreateCenterProduct(c *gin.Context) {
// 	// Using the imported appModels.CenterProduct type
// 	var product appModels.CenterProduct
// 	if err := c.BindJSON(&product); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Good practice: Use a context with a timeout for database operations
// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	product.ID = primitive.NewObjectID()
// 	product.CreatedAt = time.Now()
// 	product.UpdatedAt = time.Now()

// 	_, err := database.CenterProductCollection.InsertOne(ctx, product) // Using ctx with timeout
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, product) // Using http.StatusCreated (201)
// }