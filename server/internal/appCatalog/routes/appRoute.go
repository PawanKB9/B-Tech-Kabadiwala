package itemsRoute

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"

	itemsControllers "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/controllers/items"
	appControllers "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/controllers/appController"
)

// NOTE: We are using non-blocking auth middleware...
func RegisterItemRoutes(
	router *gin.Engine,
	client *mongo.Client,
	dbName string,
	) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	itemsCtrl := itemsControllers.NewItemsController(client, dbName)

	api := router.Group("/api")
	api.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	api.GET("/products/:centerID", itemsCtrl.GetProducts())
}

func RegisterItemMasterRoutes(
	router *gin.Engine,
	client *mongo.Client,
	dbName string,
	) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	itemsCtrl := itemsControllers.NewItemsController(client, dbName)

	api := router.Group("/api/items")
	api.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	api.GET("/", itemsCtrl.GetAllItems())
	api.GET("/:id", itemsCtrl.GetItem())
	api.POST("/", itemsCtrl.CreateItem())
}

func RegisterAppRoutes(
	router *gin.Engine,
	client *mongo.Client,
	dbName string,
	) {

	appCtrl := appControllers.NewAppController(client, dbName)

	api := router.Group("/api/app")

	api.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	api.GET("/data", appCtrl.GetAppData())
}
