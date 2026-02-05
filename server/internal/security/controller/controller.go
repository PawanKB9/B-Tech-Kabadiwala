package security

import (
	"encoding/json"
	"net/http"
	"time"
    "fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	redisSetup "github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"
)

type OTPSession struct {
	Phone     string `json:"phone"`
	CreatedAt int64  `json:"created_at"`
}

type OTPController struct{}

func NewOTPController() *OTPController {
	return &OTPController{}
}

func (o *OTPController) CreateOTPSession() gin.HandlerFunc {
	return func(c *gin.Context) {
        fmt.Println("Registering security routes...")
		var req struct {
			Phone string `json:"phone" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
			return
		}

		sessionID := uuid.NewString()

		session := OTPSession{
			Phone:     req.Phone,
			CreatedAt: time.Now().Unix(),
		}

		data, _ := json.Marshal(session)

		rCtx, cancel := redisSetup.Ctx()
		defer cancel()

		if err := redisSetup.RDB.Set(
			rCtx,
			"otp:session:"+sessionID,
			data,
			15*time.Minute,
		).Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal_error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"otp_session_id": sessionID,
			"phone":          req.Phone,
		})
	}
}
