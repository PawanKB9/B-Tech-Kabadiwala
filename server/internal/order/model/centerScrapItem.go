package orderModels

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ScrapItem represents a specific scrap item configuration
// available at a particular Center (with price, weight, and status).
type ScrapItem struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	CenterID    primitive.ObjectID  `bson:"centerId" json:"centerId"`                         // Ref: Center
	ScrapItemID primitive.ObjectID  `bson:"scrapItemId" json:"scrapItemId"`                   // Ref: ItemSchema (Base Scrap Item)
	Price       float64             `bson:"price" json:"price"`                               // Price per unit weight (e.g. per kg)
	MinWeight   float64             `bson:"minWeight,omitempty" json:"minWeight,omitempty"`   // Minimum acceptable weight
	IsActive    bool                `bson:"isActive" json:"isActive"`                         // Whether item is active for buying/selling
	CreatedAt   int64               `bson:"createdAt,omitempty" json:"createdAt,omitempty"`   // Timestamp in Unix format
	UpdatedAt   int64               `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`   // Timestamp in Unix format
}
