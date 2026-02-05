package userControllers

import (
	"context"
	// "net/http"
	"time"
	"reflect"
	"fmt"
	"github.com/gin-gonic/gin/binding"

	"github.com/gin-gonic/gin"

	"github.com/PawanKB9/BTechKabadiwala/internal/database"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	userModels "github.com/PawanKB9/BTechKabadiwala/internal/user/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserController struct {
	Client *mongo.Client
	DBName string
}

// func NewUserController(client *mongo.Client, dbName string) *UserController {
// 	return &UserController{
// 		Client: client,
// 		DBName: dbName,
// 	}
// }

// ================= SIGN UP =================
func (uc *UserController) SignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		otpVerifiedAny, exists := c.Get("otp_verified")
		otpVerified := exists && otpVerifiedAny == true

		var input struct {
			Name          string                  `json:"name"`
			Password      string                  `json:"password"`
			Phone         string                  `json:"phone"`
			Role          string                  `json:"role"`
			Location      userModels.GeoJSONPoint `json:"location"`
		}

		if err := c.ShouldBindBodyWith(&input, binding.JSON); err != nil {
			fmt.Printf("[SignUp] invalid request body: %v\n", err)
			c.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}
		// fmt.Printf(input.payload)

		if input.Name == "" || input.Phone == "" || len(input.Location.Coordinates) != 2 {
			c.JSON(400, gin.H{"error": "Fields (name, phone, location) are required"})
			return
		}

		if input.Location.Type == "" {
			input.Location.Type = "Point"
		}

		defaultCenterID, err := primitive.ObjectIDFromHex("692d7f8cbc4f16c1dd0ffe65")
		if err != nil {
			fmt.Printf("[SignUp] invalid default center id: %v\n", err)
			c.JSON(400, gin.H{"error": "invalid id"})
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
			fmt.Printf("[SignUp] center $near failed, using default: %v\n", err)
		}

		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		var existing userModels.User
		err = userCollection.FindOne(ctx, bson.M{"phone": input.Phone}).Decode(&existing)
		userExists := err == nil

		var hashed string
		now := time.Now()

		if otpVerified {
			if input.Password == "" {
				c.JSON(400, gin.H{"error": "Password required when OTP is verified"})
				return
			}

			hashed, err = auth.HashPassword(input.Password)
			if err != nil {
				fmt.Printf("[SignUp] password hashing failed: %v\n", err)
				c.JSON(500, gin.H{"error": "Password hashing error"})
				return
			}
		}

		// ---------------- EXISTING USER ----------------
		if userExists {
			updateData := bson.M{
				"$set": bson.M{
					"name":       input.Name,
					"phone":      input.Phone,
					"role":       input.Role,
					"isVerified": otpVerified,
					"centerId":   assignedCenterID,
					"location":   input.Location,
					"updatedAt":  now,
				},
				"$addToSet": bson.M{
					"savedLocation": input.Location,
				},
			}

			if otpVerified {
				updateData["$set"].(bson.M)["password"] = hashed
				updateData["$set"].(bson.M)["passwordChangedAt"] = now
				updateData["$set"].(bson.M)["lastTokenIssuedAt"] = now
			}

			_, err = userCollection.UpdateByID(ctx, existing.ID, updateData)
			if err != nil {
				fmt.Printf("[SignUp] UpdateByID failed | userID=%v | err=%v\n", existing.ID, err)
				c.JSON(500, gin.H{"error": "Failed to update user"})
				return
			}

			existing.Name = input.Name
			existing.Role = input.Role
			existing.IsVerified = otpVerified
			existing.Location = input.Location
			existing.CenterID = assignedCenterID
			existing.UpdatedAt = now

			if otpVerified {
				existing.Password = hashed
				existing.PasswordChangedAt = now
				existing.LastTokenIssuedAt = now
			}

			if existing.SavedLocation == nil {
				existing.SavedLocation = []userModels.GeoJSONPoint{}
			}

			found := false
			for _, loc := range existing.SavedLocation {
				if reflect.DeepEqual(loc, input.Location) {
					found = true
					break
				}
			}
			if !found {
				existing.SavedLocation = append(existing.SavedLocation, input.Location)
			}

			var token string
			if otpVerified {
				token, err = auth.GenerateCustomerToken(existing.ID, assignedCenterID)
				if err != nil {
					fmt.Printf("[SignUp] token generation failed | userID=%v | err=%v\n", existing.ID, err)
					c.JSON(500, gin.H{"error": "Token generation error"})
					return
				}
				c.SetCookie("token", token, 60*60*24*30, "/", "", false, true)
			}

			c.JSON(200, gin.H{
				"message":  "User updated successfully",
				"user":     existing,
				"centerId": assignedCenterID,
				"token":    token,
			})
			return
		}

		// ---------------- NEW USER ----------------
		newUser := userModels.User{
			Name:              input.Name,
			Phone:             input.Phone,
			Role:              input.Role,
			IsVerified:        otpVerified,
			Password:          hashed,
			Location:          input.Location,
			SavedLocation:     []userModels.GeoJSONPoint{input.Location},
			CenterID:          assignedCenterID,
			CreatedAt:         now,
			UpdatedAt:         now,
			PasswordChangedAt: now,
			LastTokenIssuedAt: now,
		}

		res, err := userCollection.InsertOne(ctx, newUser)
		if err != nil {
			fmt.Printf("[SignUp] InsertOne failed | phone=%s | err=%v\n", newUser.Phone, err)
			c.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}

		newUser.ID = res.InsertedID.(primitive.ObjectID)

		var token string
		if otpVerified {
			token, err = auth.GenerateCustomerToken(newUser.ID, assignedCenterID)
			if err != nil {
				fmt.Printf("[SignUp] token generation failed | userID=%v | err=%v\n", newUser.ID, err)
				c.JSON(500, gin.H{"error": "Token generation failed"})
				return
			}
			c.SetCookie("token", token, 60*60*24*30, "/", "", false, true)
		}

		c.JSON(200, gin.H{
			"message":  "User created successfully",
			"user":     newUser,
			"centerId": assignedCenterID,
			"token":    token,
		})
	}
}

