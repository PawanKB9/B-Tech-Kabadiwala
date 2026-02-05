package centerRoutes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"

	centerControllers "github.com/PawanKB9/BTechKabadiwala/internal/admin/center/controllers"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"
)

func RegisterCenterRoutes(
	router *gin.Engine,
	client *mongo.Client,
	dbName string,
) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	// Instantiate Controller ONCE
	centerController := &centerControllers.CenterController{
		Client: client,
		DBName: dbName,
	}

	// Parent group: /admin/center
	centerRouter := router.Group("/admin/center")

	// Protected Routes
	protected := centerRouter.Group("/")
	protected.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	// ---------------- ROUTES ----------------

	// Get center by ID
	protected.GET("/:id", centerController.GetCenterByID())

	// Get centers by storeId
	protected.GET("/store/:storeId", centerController.GetCentersByStoreID())

	// Get all centers
	protected.GET("/all", centerController.GetAllCenters())
}
