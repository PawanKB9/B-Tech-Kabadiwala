package securityModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Handle Logged-In API SPAM
// Redis Rate Limiter Design (per IP + per user + per route)
// Gin middleware code
// Helper functions
// How to integrate with your model

type SecurityRecord struct {
    ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    UserID    primitive.ObjectID `bson:"userId,omitempty" json:"userId,omitempty"`

    // DEVICE IDENTIFICATION
    DeviceID      string `bson:"deviceId" json:"deviceId"`
    DeviceIP      string `bson:"deviceIp" json:"deviceIp"`
    Fingerprint   string `bson:"fingerprint" json:"fingerprint"`
    UserAgent     string `bson:"userAgent" json:"userAgent"`

    // OTP RATE LIMITING (Sliding Window) -> Queue based
    OTPTimestamps   []time.Time `bson:"otpTimestamps" json:"otpTimestamps"`
    OTPBlockedUntil time.Time   `bson:"otpBlockedUntil" json:"otpBlockedUntil"`

    // IP THROTTLING
    IPAttemptCount  int       `bson:"ipAttemptCount" json:"ipAttemptCount"`
    IPLastAttemptAt time.Time `bson:"ipLastAttemptAt" json:"ipLastAttemptAt"`
    IPBlockedUntil  time.Time `bson:"ipBlockedUntil" json:"ipBlockedUntil"`

    // DEVICE BLOCKING
    DeviceAttemptCount int       `bson:"deviceAttemptCount" json:"deviceAttemptCount"`
    DeviceBlockedUntil time.Time `bson:"deviceBlockedUntil" json:"deviceBlockedUntil"`

    // COOLDOWN
    CooldownUntil time.Time `bson:"cooldownUntil" json:"cooldownUntil"`

    // PASSWORD CHANGE → TOKEN VALIDATION
    PasswordChangedAt time.Time `bson:"passwordChangedAt" json:"passwordChangedAt"`
    LastTokenIssuedAt time.Time `bson:"lastTokenIssuedAt" json:"lastTokenIssuedAt"`

    // META
    CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
    UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}
