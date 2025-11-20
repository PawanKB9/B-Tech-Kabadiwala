package centerModels

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GeoJSONPoint represents a geographic location in GeoJSON format.
type GeoJSONPoint struct {
	Type        string    `bson:"type" json:"type"`                     // Always "Point"
	Coordinates []float64 `bson:"coordinates" json:"coordinates"`       // [lng, lat]
	Address     string    `bson:"address,omitempty" json:"address,omitempty"`
	Pincode     int       `bson:"pincode,omitempty" json:"pincode,omitempty"`
	ELoc        string    `bson:"eLoc,omitempty" json:"eLoc,omitempty"`
}

// TotalWeight tracks product-wise weight statuses for a center.
type TotalWeight struct {
	ProductID primitive.ObjectID `bson:"productId" json:"productId"`
	Pending   float64            `bson:"pending" json:"pending"`
	Sold      float64            `bson:"sold" json:"sold"`
	Cleared   float64            `bson:"cleared" json:"cleared"`
}

// Help contains contact details for the center’s support.
type Help struct {
	Phone    string `bson:"phone,omitempty" json:"phone,omitempty"`
	Email    string `bson:"email,omitempty" json:"email,omitempty"`
	Whatsapp string `bson:"whatsapp,omitempty" json:"whatsapp,omitempty"`
}

// Center represents a distribution center or store hub.
type Center struct {
	ID              primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    ManagerID       primitive.ObjectID   `bson:"managerId" json:"managerId"`                   // Reference to User
	StoreID         primitive.ObjectID   `bson:"storeId" json:"storeId"`                       // Reference to Store
	DeliveryBoys    []primitive.ObjectID `bson:"deliveryBoys,omitempty" json:"deliveryBoys,omitempty"`
	HelperIDs       []primitive.ObjectID `bson:"helperIds,omitempty" json:"helperIds,omitempty"`
	Location        GeoJSONPoint         `bson:"location,omitempty" json:"location,omitempty"`
	HelpLine        Help                 `bson:"helpLine,omitempty" json:"helpLine,omitempty"`
	PendingOrderCnt float64              `bson:"pendingOrderCnt,omitempty" json:"pendingOrderCnt,omitempty"`
	SoldOrderCnt    float64              `bson:"soldOrderCnt,omitempty" json:"soldOrderCnt,omitempty"`
	TotalWeight     []TotalWeight        `bson:"totalWeight,omitempty" json:"totalWeight,omitempty"`
	CreatedAt       time.Time            `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt       time.Time            `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
