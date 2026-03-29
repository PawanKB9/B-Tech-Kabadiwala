package AgentModel

import "time"

type Location struct {
	Address   string   `json:"address" bson:"address"`
	Street    string   `json:"street" bson:"street"`
	Pincode   int      `json:"pincode" bson:"pincode"`
	Latitude  *float64 `json:"latitude,omitempty" bson:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty" bson:"longitude,omitempty"`
	ELoc      string   `json:"eLoc,omitempty" bson:"eLoc,omitempty"`
}

type Agent struct {
	ID string `json:"id" bson:"_id,omitempty"`

	// Basic Info
	Name      string `json:"name" bson:"name"`
	Mobile    string `json:"mobile" bson:"mobile"`
	AltMobile string `json:"altMobile,omitempty" bson:"altMobile,omitempty"`
	Aadhaar   string `json:"aadhaar" bson:"aadhaar"`

	// Security
	Passcode string `json:"passcode" bson:"passcode"` // store hashed later

	// Operations
	OperatingRange string `json:"operatingRange" bson:"operatingRange"`
	Location       Location `json:"location" bson:"location"`

	// Agreement (CRITICAL)
	IsAgree     bool      `json:"isAgree" bson:"isAgree"`
	AgreedAt    time.Time `json:"agreedAt,omitempty" bson:"agreedAt,omitempty"`
	TermsVersion string   `json:"termsVersion,omitempty" bson:"termsVersion,omitempty"`

	// Status & Control
	Status string `json:"status" bson:"status"` // pending, approved, rejected

	// Metadata
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}
