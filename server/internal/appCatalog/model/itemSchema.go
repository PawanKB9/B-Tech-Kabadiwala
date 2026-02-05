package appModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ID          string  `json:"id" bson:"_id"`
// 	NOT-SCHEMA this is just type defined
type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	IsActive    bool               `json:"isActive"`
	Rate        float64            `json:"rate"`
	MeasureType string             `bson:"measureType" json:"measureType"`
	MinWeight   float64            `json:"minWeight,omitempty"` // Added omitempty
	MinPiece    int32              `json:"minPiece,omitempty"`  // New field with omitempty
	ScrapName   string             `json:"scrapName"`
	ImgUrl      string             `json:"imgUrl"`
	Category    string             `json:"category"`
	Description string             `json:"description"`
}

// Item (Scrap Item Master) represents a globally defined scrap type
// that centers can reference and price individually.
type Item struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ScrapName   string             `bson:"scrapName" json:"scrapName"`             // Name of the scrap item
	ImgUrl      string             `bson:"imgUrl,omitempty" json:"imgUrl,omitempty"` // Image link for UI display
	MeasureType string             `bson:"measureType" json:"measureType"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"` // Short description
	Category    string             `bson:"category,omitempty" json:"category,omitempty"`       // e.g., "Metal", "Plastic", "Paper"
	CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

// CenterProduct represents a product managed by a specific center.
type CenterProduct struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`   // MongoDB default _id
    CenterID    primitive.ObjectID `bson:"centerId" json:"centerId"`            // Reference to Center
    ScrapItemId primitive.ObjectID `bson:"scrapItemId" json:"scrapItemId"`      // Reference to ScrapItem
    IsActive    bool               `bson:"isActive" json:"isActive"`
    Rate        float64            `bson:"rate" json:"rate"`
    MinWeight   float64            `bson:"minWeight,omitempty" json:"minWeight,omitempty"`
	MinPiece    int32              `bson:"minPiece, omitempty" json:"minPiece, omitempty"` 
    CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
    UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

//     {
//     _id: "Obj099PlasticBottles",
//     isActive: true,
//     rate: 20.0,
//     minWeight: 2.0,
//     scrapName: "Plastic Bottles",
//     imgUrl: "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
//     category: "Daily Scraps",
//     description: "Used PET bottles from beverages and household products suitable for recycling.",
//   }
