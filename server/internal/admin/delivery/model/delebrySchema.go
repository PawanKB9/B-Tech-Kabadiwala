package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// will be updated later...
// DeliveryBoy represents a delivery agent and their assigned orders.
type DeliveryBoy struct {
	ID              primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	UserID          primitive.ObjectID   `bson:"userId" json:"userId"` // Reference to Users collection
	MyPendingOrders []primitive.ObjectID `bson:"myPendingOrders,omitempty" json:"myPendingOrders,omitempty"`
	ToApprove       []primitive.ObjectID `bson:"toApprove,omitempty" json:"toApprove,omitempty"`
	PickedUp        []primitive.ObjectID `bson:"pickedUp,omitempty" json:"pickedUp,omitempty"`
	CreatedAt       time.Time            `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt       time.Time            `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
