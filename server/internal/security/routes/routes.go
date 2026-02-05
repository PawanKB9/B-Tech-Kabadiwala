package securityRoute

import (
	"github.com/gin-gonic/gin"
	// "fmt"

	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"
	security "github.com/PawanKB9/BTechKabadiwala/internal/security/controller"
)

func RegisterAuthRoutes(router *gin.Engine) {

	auth := router.Group("/auth")

	// Controller instance (stateful)
	otpController := security.NewOTPController()
	
	auth.POST(
		"/otp/request",
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		securityMiddleware.OTPCooldownMiddleware(),
		securityMiddleware.OTPAbuseMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),

		otpController.CreateOTPSession(),
	)
}

// Encounter 1 — “Should we send OTP to this phone?” -> use these in sequence

// HeaderValidationMiddleware      (non-blocking signal)
// IPThrottleMiddleware            (hard block)
// OTPCooldownMiddleware           (hard block)
// OTPAbuseMiddleware              (hard block)
// RiskMiddleware                  (compute riskScore only)
// CaptchaTriggerMiddleware        (conditional block)
// Controller (create session + sendOtp)

// Encounter 2 — “OTP verified, now consume form data” -> use these in sequence

// HeaderValidationMiddleware
// IPThrottleMiddleware
// UserRateLimitMiddleware         (only if logged-in)
// VerifyOTPTokenMiddleware        (HARD BLOCK)
// RiskMiddleware                  (recalculate, lower weight)
// Controller (consume formData)
