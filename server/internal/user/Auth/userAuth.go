package userAuth

import (
	"context"
	"errors"
	"net/http"
	"os"
	"time"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/joho/godotenv"
)



const passwordCost = 10

var jwtSecret []byte

func init() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Loading .env Failed")
	}
	fmt.Println(".env variables loaded 1")

	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		panic("JWT_SECRET_KEY not set")
	}
	jwtSecret = []byte(secret)
}

// =========================
// JWT Claims
// =========================
type Claims struct {
	UserID primitive.ObjectID `json:"id"`
	jwt.RegisteredClaims
}

// =========================
// 1. Hash Password
// =========================
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), passwordCost)
	return string(bytes), err
}

// =========================
// 2. Compare Password
// =========================
func ComparePassword(password, hashed string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password)) == nil
}

// =========================
// 3. Generate JWT Token
// =========================
func GenerateToken(userID primitive.ObjectID) (string, error) {
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "BTech Kabadiwala",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// =========================
// 4. Decode Token
// =========================
func DecodeToken(tokenString string) (primitive.ObjectID, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return jwtSecret, nil
	})

	if err != nil {
		return primitive.NilObjectID, err
	}

	if !token.Valid {
		return primitive.NilObjectID, errors.New("invalid token")
	}

	return claims.UserID, nil
}

// =========================
// 5. JWT Auth Middleware
// =========================
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie("token")
		if err != nil || cookie.Value == "" {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}

		userID, err := DecodeToken(cookie.Value)
		if err != nil {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "userID", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