// ================= LOGIN =================
func (uc *UserController) Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		var input struct {
			Phone    string `json:"phone"`
			Password string `json:"password"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid body"})
			return
		}

		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		var user userModels.User
		err := userCollection.FindOne(ctx, bson.M{"phone": input.Phone}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			c.JSON(401, gin.H{"error": "Invalid phone or password"})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "DB error"})
			return
		}

		if !auth.ComparePassword(input.Password, user.Password) {
			c.JSON(401, gin.H{"error": "Invalid phone or password"})
			return
		}

		var token string

		if user.Role == "Admin" {
			token, err = auth.GenerateAdminToken(
				user.ID,
				user.CenterID,
				user.Email,
				user.Phone,
			)

			if err != nil {
				c.JSON(500, gin.H{"error": "Admin token generation failed"})
				return
			}

			c.SetCookie("admin_token", token, 60*60*24*30, "/", "", false, true)

		} else {
			token, err = auth.GenerateCustomerToken(user.ID, user.CenterID)
			if err != nil {
				c.JSON(500, gin.H{"error": "Customer token generation failed"})
				return
			}

			c.SetCookie("token", token, 60*60*24*30, "/", "", false, true)
		}

		c.JSON(200, gin.H{
			"message": "Login successful",
			"user":    user,
			"token":   token,
			"role":    user.Role,
		})
	}
}

// ================= GET CURRENT USER =================
func (uc *UserController) GetCurrentUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		var userID primitive.ObjectID
		var role string

		// ---------- CUSTOMER ----------
		if userIDRaw, ok := c.Get("userID"); ok {
			userID = userIDRaw.(primitive.ObjectID)
			role = "Customer"
		}

		// ---------- ADMIN ----------
		if adminIDRaw, ok := c.Get("adminID"); ok {
			userID = adminIDRaw.(primitive.ObjectID)
			role = "Admin"
		}

		if userID.IsZero() {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			return
		}

		var user userModels.User
		err := userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		user.Password = ""

		c.JSON(200, gin.H{
			"role": role,
			"user": user,
		})
	}
}

// ================= LOGOUT =================
func (uc *UserController) Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		//Auth context
		_, exists := c.Get("userID")
		_, ok := c.Get("adminID")
		if !exists && !ok {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			return
		}
		c.SetCookie("token", "", -1, "/", "", false, true)
		c.SetCookie("admin_token", "", -1, "/", "", false, true)

		c.JSON(200, gin.H{
			"message": "Logout successful",
		})
	}
}
