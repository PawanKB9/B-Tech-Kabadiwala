// package models

// import (
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // GeoJSON type for location within userInfo
// type GeoJSONPoint struct {
// 	Type        string    `bson:"type"`        // must be "Point"
// 	Coordinates []float64 `bson:"coordinates"` // [lng, lat]
// 	Address     string    `bson:"address,omitempty"`
// 	Pincode     int       `bson:"pincode,omitempty"`
// 	ELoc        string    `bson:"eLoc,omitempty"`
// }

// // Pending item inside items array
// type SellItem struct {
// 	Material string  `bson:"material,omitempty"`
// 	Weight   float64 `bson:"weight,omitempty"`
// }

// // Enum type for status
// type SellStatus string

// const (
// 	OrderConfirmed SellStatus = "Order Confirmed"
// 	Cancelled      SellStatus = "Cancelled"
// 	OutForPickup   SellStatus = "Out for Pickup"
// 	Sold           SellStatus = "Sold"
// )

// // Main sell schema struct
// type Sell struct {
// 	ID            primitive.ObjectID `bson:"_id,omitempty"`
// 	UserID        primitive.ObjectID `bson:"userId,omitempty"`
// 	TotalPrice    float64            `bson:"totalPrice"`
// 	Items         []SellItem         `bson:"items,omitempty"`
// 	IsSold        bool               `bson:"isSold,omitempty"`
// 	Status        SellStatus         `bson:"status,omitempty"`
// 	UserInfo      struct {
// 		Name     string      `bson:"name,omitempty"`
// 		Phone    string      `bson:"phone,omitempty"`
// 		Location GeoJSONPoint `bson:"location,omitempty"`
// 	} `bson:"userInfo,omitempty"`
// 	IsDeleted     bool               `bson:"isDeleted,omitempty"`
// 	CenterID      string             `bson:"centerId,omitempty"`
// 	CenterAddress string             `bson:"centerAddress,omitempty"`
// 	StoreID       string             `bson:"storeId,omitempty"`
// 	CreatedAt     time.Time          `bson:"createdAt,omitempty"`
// 	UpdatedAt     time.Time          `bson:"updatedAt,omitempty"`
// }
