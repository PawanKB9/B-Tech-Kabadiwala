package agentRoute

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"

	agentControllers "github.com/PawanKB9/BTechKabadiwala/internal/admin/PickupAgent/controllers"
)

// NOTE: Registration is PUBLIC but still secured (no auth required)
// Admin / internal routes are PROTECTED

func RegisterAgentRoutes(
	router *gin.Engine,
	client *mongo.Client,
	dbName string,
) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	agentCtrl := agentControllers.NewAgentController(client, dbName)

	// =========================
	// 🔓 PUBLIC ROUTES (Agent Registration)
	// =========================
	public := router.Group("/api/agent")

	public.Use(
		securityMiddleware.IPThrottleMiddleware(),        // prevent spam
		securityMiddleware.HeaderValidationMiddleware(),  // block bad clients
		securityMiddleware.UserRateLimitMiddleware(),     // per-user rate limit
		securityMiddleware.RiskMiddleware(),              // detect suspicious behavior
		securityMiddleware.RiskCaptchaGate(),             // captcha if risky
	)

	public.POST("/register", agentCtrl.CreateAgent)

	// =========================
	// 🔐 PROTECTED ROUTES (Future use)
	// =========================
	protected := router.Group("/api/agent")

	protected.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),            // require login
		authCtrl.TokenValidityMiddleware(),   // validate token
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
	)

	// Example future routes
	// protected.GET("/profile", agentCtrl.GetAgentProfile)
	// protected.PUT("/update", agentCtrl.UpdateAgent)

}