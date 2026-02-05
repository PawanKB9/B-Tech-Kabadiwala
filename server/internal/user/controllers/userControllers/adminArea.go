package userControllers

import (
	"context"
	"time"
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/PawanKB9/BTechKabadiwala/internal/database"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	userModels "github.com/PawanKB9/BTechKabadiwala/internal/user/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)


// ================= Admin Creates New User =================
func (uc *UserController) CreateUserByAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		// ---------------- REQUEST BODY ----------------
		var input struct {
			Name     string                  `json:"name"`
			Phone    string                  `json:"phone"`
			Location userModels.GeoJSONPoint `json:"location"`
		}

		if !auth.AllowAdminOnly(c) {
			return
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			fmt.Printf("[CreateUserByAdmin] invalid request body: %v\n", err)
			c.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}

		if input.Name == "" || input.Phone == "" || len(input.Location.Coordinates) != 2 {
			c.JSON(400, gin.H{
				"error": "Fields (name, phone, location) are required",
			})
			return
		}

		if input.Location.Type == "" {
			input.Location.Type = "Point"
		}

		// ---------------- CENTER ASSIGNMENT ----------------
		defaultCenterID, err := primitive.ObjectIDFromHex("692d7f8cbc4f16c1dd0ffe65")
		if err != nil {
			fmt.Printf("[CreateUserByAdmin] invalid default center id: %v\n", err)
			c.JSON(500, gin.H{"error": "Server configuration error"})
			return
		}

		centersCol := uc.Client.Database(uc.DBName).Collection("centers")

		var nearestCenter struct {
			ID primitive.ObjectID `bson:"_id"`
		}

		err = centersCol.FindOne(ctx, bson.M{
			"location": bson.M{
				"$near": bson.M{
					"$geometry": bson.M{
						"type":        "Point",
						"coordinates": input.Location.Coordinates,
					},
				},
			},
		}).Decode(&nearestCenter)

		assignedCenterID := defaultCenterID
		if err == nil {
			assignedCenterID = nearestCenter.ID
		} else {
			fmt.Printf("[CreateUserByAdmin] center $near failed, using default: %v\n", err)
		}

		// ---------------- USER COLLECTION ----------------
		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		// ---------------- CHECK EXISTING USER ----------------
		var existing userModels.User
		err = userCollection.FindOne(ctx, bson.M{
			"phone": input.Phone,
		}).Decode(&existing)

		if err == nil {
			// USER ALREADY EXISTS
			c.JSON(200, gin.H{
				"message": fmt.Sprintf(
					"User Already exist with this Phone %s",
					existing.Phone,
				),
				"user": existing,
			})
			return
		}

		if err != mongo.ErrNoDocuments {
			fmt.Printf("[CreateUserByAdmin] FindOne error: %v\n", err)
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		// ---------------- CREATE NEW USER ----------------
		now := time.Now()

		newUser := userModels.User{
			Name:          input.Name,
			Phone:         input.Phone,
			Role:          "customer", // fixed role for admin-created users
			IsVerified:    false,
			Location:      input.Location,
			SavedLocation: []userModels.GeoJSONPoint{input.Location},
			CenterID:      assignedCenterID,
			CreatedAt:     now,
			UpdatedAt:     now,
		}

		res, err := userCollection.InsertOne(ctx, newUser)
		if err != nil {
			fmt.Printf("[CreateUserByAdmin] InsertOne failed | phone=%s | err=%v\n", input.Phone, err)
			c.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}

		newUser.ID = res.InsertedID.(primitive.ObjectID)

		c.JSON(201, gin.H{
			"message": "User created successfully by admin",
			"user":    newUser,
		})
	}
}

// Admin Read any user by UserId or Phone number
func (uc *UserController) GetUserByAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		phone := c.Query("phone")
		userIDStr := c.Query("userId")

		if phone == "" && userIDStr == "" {
			c.JSON(400, gin.H{
				"error": "Either phone or userId is required",
			})
			return
		}

		if phone != "" && userIDStr != "" {
			c.JSON(400, gin.H{
				"error": "Provide only one identifier (phone or userId)",
			})
			return
		}

		if !auth.AllowAdminOnly(c) {
			return
		}

		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		filter := bson.M{}

		if phone != "" {
			filter["phone"] = phone
		} else {
			userID, err := primitive.ObjectIDFromHex(userIDStr)
			if err != nil {
				c.JSON(400, gin.H{"error": "Invalid userId"})
				return
			}
			filter["_id"] = userID
		}

		var user userModels.User
		err := userCollection.FindOne(ctx, filter).Decode(&user)

		if err == mongo.ErrNoDocuments {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}

		if err != nil {
			fmt.Printf("[GetUserByAdmin] FindOne error: %v\n", err)
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		c.JSON(200, gin.H{
			"user": user,
		})
	}
}
