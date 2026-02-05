package securityMiddleware

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	securityhelpers "github.com/PawanKB9/BTechKabadiwala/internal/security/helperFunc"
	"github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"
)


// 1. OTP Cooldown Middleware
func OTPCooldownMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		phone := c.GetString("phone")
		if phone == "" {
			c.Next()
			return
		}

		key := "otp:cooldown:" + phone

		rCtx, cancel := redisSetup.Ctx()
		defer cancel()

		ttl, err := redisSetup.RDB.TTL(rCtx, key).Result()
		if err == nil && ttl > 0 {
			c.Header("Retry-After", strconv.Itoa(int(ttl.Seconds())))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "please_wait",
			})
			return
		}

		c.Next()
	}
}


// 2. OTP Abuse Middleware
func OTPAbuseMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		phone := c.GetString("phone")
		if phone == "" {
			c.Next()
			return
		}

		key := "otp:history:" + phone

		rCtx, cancel := redisSetup.Ctx()
		defer cancel()

		raw, err := redisSetup.RDB.Get(rCtx, key).Bytes()
		var timestamps []time.Time
		if err == nil {
			if err := json.Unmarshal(raw, &timestamps); err != nil {
				timestamps = nil
			}
		}

		c.Set("otp_count", len(timestamps))

		updated, blockedUntil := securityhelpers.CheckAndAppendOTP(
			timestamps,
			time.Now(),
		)

		if blockedUntil != nil {
			c.Set("otp_abuse", true)
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "too_many_otp_requests",
			})
			return
		}

		data, _ := json.Marshal(updated)
		_ = redisSetup.RDB.Set(rCtx, key, data, 25*time.Hour).Err()

		c.Next()
	}
}


// 3. Risk Aggregator
func RiskMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		risk := 0

		if v, ok := c.Get("risk_score"); ok {
			if iv, ok := v.(int); ok {
				risk += iv
			}
		}

		if v, ok := c.Get("otp_abuse"); ok {
			if bv, ok := v.(bool); ok && bv {
				risk += 3
			}
		}

		if v, ok := c.Get("user_rate_exceeded"); ok {
			if bv, ok := v.(bool); ok && bv {
				risk += 2
			}
		}

		count := 0
		if v, ok := c.Get("otp_count"); ok {
			if iv, ok := v.(int); ok {
				count = iv
			}
		}

		suspicious, _ := securityhelpers.IsSuspicious(
			securityhelpers.SuspiciousContext{
				IP:       c.ClientIP(),
				DeviceID: c.GetHeader("X-Device-Id"),
				OTPCount: count,
			},
		)

		if suspicious {
			risk += 2
		}

		c.Set("risk_final", risk)
		c.Next()
	}
}

// Complete captcha + decision making ( Middleware )
func RiskCaptchaGate() gin.HandlerFunc {
    return func(c *gin.Context) {

        risk := 0
        if v, ok := c.Get("risk_final"); ok {
            if iv, ok := v.(int); ok {
                risk = iv
            }
        }

        switch {
        // ================= LOW RISK =================
        case risk < 4:
            c.Next()
            return

        // ================= MEDIUM RISK =================
        case risk >= 4 && risk < 7:
            token := c.GetHeader("X-Captcha-Token")

            // First time, no token → instruct frontend
            if token == "" {
                c.AbortWithStatusJSON(http.StatusOK, gin.H{
                    "captcha_required": true,
                    "message": "captcha_verification_needed",
                })
                return
            }

            // Validate captcha
            result, err := securityhelpers.ValidateRecaptcha(token, 0.5)
            if err != nil || !result.Success {
                c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
                    "error":  "captcha_failed",
                    "detail": result,
                })
                return
            }

            // Captcha valid → continue request
            c.Next()
            return

        // ================= HIGH RISK =================
        default:
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
                "error": "blocked_high_risk",
            })
            return
        }
    }
}
		
// 4. Global Risk Enforcer
// func GlobalRiskEnforcementMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		risk := 0

// 		if v, ok := c.Get("risk_final"); ok {
// 			if iv, ok := v.(int); ok {
// 				risk = iv
// 			}
// 		}

// 		if risk >= 7 {
// 			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
// 				"error": "blocked_high_risk",
// 			})
// 			return
// 		}

// 		c.Next()
// 	}
// }
