package securityhelpers

import (
	"fmt"
	"time"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	redisSetup "github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"
)

func Err(msg string) error {
	return fmt.Errorf(msg)
}

const (
	suspicionThreshold = 2

	deviceBurstLimit  = 20
	deviceBurstWindow = 30 * time.Second

	recentBlockWindow = 15 * time.Minute
)

type SuspiciousContext struct {
	IP       string
	DeviceID string
	UserID   string
	OTPCount int
}

// Help to trigger Captcha
func IsSuspicious(ctx SuspiciousContext) (bool, error) {
	score := 0

	rCtx, cancel := redisSetup.Ctx()
	defer cancel()

	// IP rate check
	ipRateKey := fmt.Sprintf("ip:rate:%s", ctx.IP)
	ipCount, err := redisSetup.RDB.Get(rCtx, ipRateKey).Int()
	if err == nil && ipCount > 200 {
		score++
	}

	// Recent IP block check
	ipBlockKey := fmt.Sprintf("ip:block:%s", ctx.IP)
	ipBlockTTL, err := redisSetup.RDB.TTL(rCtx, ipBlockKey).Result()
	if err == nil && ipBlockTTL > 0 && ipBlockTTL < recentBlockWindow {
		score++
	}

	// OTP abuse check
	if ctx.OTPCount >= 3 {
		score++
	}

	return score >= suspicionThreshold, nil
}

const recaptchaURL = "https://www.google.com/recaptcha/api/siteverify"

type RecaptchaResponse struct {
	Success bool     `json:"success"`
	Score   float64  `json:"score,omitempty"`
	Action  string   `json:"action,omitempty"`
	Error   []string `json:"error-codes,omitempty"`
}

// reCaptcha validation
func ValidateRecaptcha(token string, minScore float64) (*RecaptchaResponse, error) {
	secret := os.Getenv("RECAPTCHA_SECRET_KEY")
	if secret == "" {
		return nil, Err("captcha secret missing")
	}

	payload := []byte("secret=" + secret + "&response=" + token)

	req, err := http.NewRequest("POST", recaptchaURL, bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var result RecaptchaResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	if !result.Success || result.Score < minScore {
		return &result, Err("captcha_failed")
	}

	return &result, nil
}