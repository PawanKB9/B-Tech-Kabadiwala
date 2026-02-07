package auth

import (
	// "context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)

var jwtSecret []byte

type AuthController struct {
	Client *mongo.Client
	DBName string
}

func init() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Could not load env")
	}
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		panic("JWT_SECRET_KEY not defined")
	}
	jwtSecret = []byte(secret)
}

// TOKEN Claim Struct

type AdminClaims struct {
	AdminID  primitive.ObjectID `json:"adminId"`
	CenterID primitive.ObjectID `json:"centerId"`
	Email    string             `json:"email"`
	Phone    string             `json:"phone"`
	Role     string             `json:"role"`
	jwt.RegisteredClaims
}

type CustomerClaims struct {
	UserID   primitive.ObjectID `json:"userId"`
	CenterID primitive.ObjectID `json:"centerId"`
	Role     string             `json:"role"`
	jwt.RegisteredClaims
}

// Token Generation

func GenerateAdminToken(adminID, centerID primitive.ObjectID, email, phone string) (string, error) {
	claims := &AdminClaims{
		AdminID:  adminID,
		CenterID: centerID,
		Email:    email,
		Phone:    phone,
		Role:     "Admin",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "B Tech Kabadiwala Admin",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func GenerateCustomerToken(userID, centerID primitive.ObjectID) (string, error) {
	claims := &CustomerClaims{
		UserID:   userID,
		CenterID: centerID,
		Role:     "customer",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "B Tech Kabadiwala",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Returns either *AdminClaims OR *CustomerClaims
func DecodeAnyToken(tokenString string) (interface{}, error) {

	// Try Admin first
	{
		claims := &AdminClaims{}
		_, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err == nil && claims.Role == "Admin" {
			return claims, nil
		}
	}

	// Try Customer next
	{
		claims := &CustomerClaims{}
		_, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err == nil && claims.Role == "customer" {
			return claims, nil
		}
	}

	return nil, errors.New("invalid token")
}

 // Combined Auth Middleware
func (ac *AuthController) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Set("role", "Public") // Default

		var token string

		// Try to get token from Authorization header first (for production)
		if authHeader := c.GetHeader("Authorization"); authHeader != "" {
			// Extract token from "Bearer <token>"
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				token = authHeader[7:]
			}
		}

		// Fall back to cookie if no Authorization header
		if token == "" {
			token, _ = c.Cookie("admin_token")
		}

		if token == "" {
			token, _ = c.Cookie("token")
		}

		// If we have a token, validate it
		if token != "" {
			decoded, err := DecodeAnyToken(token)
			if err == nil {
				// Try Admin claims
				if adminClaims, ok := decoded.(*AdminClaims); ok {
					c.Set("role", "Admin")
					c.Set("adminID", adminClaims.AdminID)
					c.Set("centerID", adminClaims.CenterID)
					c.Set("email", adminClaims.Email)
					c.Set("phone", adminClaims.Phone)
					c.Next()
					return
				}

				// Try Customer claims
				if customerClaims, ok := decoded.(*CustomerClaims); ok {
					userCol := database.GetCollection(
						ac.Client.Database(ac.DBName),
						"users",
					)

					var user struct{ CenterID primitive.ObjectID }

					err := userCol.FindOne(
						c.Request.Context(),
						bson.M{"_id": customerClaims.UserID},
					).Decode(&user)

					if err == nil {
						c.Set("role", "customer")
						c.Set("userID", customerClaims.UserID)
						c.Set("centerID", user.CenterID)
						c.Next()
						return
					}
				}
			}
		}

		c.Next()
	}
}

// Password Hashing
const passwordCost = 10

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), passwordCost)
	return string(bytes), err
}

func ComparePassword(password, hashed string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password)) == nil
}
