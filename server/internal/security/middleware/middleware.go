package securityMiddleware

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	securityhelpers "github.com/PawanKB9/BTechKabadiwala/internal/security/helperFunc"
)

// IP Throttling (GLOBAL)
func IPThrottleMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		// if redisSetup.RDB == nil {
		// 	return false, 0, fmt.Errorf("redis not initialized")
		// }

		blocked, retryAfter, err := securityhelpers.CheckIPThrottle(ip)
		if err != nil {
			// Fail-open: never break commerce
			c.Next()
			return
		}

		if blocked {
			c.Header("Retry-After", strconv.Itoa(int(retryAfter.Seconds())))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "too_many_requests",
			})
			return
		}

		c.Next()
	}
}


// Header Validation (GLOBAL)
func HeaderValidationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		riskScore := 0

		userAgent := c.GetHeader("User-Agent")
		if userAgent == "" || len(userAgent) < 8 {
			riskScore++
		}

		accept := c.GetHeader("Accept")
		if accept == "" {
			riskScore++
		}

		if c.Request.Method == http.MethodPost ||
			c.Request.Method == http.MethodPut ||
			c.Request.Method == http.MethodPatch {

			ct := c.GetHeader("Content-Type")
			if ct == "" ||
				(!strings.Contains(ct, "application/json") &&
					!strings.Contains(ct, "multipart/form-data") &&
					!strings.Contains(ct, "application/x-www-form-urlencoded")) {
				riskScore += 2
			}
		}

		if riskScore > 0 {
			c.Set("risk_score", riskScore)
		}

		c.Next()
	}
}


// User Rate Limiter (429)
func UserRateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		userIDVal, exists := c.Get("userId")
		if !exists {
			c.Next()
			return
		}

		userID := fmt.Sprint(userIDVal)
		if userID == "" {
			c.Next()
			return
		}

		ip := c.ClientIP()
		routeClass := classifyRoute(c.FullPath())

		blocked, retryAfter := securityhelpers.CheckUserRateLimit(
			userID,
			ip,
			routeClass,
		)

		if blocked {
			c.Header("Retry-After", strconv.Itoa(int(retryAfter.Seconds())))
			c.Set("user_rate_exceeded", true)

			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "too_many_requests",
			})
			return
		}

		c.Next()
	}
}


// Route Classification
func classifyRoute(path string) string {
	switch {
	case strings.HasPrefix(path, "/order"):
		return "order"
	case strings.HasPrefix(path, "/cart"):
		return "cart"
	case strings.HasPrefix(path, "/user"):
		return "user"
	default:
		return "general"
	}
}


// CAPTCHA Trigger
// func CaptchaTriggerMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {

// 		if !isSensitiveEndpoint(c.FullPath()) {
// 			c.Next()
// 			return
// 		}

// 		risk := 0
// 		if v, ok := c.Get("risk_final"); ok {
// 			if iv, ok := v.(int); ok {
// 				risk = iv
// 			}
// 		}

// 		if risk >= 5 {
// 			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
// 				"error": "captcha_required",
// 			})
// 			return
// 		}

// 		c.Next()
// 	}
// }


// Sensitive Endpoints
func isSensitiveEndpoint(path string) bool {
	if path == "" {
		return false
	}

	switch {
	case strings.HasPrefix(path, "/auth/"):
		return true
	case path == "/order/create":
		return true
	default:
		return false
	}
}
