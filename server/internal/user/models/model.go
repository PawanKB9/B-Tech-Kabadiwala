package userModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GeoJSONPoint struct {
	Type        string    `bson:"type" json:"type"`
	Coordinates []float64 `bson:"coordinates" json:"coordinates"` // [lng, lat]
	Address     string    `bson:"address,omitempty" json:"address,omitempty"`
	Pincode     int       `bson:"pincode,omitempty" json:"pincode,omitempty"`
	ELoc        string    `bson:"eLoc,omitempty" json:"eLoc,omitempty"`
}

type User struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name          string             `bson:"name" json:"name"`
	Email         string             `bson:"email" json:"email"`
	Phone         string             `bson:"phone" json:"phone"`
	AltPhone      string             `bson:"altPhone" json:"altPhone"`
	Password      string             `bson:"password" json:"password,omitempty"`
	Role          string             `bson:"role,omitempty" json:"role,omitempty"`
	IsVerified    bool               `bson:"isVerified" json:"isVerified"`
	Location      GeoJSONPoint       `bson:"primeLocation,omitempty" json:"primeLocation,omitempty"`
	SavedLocation []GeoJSONPoint     `bson:"savedLocations,omitempty" json:"savedLocations,omitempty"`
	CreatedAt     time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt     time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

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
