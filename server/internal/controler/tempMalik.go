// package handlers

// import (
// 	"context"
// 	"encoding/json"
// 	"net/http"
// 	"os"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// 	"golang.org/x/crypto/bcrypt"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"your_project/models"
// )

// var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

// type Claims struct {
// 	UserID primitive.ObjectID `json:"id"`
// 	jwt.RegisteredClaims
// }

// // HashPassword hashes a plaintext password
// func HashPassword(password string) (string, error) {
// 	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
// 	return string(bytes), err
// }

// // ComparePassword verifies password with hash
// func ComparePassword(password, hash string) bool {
// 	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
// 	return err == nil
// }

// // GenerateToken generates a JWT for a userID
// func GenerateToken(userID primitive.ObjectID) (string, error) {
// 	expirationTime := time.Now().Add(30 * 24 * time.Hour)
// 	claims := &Claims{
// 		UserID: userID,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString(jwtSecret)
// }

// // MalikSignUp handler
// func MalikSignUp(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		var input struct {
// 			Name     string `json:"name"`
// 			Password string `json:"password"`
// 			PassKey  string `json:"passKey"`
// 			AadharNo int    `json:"aadharNo"`
// 			Email    string `json:"email"`
// 			Phone    string `json:"phone"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		if input.Name == "" || input.Password == "" || input.PassKey == "" || input.AadharNo == 0 || input.Phone == "" {
// 			http.Error(w, "All required fields must be filled", http.StatusBadRequest)
// 			return
// 		}

// 		if input.PassKey != os.Getenv("ADMIN_PASS_KEY") {
// 			http.Error(w, "Incorrect pass key!", http.StatusUnauthorized)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("tempMalik")

// 		// Check if user exists by phone
// 		count, err := collection.CountDocuments(context.TODO(), primitive.M{"phone": input.Phone})
// 		if err != nil {
// 			http.Error(w, "DB error", http.StatusInternalServerError)
// 			return
// 		}
// 		if count > 0 {
// 			http.Error(w, "User already exists with this phone number", http.StatusConflict)
// 			return
// 		}

// 		hashedPass, err := HashPassword(input.Password)
// 		if err != nil {
// 			http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 			return
// 		}

// 		newUser := models.TempMalik{
// 			Name:     input.Name,
// 			Password: hashedPass,
// 			PassKey:  input.PassKey,
// 			AadharNo: input.AadharNo,
// 			Email:    input.Email,
// 			Phone:    input.Phone,
// 			CreatedAt: time.Now(),
// 			UpdatedAt: time.Now(),
// 		}

// 		res, err := collection.InsertOne(context.TODO(), newUser)
// 		if err != nil {
// 			http.Error(w, "Failed to create user", http.StatusInternalServerError)
// 			return
// 		}
// 		newUser.ID = res.InsertedID.(primitive.ObjectID)

// 		token, err := GenerateToken(newUser.ID)
// 		if err != nil {
// 			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
// 			return
// 		}

// 		http.SetCookie(w, &http.Cookie{
// 			Name:     "token",
// 			Value:    token,
// 			HttpOnly: true,
// 			Secure:   true, // set false for dev with http
// 			SameSite: http.SameSiteStrictMode,
// 			Expires:  time.Now().Add(30 * 24 * time.Hour),
// 		})

// 		w.WriteHeader(http.StatusCreated)
// 		json.NewEncoder(w).Encode(struct {
// 			Message   string               `json:"message"`
// 			TempMalik models.TempMalikResponse `json:"tempMalik"`
// 			Token     string               `json:"token"`
// 		}{
// 			Message: "Registered successfully",
// 			TempMalik: models.TempMalikResponse{
// 				ID:       newUser.ID.Hex(),
// 				Name:     newUser.Name,
// 				Phone:    newUser.Phone,
// 				Email:    newUser.Email,
// 				PassKey:  newUser.PassKey,
// 				AadharNo: newUser.AadharNo,
// 			},
// 			Token: token,
// 		})
// 	}
// }

// // Similarly implement MalikLogin, MalikLogout, ChangePassword, ForgotPassword, UpdateContact, GetMalik handlers
