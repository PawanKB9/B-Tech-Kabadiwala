package userModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ScrapSold tracks how much of each scrap product a user has sold.
type Item struct {
    ProductID   primitive.ObjectID `bson:"productId,omitempty" json:"productId,omitempty"` // Ref: Products
	ScrapName   string             `bson:"scrapName,omitempty" json:"scrapName,omitempty"` // in Custom order, ScrapName + Category concate
    MeasureType string             `bson:"measureType" json:"measureType"` // "weight" or "piece"
    Weight      float64            `bson:"weight,omitempty" json:"weight,omitempty"`
    Piece       int32              `bson:"piece,omitempty" json:"piece,omitempty"`
}

// make index according to userId ( ->unique )
// UserActivity tracks the user’s scrap-related actions, stats, and progress.
type UserActivity struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	UserID         primitive.ObjectID   `bson:"userId" json:"userId"`                 // Ref: Users
	TotalEarned    float64              `bson:"totalEarned,omitempty" json:"totalEarned,omitempty"` // Lifetime earnings
	ThisMonth      float64              `bson:"thisMonth,omitempty" json:"thisMonth,omitempty"`     // Earnings for current month
	CancelCnt      int                  `bson:"cancelCnt,omitempty" json:"cancelCnt,omitempty"`     // Canceled order count
	CompletionCnt  int                  `bson:"completionCnt,omitempty" json:"completionCnt,omitempty"` // Successfully completed orders
	SpecialOffer   string               `bson:"specialOffer,omitempty" json:"specialOffer,omitempty"`   // Current offer available to user
	Batches        []string             `bson:"batches,omitempty" json:"batches,omitempty"`             // List of scrap types user interacts with
	ScrapSold      []Item               `bson:"scrapSold,omitempty" json:"scrapSold,omitempty"`         // Sold item stats
	CreatedAt      time.Time            `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt      time.Time            `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
// No need this is not optimised
// History        []primitive.ObjectID `bson:"history,omitempty" json:"history,omitempty"`
// ActiveOrder    []primitive.ObjectID `bson:"activeOrder,omitempty" json:"activeOrder,omitempty"`
