package userControllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
	"fmt"

	"github.com/PawanKB9/BTechKabadiwala/internal/database"
	"github.com/PawanKB9/BTechKabadiwala/internal/user/models"
	"github.com/PawanKB9/BTechKabadiwala/internal/user/Auth"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var DB_NAME = "BTechKabadiwala"

// Signup
func SignUp(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()

		var input struct {
			Name          string                  `json:"name"`
			Password      string                  `json:"password"`
			Phone         string                  `json:"phone"`
			Role          string                  `json:"role"`
			IsOtpVerified bool                    `json:"isOtpVerified"`
			Location      userModels.GeoJSONPoint `json:"location"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate fields
		if input.Name == "" || input.Phone == "" || len(input.Location.Coordinates) != 2 {
			http.Error(w, "Fields (name, phone, location) are required", http.StatusBadRequest)
			return
		}

		// Allowed roles
		validRoles := map[string]bool{
			"Customer":       true,
			"Delivery Boy":   true,
			"Center Manager": true,
			"Store Manager":  true,
			"Admin":          true,
		}

		if input.Role == "" || !validRoles[input.Role] {
			input.Role = "Customer"
		}

		if input.Location.Type == "" {
			input.Location.Type = "Point"
		}

		userCollection := database.GetCollection(client, DB_NAME, "users")

		// Check if user exists
		var existing userModels.User
		err := userCollection.FindOne(ctx, bson.M{"phone": input.Phone}).Decode(&existing)

		userExists := err == nil

		// Case: User exists but is verified → ERROR
		if userExists && existing.IsVerified {
			http.Error(w, "User already exists", http.StatusBadRequest)
			return
		}

		// Password logic
		var hashed string
		if input.IsOtpVerified {
			if input.Password == "" {
				http.Error(w, "Password required when OTP verified", http.StatusBadRequest)
				return
			}
			hashed, err = userAuth.HashPassword(input.Password)
			if err != nil {
				http.Error(w, "Password hashing error", http.StatusInternalServerError)
				return
			}
		} else {
			hashed = ""
		}

		// Location handling
		savedLocations := []userModels.GeoJSONPoint{input.Location}

		// CASE B: User exists & not verified → UPDATE it
		if userExists && !existing.IsVerified {

			updateData := bson.M{
				"$set": bson.M{
					"name":           input.Name,
					"phone":          input.Phone,
					"role":           input.Role,
					"password":       hashed,
					"isVerified":     input.IsOtpVerified,
					"primeLocation":  input.Location,
					"savedLocations": savedLocations,
					"updatedAt":      time.Now(),
				},
			}

			_, err := userCollection.UpdateByID(ctx, existing.ID, updateData)
			if err != nil {
				http.Error(w, "Failed to update user", http.StatusInternalServerError)
				return
			}

			// Refresh object
			existing.Name = input.Name
			existing.Role = input.Role
			existing.Password = hashed
			existing.IsVerified = input.IsOtpVerified
			existing.Location = input.Location
			existing.SavedLocation = savedLocations
			existing.UpdatedAt = time.Now()

			// Create JWT only if verified
			var token string
			if input.IsOtpVerified {
				token, err = userAuth.GenerateToken(existing.ID)
				if err != nil {
					http.Error(w, "Token generation error", http.StatusInternalServerError)
					return
				}

				http.SetCookie(w, &http.Cookie{
					Name:     "token",
					Value:    token,
					HttpOnly: true,
					SameSite: http.SameSiteLaxMode,
					Expires:  time.Now().Add(30 * 24 * time.Hour),
				})
			}

			json.NewEncoder(w).Encode(struct {
				Message string             `json:"message"`
				User    userModels.User    `json:"user"`
				Token   string             `json:"token,omitempty"`
			}{
				Message: "User created successfully",
				User:    existing,
				Token:   token,
			})

			return
		}

		// CASE A: User does NOT exist → CREATE new
		newUser := userModels.User{
			Name:          input.Name,
			Phone:         input.Phone,
			Role:          input.Role,
			Password:      hashed,
			IsVerified:    input.IsOtpVerified,
			Location:      input.Location,
			SavedLocation: savedLocations,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		res, err := userCollection.InsertOne(ctx, newUser)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		newUser.ID = res.InsertedID.(primitive.ObjectID)

		// Create token if verified
		var token string
		if input.IsOtpVerified {
			token, err = userAuth.GenerateToken(newUser.ID)
			if err != nil {
				http.Error(w, "Token generation error", http.StatusInternalServerError)
				return
			}

			http.SetCookie(w, &http.Cookie{
				Name:     "token",
				Value:    token,
				HttpOnly: true,
				SameSite: http.SameSiteLaxMode,
				Expires:  time.Now().Add(30 * 24 * time.Hour),
			})
		}

		json.NewEncoder(w).Encode(struct {
			Message string             `json:"message"`
			User    userModels.User    `json:"user"`
			Token   string             `json:"token,omitempty"`
		}{
			Message: "User created successfully",
			User:    newUser,
			Token:   token,
		})
	}
}

// Login
func Login(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()
		var input struct {
			Phone    string `json:"phone"`
			Password string `json:"password"`
		}
		
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid body", http.StatusBadRequest)
			return
		}
		
		userCollection := database.GetCollection(client, DB_NAME, "users")
		
		var user userModels.User
		err := userCollection.FindOne(ctx, bson.M{"phone": input.Phone}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Invalid phone or password", http.StatusUnauthorized)
			return
			} else if err != nil {
				http.Error(w, "DB error", http.StatusInternalServerError)
				return
			}
			fmt.Println("hello there")
			
		if !userAuth.ComparePassword(input.Password, user.Password) {
			http.Error(w, "Invalid phone or password", http.StatusUnauthorized)
			return
		}

		token, err := userAuth.GenerateToken(user.ID)
		if err != nil {
			http.Error(w, "Token generation failed", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "token",
			Value:    token,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Expires:  time.Now().Add(30 * 24 * time.Hour),
		})

		json.NewEncoder(w).Encode(struct {
			Message string      `json:"message"`
			User    userModels.User `json:"user"`
			Token   string      `json:"token"`
		}{
			Message: "Login successful",
			User:    user,
			Token:   token,
		})
	}
}

// Get Current User
func GetCurrentUser(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()

		userID, ok := r.Context().Value("userID").(primitive.ObjectID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userCollection := database.GetCollection(client, DB_NAME, "users")
		var user userModels.User
		err := userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}

		user.Password = ""

		json.NewEncoder(w).Encode(user)
	}
}

// Logout
func Logout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
			http.SetCookie(w, &http.Cookie{
				Name:     "token",
				Value:    "",
				MaxAge:   -1,
				HttpOnly: true,
				SameSite: http.SameSiteStrictMode,
			})

			json.NewEncoder(w).Encode(map[string]string{
				"message": "Logout successful",
			})
	}
}
