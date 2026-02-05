package auth

import (
	// "context"
	"net/http"
	"time"
	// "fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)

// type AuthController struct {
// 	Client *mongo.Client
// 	DBName string
// }


// ADMIN-ONLY VALIDATION
func AllowAdminOnly(c *gin.Context) bool {
	roleAny, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}

	role, _ := roleAny.(string)
	if role != "Admin" { // "Admin" with uppercase A (consistent with token claims)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "admin access only"})
		return false
	}

	return true
}

// USER Validation (Helper Func)
func AllowCustomerOnly(c *gin.Context) (primitive.ObjectID, bool) {
	roleVal, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return primitive.NilObjectID, false
	}

	role := roleVal.(string)
	// fmt.Println("ROLE IN CONTEXT:", role, c.GetString("role"))
	if role != "customer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "customer access only"})
		return primitive.NilObjectID, false
	}

	uid, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "userID missing"})
		return primitive.NilObjectID, false
	}

	userID, ok := uid.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid userID"})
		return primitive.NilObjectID, false
	}

	return userID, true
}

// validates token (to force log-out after password change)
func (ac *AuthController) TokenValidityMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		tokenStr, _ := c.Cookie("token")
		if tokenStr == "" {
			c.Next()
			return
		}

		decoded, err := DecodeAnyToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
			return
		}

		claims, ok := decoded.(*CustomerClaims)
		if !ok {
			c.Next() // Admin tokens not validated here
			return
		}

		userCol := database.GetCollection(
			ac.Client.Database(ac.DBName),
			"users",
		)

		var user struct {
			PasswordChangedAt time.Time `bson:"passwordChangedAt"`
		}

		err = userCol.FindOne(
			c.Request.Context(),
			bson.M{"_id": claims.UserID},
		).Decode(&user)

		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
			return
		}

		// Token must be newer than last password change
		if claims.IssuedAt.Time.Before(user.PasswordChangedAt) {
			c.AbortWithStatusJSON(401, gin.H{"error": "token_invalidated"})
			return
		}

		c.Next()
	}
}
