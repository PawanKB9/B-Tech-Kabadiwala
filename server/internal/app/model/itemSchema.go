package appModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Item (Scrap Item Master) represents a globally defined scrap type
// that centers can reference and price individually.
type Item struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ScrapName   string             `bson:"scrapName" json:"scrapName"`             // Name of the scrap item
	ImgURL      string             `bson:"imgUrl,omitempty" json:"imgUrl,omitempty"` // Image link for UI display
	Description string             `bson:"description,omitempty" json:"description,omitempty"` // Short description
	Category    string             `bson:"category,omitempty" json:"category,omitempty"`       // e.g., "Metal", "Plastic", "Paper"
	CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

// CenterProduct represents a product managed by a center.
type CenterProduct struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ScrapItemId primitive.ObjectID `bson:"scrapItemId" json:"scrapItemId"`
	IsActive    bool               `bson:"isActive" json:"isActive"`
	Rate        float64            `bson:"rate" json:"rate"`
	MinWeight   float64            `bson:"minWeight" json:"minWeight"`
	CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

    {
    _id: "Obj099PlasticBottles",
    isActive: true,
    rate: 20.0,
    minWeight: 2.0,
    scrapName: "Plastic Bottles",
    imgUrl: "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
    category: "Daily Scraps",
    description: "Used PET bottles from beverages and household products suitable for recycling.",
  },
