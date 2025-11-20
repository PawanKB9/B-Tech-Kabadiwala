package orderModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Common item structure shared by both Order and Cart.
type Item struct {
	ProductID primitive.ObjectID `bson:"productId" json:"productId"` // Ref: Products
	Weight    float64            `bson:"weight" json:"weight"`
}

// BaseModel
type BaseModel struct {
	UserID    primitive.ObjectID `bson:"userId" json:"userId"` // Ref: Users
	CreatedAt time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

// Cart represents a user's active cart for products.
type Cart struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	BaseModel `bson:",inline"` //UserID, CreatedAt, UpdatedAt
	Items     []Item           `bson:"items,omitempty" json:"items,omitempty"`
}

// Order represents a finalized transaction or pickup.
type Order struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	BaseModel    `bson:",inline"` // Inherit common fields
	Items        []Item           `bson:"items" json:"items"`
	TotalAmount  float64          `bson:"totalAmount" json:"totalAmount"`
	Status       string           `bson:"status" json:"status"` // Enum -> [ "confirmed", "pickup", "arrived", "sold"]
	Payment      string           `bson:"payment" json:"payment"`           // Enum
	TransactionID string          `bson:"transactionId,omitempty" json:"transactionId,omitempty"`
	CenterID     *primitive.ObjectID `bson:"centerId,omitempty" json:"centerId,omitempty"`
	StoreID      *primitive.ObjectID `bson:"storeId,omitempty" json:"storeId,omitempty"`
}
