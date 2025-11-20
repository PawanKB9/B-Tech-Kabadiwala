package authKro
// package main

// import (
// 	"context"
// 	"fmt"
// 	"net/http"
// 	"os"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/joho/godotenv"
// 	"golang.org/x/crypto/bcrypt"
// )

// var jwtSecret string

// func init() {
// 	godotenv.Load()
// 	jwtSecret = os.Getenv("JWT_SECRET_KEY")
// 	if jwtSecret == "" {
// 		panic("JWT_SECRET_KEY not set in environment")
// 	}
// }

// // Auth middleware to verify JWT token and attach user to request context
// func Auth(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		cookie, err := r.Cookie("token")
// 		if err != nil {
// 			http.Error(w, `{"message": "Unauthorized access"}`, http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := cookie.Value
// 		claims := jwt.MapClaims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return []byte(jwtSecret), nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, `{"message": "Invalid Token"}`, http.StatusUnauthorized)
// 			return
// 		}
// 		userID := fmt.Sprintf("%v", claims["id"])
// 		ctx := context.WithValue(r.Context(), "userID", userID)
// 		next.ServeHTTP(w, r.WithContext(ctx))
// 	})
// }

// // Generate JWT token for user login/signup
// func GenerateToken(userID string) (string, error) {
// 	claims := jwt.MapClaims{
// 		"id": userID,
// 		"exp": time.Now().Add(30 * 24 * time.Hour).Unix(), // expires in 30 days
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString([]byte(jwtSecret))
// }

// // Hash password using bcrypt
// func HashPassword(password string) (string, error) {
// 	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
// 	return string(bytes), err
// }

// // Compare password with hashed password
// func ComparePassword(password, hash string) bool {
// 	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
// 	return err == nil
// }

// // Admin (Malik) auth middleware
// func MalikAuth(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		cookie, err := r.Cookie("token")
// 		if err != nil {
// 			http.Error(w, `{"message": "Unauthorized access (Admin)"}`, http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := cookie.Value
// 		claims := jwt.MapClaims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return []byte(jwtSecret), nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, `{"message": "Invalid token"}`, http.StatusUnauthorized)
// 			return
// 		}
// 		tempMalikID := fmt.Sprintf("%v", claims["id"])
// 		ctx := context.WithValue(r.Context(), "tempMalikID", tempMalikID)
// 		next.ServeHTTP(w, r.WithContext(ctx))
// 	})
// }
