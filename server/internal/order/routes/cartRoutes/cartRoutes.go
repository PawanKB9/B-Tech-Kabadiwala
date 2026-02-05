package cartRoutes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"

	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"
	cartControllers "github.com/PawanKB9/BTechKabadiwala/internal/order/controllers/cart"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
)

// NOTE: We are using Non-blocking Auth middleware
func RegisterCartRoutes(
	r *gin.Engine,
	client *mongo.Client,
	dbName string,
) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	api := r.Group("/api/cart")
	api.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	// Correct controller instance (DB-safe)
	cartCtrl := cartControllers.NewCartController(client, dbName)

	// Get user's cart
	api.GET("/data", cartCtrl.GetCart())

	// Create / Update cart (UPSERT)
	api.PUT("/upsert", cartCtrl.UpsertCart())

	// Clear cart
	api.DELETE("/delete", cartCtrl.ClearCart())
}
