package userModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ScrapSold tracks how much of each scrap product a user has sold.
type ScrapSold struct {
	ProductID primitive.ObjectID `bson:"productId" json:"productId"` // Ref: ItemSchema
	Weight    float64            `bson:"weight" json:"weight"`       // Total weight sold (e.g., in kg)
}

// UserActivity tracks the user’s scrap-related actions, stats, and progress.
type UserActivity struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	UserID         primitive.ObjectID   `bson:"userId" json:"userId"`                 // Ref: Users
	History        []primitive.ObjectID `bson:"history,omitempty" json:"history,omitempty"` // Array of Order IDs
	TotalEarned    float64              `bson:"totalEarned,omitempty" json:"totalEarned,omitempty"` // Lifetime earnings
	ThisMonth      float64              `bson:"thisMonth,omitempty" json:"thisMonth,omitempty"`     // Earnings for current month
	CancelCnt      int                  `bson:"cancelCnt,omitempty" json:"cancelCnt,omitempty"`     // Canceled order count
	CompletionCnt  int                  `bson:"completionCnt,omitempty" json:"completionCnt,omitempty"` // Successfully completed orders
	SpecialOffer   string               `bson:"specialOffer,omitempty" json:"specialOffer,omitempty"`   // Current offer available to user
	Batches        []string             `bson:"batches,omitempty" json:"batches,omitempty"`             // List of scrap types user interacts with
	ScrapSold      []ScrapSold          `bson:"scrapSold,omitempty" json:"scrapSold,omitempty"`         // Sold item stats
	CreatedAt      time.Time            `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt      time.Time            `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
