package userModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// type GeoJSONPoint struct {
// 	Type        string    `bson:"type" json:"type"`
// 	Coordinates []float64 `bson:"coordinates" json:"coordinates"` // [lng, lat]
// 	Address     string    `bson:"address,omitempty" json:"address,omitempty"`
// 	Pincode     int       `bson:"pincode,omitempty" json:"pincode,omitempty"`
// 	ELoc        string    `bson:"eLoc,omitempty" json:"eLoc,omitempty"`
// }
type GeoJSONPoint struct {
	Type        string    `bson:"type" json:"type"`
	Coordinates []float64 `bson:"coordinates" json:"coordinates"` // [lng, lat]
	Address     string    `bson:"address,omitempty" json:"address,omitempty"`
	Landmark	string	  `bson:"landmark,omitempty" json:"landmark,omitempty"`
	Street		string	  `bson:"street,omitempty" json:"street,omitempty"`
	Pincode     int       `bson:"pincode,omitempty" json:"pincode,omitempty"`
	HouseNo     int       `bson:"houseNo,omitempty" json:"houseNo,omitempty"`
	ELoc        string    `bson:"eLoc,omitempty" json:"eLoc,omitempty"`
}

type User struct {
    ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    CenterID           primitive.ObjectID `bson:"centerId" json:"centerId"`
    Name               string             `bson:"name" json:"name"`
    Email              string             `bson:"email,omitempty" json:"email,omitempty"`
    Phone              string             `bson:"phone" json:"phone"`
    AltPhone           string             `bson:"altPhone,omitempty" json:"altPhone,omitempty"`
    Password           string             `bson:"password,omitempty" json:"password,omitempty"`
    Role               string             `bson:"role,omitempty" json:"role,omitempty"`
    IsVerified         bool               `bson:"isVerified" json:"isVerified"`
    Location           GeoJSONPoint       `bson:"location,omitempty" json:"location,omitempty"`
    SavedLocation      []GeoJSONPoint     `bson:"savedLocation,omitempty" json:"savedLocation,omitempty"`
	SessionVersion	   int				  `bson:"sessionVersion" json:"sessionVersion"`
	PasswordChangedAt  time.Time 		  `bson:"passwordChangedAt" json:"passwordChangedAt"`
    LastTokenIssuedAt  time.Time 		  `bson:"lastTokenIssuedAt" json:"lastTokenIssuedAt"`
    CreatedAt          time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
    UpdatedAt          time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

// May impliment them later...
// SavedLocation []GeoJSONPoint     `bson:"savedLocations,omitempty" json:"savedLocations,omitempty"` // may be later
// ForgotPasswordCount int       `bson:"forgotPasswordCount,omitempty" json:"forgotPasswordCount,omitempty"` // Attempts today
// LastForgotPassword  time.Time `bson:"lastForgotPassword,omitempty" json:"lastForgotPassword,omitempty"`   // Last attempt date

// OTP security
// OtpAttemptsToday    int       `bson:"otpAttemptsToday,omitempty" json:"otpAttemptsToday,omitempty"`      // OTP attempts per day
// LastOtpAttempt      time.Time `bson:"lastOtpAttempt,omitempty" json:"lastOtpAttempt,omitempty"`          // Used to reset count daily
// OtpExpiresAt        time.Time `bson:"otpExpiresAt,omitempty" json:"otpExpiresAt,omitempty"`              // Expiry timestamp

// Force logout from all sessions
// PasswordChangedAt   time.Time `bson:"passwordChangedAt,omitempty" json:"passwordChangedAt,omitempty"`

func (u *User) FillDefaults() {
	if u.Role == "" {
		u.Role = "customer"
	}
	u.IsVerified = false
	if u.CreatedAt.IsZero() {
		u.CreatedAt = time.Now()
	}
	u.UpdatedAt = time.Now()
}
