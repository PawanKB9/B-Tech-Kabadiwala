package userControllers

import (
	"context"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/PawanKB9/BTechKabadiwala/internal/database"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	userModels "github.com/PawanKB9/BTechKabadiwala/internal/user/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// type UserController struct {
// 	Client *mongo.Client
// 	DBName string
// }

func NewUserController(client *mongo.Client, dbName string) *UserController {
	return &UserController{
		Client: client,
		DBName: dbName,
	}
}

// ================= HELPER FUNCTIONS =================
func isValidEmail(email string) bool {
	re := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(re, email)
	return matched
}

func coordsEqual(a, b []float64) bool {
	if len(a) != 2 || len(b) != 2 {
		return false
	}
	return a[0] == b[0] && a[1] == b[1]
}

func isValidIndianPhone(phone string) bool {
	re := `^(\+91)?[6-9][0-9]{9}$`
	matched, _ := regexp.MatchString(re, phone)
	return matched
}

// ================= UPDATE USER INFO =================
func (uc *UserController) UpdateUserInfo() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		userIDValue, exists := c.Get("userID")
		if !exists {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			return
		}
		userID := userIDValue.(primitive.ObjectID)

		var input struct {
			Name          string                  `json:"name"`
			Phone         string                  `json:"phone"`
			AltPhone      string                  `json:"altPhone"`
			Email         string                  `json:"email"`
			Location      userModels.GeoJSONPoint `json:"location"`
			IsOtpVerified bool                    `json:"isOtpVerified"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}

		userCol := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)
		centerCol := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"centers",
		)

		var user userModels.User
		if err := userCol.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}

		update := bson.M{}
		set := bson.M{}
		var addToSet bson.M // used to $addToSet savedLocation when location changes

		if input.Name != "" {
			set["name"] = input.Name
		}

		if input.Email != "" {
			if !isValidEmail(input.Email) {
				c.JSON(400, gin.H{"error": "Invalid email"})
				return
			}
			set["email"] = input.Email
		}

		if input.Phone != "" && input.Phone != user.Phone {
			if !input.IsOtpVerified {
				c.JSON(400, gin.H{"error": "Phone change requires OTP verification"})
				return
			}
			set["phone"] = input.Phone
		}

		if input.AltPhone != "" {
			if !isValidIndianPhone(input.AltPhone) {
				c.JSON(400, gin.H{"error": "Invalid alt phone"})
				return
			}
			set["altPhone"] = input.AltPhone
		}

		// If a valid location is provided, check if coordinates changed.
		if len(input.Location.Coordinates) == 2 {
			if input.Location.Type == "" {
				input.Location.Type = "Point"
			}

			locationChanged := !coordsEqual(
				input.Location.Coordinates,
				user.Location.Coordinates,
			)

			if locationChanged {
				// set the new location (including Landmark, Street, HouseNo, etc.)
				set["location"] = input.Location

				// find nearest center (existing logic preserved)
				defaultCenterID, _ := primitive.ObjectIDFromHex("692d7f8cbc4f16c1dd0ffe65")

				var nearestCenter struct {
					ID primitive.ObjectID `bson:"_id"`
				}

				err := centerCol.FindOne(ctx, bson.M{
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
				}

				set["centerId"] = assignedCenterID

				// Ensure savedLocation receives this location only if not already present
				addToSet = bson.M{
					"savedLocation": input.Location,
				}
			}
		}

		if len(set) == 0 && addToSet == nil {
			c.JSON(400, gin.H{"error": "Nothing to update"})
			return
		}

		set["updatedAt"] = time.Now()
		update["$set"] = set

		// include $addToSet if needed (preserves uniqueness on DB side)
		if addToSet != nil {
			update["$addToSet"] = addToSet
		}

		if _, err := userCol.UpdateByID(ctx, userID, update); err != nil {
			c.JSON(500, gin.H{"error": "Failed to update user"})
			return
		}

		c.JSON(200, gin.H{"message": "User updated successfully"})
	}
}

// ================= FORGOT PASSWORD =================
func (uc *UserController) ForgotPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		var input struct {
			UserID      primitive.ObjectID `json:"userId"`
			NewPassword string             `json:"newPassword"`
		}

		if err := c.ShouldBindJSON(&input); err != nil || input.NewPassword == "" {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		if len(input.NewPassword) < 6 {
			c.JSON(400, gin.H{"error": "Password must be at least 6 characters"})
			return
		}

		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		extra := bson.M{"sessionVersion": 1}

		if err := UpdateUserPassword(
			ctx,
			userCollection,
			input.UserID,
			input.NewPassword,
			extra,
		); err != nil {
			c.JSON(500, gin.H{"error": "Failed to update password"})
			return
		}

		c.JSON(200, gin.H{"message": "Password reset successfully"})
	}
}

// ================= CHANGE PASSWORD =================
func (uc *UserController) ChangePassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.TODO()

		//Auth context
		userIDVal, exists := c.Get("userID")
		if !exists {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			return
		}
		userID := userIDVal.(primitive.ObjectID)

		//Input
		var input struct {
			OldPassword string `json:"oldPassword"`
			NewPassword string `json:"newPassword"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		if input.OldPassword == "" || input.NewPassword == "" {
			c.JSON(400, gin.H{"error": "Both old and new password are required"})
			return
		}

		if len(input.NewPassword) < 6 {
			c.JSON(400, gin.H{"error": "Password must be at least 6 characters"})
			return
		}

		//Load user by userID (NOT phone)
		userCollection := database.GetCollection(
			uc.Client.Database(uc.DBName),
			"users",
		)

		var user userModels.User
		err := userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "DB error"})
			return
		}

		//Verify old password
		if !auth.ComparePassword(input.OldPassword, user.Password) {
			c.JSON(401, gin.H{"error": "Old password is incorrect"})
			return
		}

		//Update password (reuse core logic)
		extra := bson.M{
			"sessionVersion": user.SessionVersion + 1, // optional but recommended
		}

		if err := UpdateUserPassword(
			ctx,
			userCollection,
			userID,
			input.NewPassword,
			extra,
		); err != nil {
			c.JSON(500, gin.H{"error": "Failed to update password"})
			return
		}

		c.JSON(200, gin.H{"message": "Password updated successfully"})
	}
}

// ================= PASSWORD CORE LOGIC (UNCHANGED) =================
func UpdateUserPassword(
	ctx context.Context,
	userCollection *mongo.Collection,
	userID primitive.ObjectID,
	newPassword string,
	extraFields bson.M,
    ) error {

	hashed, err := auth.HashPassword(newPassword)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"password":          hashed,
			"passwordChangedAt": time.Now(),
			"lastTokenIssuedAt": time.Now(),
			"updatedAt":         time.Now(),
		},
	}

	if extraFields != nil {
		for k, v := range extraFields {
			update["$set"].(bson.M)[k] = v
		}
	}

	_, err = userCollection.UpdateByID(ctx, userID, update)
	return err
}
