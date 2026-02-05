package userRoutes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"

	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"

	userActivityControllers "github.com/PawanKB9/BTechKabadiwala/internal/user/controllers/userActivityControllers"
	userControllers "github.com/PawanKB9/BTechKabadiwala/internal/user/controllers/userControllers"
)

// RegisterAllUserRoutes centralizes all user and activity routing logic
func RegisterAllUserRoutes(
	router *gin.Engine,
	client *mongo.Client,
	dbName string,
	db *mongo.Database,
) {

	// CORRECT CONTROLLER INSTANCE
	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	api := router.Group("/api/user")

	// Controller construction (ONCE at startup)
	userCtrl := userControllers.NewUserController(client, dbName)
	userActivityCtrl := userActivityControllers.NewUserActivityController(db)

	// 1. PUBLIC OTP-BASED ROUTES
	publicOTP := api.Group("/")
	publicOTP.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		securityMiddleware.OTPCooldownMiddleware(),
		securityMiddleware.OTPAbuseMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
		authCtrl.VerifyOTPTokenMiddleware(),
	)
	{
		publicOTP.POST("/create", userCtrl.SignUp())
		publicOTP.PATCH("/forgot-password", userCtrl.ForgotPassword())
	}

	// 2. LOGIN ROUTE
	login := api.Group("/")
	login.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)
	{
		login.POST("/login", userCtrl.Login())
	}

	// 3. STANDARD AUTHENTICATED ROUTES
	authenticated := api.Group("/")
	authenticated.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)
	{
		authenticated.POST("/logout", userCtrl.Logout())

		authenticated.GET("/user-data", userCtrl.GetCurrentUser())

		authenticated.GET(
			"/activity/stats",
			userActivityCtrl.GetUserActivity(),
		)
	}

	// 4. SENSITIVE AUTH ROUTES
	sensitive := api.Group("/")
	sensitive.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)
	{
		sensitive.PATCH("/change-password", userCtrl.ChangePassword())
		sensitive.POST("/admin/temp-user/create", userCtrl.CreateUserByAdmin())
		sensitive.GET("/admin/temp-user/read", userCtrl.GetUserByAdmin())
	}

	// 5. AUTH + OTP VERIFIED ROUTES
	otpVerified := api.Group("/")
	otpVerified.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.OTPCooldownMiddleware(),
		securityMiddleware.OTPAbuseMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
		authCtrl.VerifyOTPTokenMiddleware(),
	)
	{
		otpVerified.PUT("/update-user/info", userCtrl.UpdateUserInfo())
	}
}
