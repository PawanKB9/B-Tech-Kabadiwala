package auth

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"time"
	"fmt"
	"io"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	redisSetup "github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"
)

type msg91VerifyRequest struct {
	AuthKey     string `json:"authkey"`
	AccessToken string `json:"access-token"`
}

type msg91VerifyResponse struct {
	Type    string `json:"type"`
	Message string `json:"message"`
	Code    string `json:"code"`
}

// type OTPSession struct {
// 	SessionID string    `json:"session_id"`
// 	Phone     string    `json:"phone"`
// 	CreatedAt time.Time `json:"created_at"`
// 	ExpiresAt time.Time `json:"expires_at"`
// }
type OTPSession struct {
	Phone     string `json:"phone"`
	CreatedAt int64  `json:"created_at"` // unix timestamp
}


// Assumptions (Explicit)
// Client sends:
// X-OTP-Token (already)
// X-OTP-Session-ID
// phone (JSON body or header — I assume JSON body)
// Redis key: otp:session:{sessionID}
// OTP session TTL already enforced by Redis
// func (ac *AuthController) VerifyOTPTokenMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {

// 		// ---------- Required Inputs ----------
// 		otpToken := c.GetHeader("X-OTP-Token")
// 		sessionID := c.GetHeader("X-OTP-Session-ID")

// 		if otpToken == "" || sessionID == "" {
// 			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
// 				"error": "otp_token_or_session_missing",
// 			})
// 			return
// 		}

// 		var req struct {
// 			Phone string `json:"phone" binding:"required"`
// 		}
// 		if err := c.ShouldBindJSON(&req); err != nil {
// 			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
// 				"error": "phone_required",
// 			})
// 			return
// 		}

// 		// ---------- 1. Verify OTP Token with Provider ----------
// 		msg91URL := os.Getenv("MSG91_VERIFY_URL")
// 		authKey := os.Getenv("MSG91_AUTH_KEY")

// 		payload := msg91VerifyRequest{
// 			AuthKey:     authKey,
// 			AccessToken: otpToken,
// 		}

// 		body, _ := json.Marshal(payload)

// 		httpReq, err := http.NewRequest("POST", msg91URL, bytes.NewBuffer(body))
// 		if err != nil {
// 			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
// 				"error": "otp_verification_failed",
// 			})
// 			return
// 		}

// 		httpReq.Header.Set("Content-Type", "application/json")
// 		httpReq.Header.Set("Accept", "application/json")

// 		client := &http.Client{Timeout: 5 * time.Second}
// 		resp, err := client.Do(httpReq)
// 		if err != nil {
// 			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{
// 				"error": "otp_provider_unreachable",
// 			})
// 			return
// 		}
// 		defer resp.Body.Close()

// 		var result msg91VerifyResponse
// 		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
// 			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
// 				"error": "otp_invalid_response",
// 			})
// 			return
// 		}

// 		if result.Type != "success" {
// 			c.Set("otp_abuse", true)
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
// 				"error": "otp_verification_failed",
// 			})
// 			return
// 		}

// 		// ---------- 2. Verify OTP Session ----------
// 		rCtx, cancel := redisSetup.Ctx()
// 		defer cancel()

// 		key := "otp:session:" + sessionID
// 		val, err := redisSetup.RDB.Get(rCtx, key).Result()
// 		if err != nil {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
// 				"error": "invalid_or_expired_otp_session",
// 			})
// 			return
// 		}

// 		var session OTPSession
// 		if err := json.Unmarshal([]byte(val), &session); err != nil {
// 			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
// 				"error": "corrupt_otp_session",
// 			})
// 			return
// 		}

// 		// ---------- 3. Phone Binding Check (Critical) ----------
// 		if session.Phone != req.Phone {
// 			c.Set("otp_abuse", true)
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
// 				"error": "otp_session_phone_mismatch",
// 			})
// 			return
// 		}

// 		// ---------- 4. Consume Session ----------
// 		// Single-use guarantee
// 		_ = redisSetup.RDB.Del(rCtx, key)

// 		// ---------- 5. Mark Verified ----------
// 		c.Set("otp_verified", true)
// 		c.Set("verified_phone", session.Phone)

// 		c.Next()
// 	}
// }

func (ac *AuthController) VerifyOTPTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		otpToken := c.GetHeader("X-OTP-Token")
		sessionID := c.GetHeader("X-OTP-Session-ID")

		if otpToken == "" || sessionID == "" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"error": "otp_token_or_session_missing",
			})
			return
		}

		// var req struct {
		// 	Phone string `json:"phone" binding:"required"`
		// }
		// if err := c.ShouldBindJSON(&req); err != nil {
		// 	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
		// 		"error": "phone_required",
		// 	})
		// 	return
		// }

		var req struct {
			Phone string `json:"phone" binding:"required"`
		}

		if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"error": "phone_required",
			})
			return
		}

		msg91URL := os.Getenv("MSG91_VERIFY_URL")
		authKey := os.Getenv("MSG91_AUTH_KEY")

		payload := msg91VerifyRequest{
			AuthKey:      authKey,
			AccessToken: otpToken,
		}

		body, err := json.Marshal(payload)
		if err != nil {
			fmt.Printf("[VerifyOTP] marshal failed: %v\n", err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "otp_verification_failed",
			})
			return
		}

		httpReq, err := http.NewRequest("POST", msg91URL, bytes.NewBuffer(body))
		if err != nil {
			fmt.Printf("[VerifyOTP] new request failed: %v\n", err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "otp_verification_failed",
			})
			return
		}

		httpReq.Header.Set("Content-Type", "application/json")
		httpReq.Header.Set("Accept", "application/json")

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(httpReq)
		if err != nil {
			fmt.Printf("[VerifyOTP] provider unreachable: %v\n", err)
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{
				"error": "otp_provider_unreachable",
			})
			return
		}
		defer resp.Body.Close()

		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf("[VerifyOTP] failed to read provider body: %v\n", err)
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{
				"error": "otp_provider_read_failed",
			})
			return
		}

		fmt.Printf("[VerifyOTP] msg91 raw response: %s\n", string(bodyBytes))

		var result msg91VerifyResponse
		if err := json.Unmarshal(bodyBytes, &result); err != nil {
			fmt.Printf("[VerifyOTP] decode failed: %v | raw=%s\n", err, string(bodyBytes))
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "otp_invalid_response",
			})
			return
		}

		if result.Type != "success" {
			c.Set("otp_abuse", true)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "otp_verification_failed",
			})
			return
		}

		rCtx, cancel := redisSetup.Ctx()
		defer cancel()

		key := "otp:session:" + sessionID
		val, err := redisSetup.RDB.Get(rCtx, key).Result()
		if err != nil {
			fmt.Printf("[VerifyOTP] redis get failed | key=%s | err=%v\n", key, err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid_or_expired_otp_session",
			})
			return
		}

		var session OTPSession
		if err := json.Unmarshal([]byte(val), &session); err != nil {
			fmt.Printf("[VerifyOTP] session unmarshal failed | raw=%s | err=%v\n", val, err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "corrupt_otp_session",
			})
			return
		}

		if session.Phone != req.Phone {
			c.Set("otp_abuse", true)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "otp_session_phone_mismatch",
			})
			return
		}

		_ = redisSetup.RDB.Del(rCtx, key)

		c.Set("otp_verified", true)
		c.Set("verified_phone", session.Phone)

		c.Next()
	}
}
