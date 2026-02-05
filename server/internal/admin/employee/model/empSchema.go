package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Employee represents a staff member (manager, helper, accountant, etc.)
type Employee struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	UserID       primitive.ObjectID   `bson:"userId" json:"userId"`
	CenterID     *primitive.ObjectID  `bson:"centerId,omitempty" json:"centerId,omitempty"`
	Role         string               `bson:"role" json:"role"`
	Permissions  []string             `bson:"permissions,omitempty" json:"permissions,omitempty"`

	JoiningDate  time.Time            `bson:"joiningDate" json:"joiningDate"`
	LastActive   time.Time            `bson:"lastActive,omitempty" json:"lastActive,omitempty"`
	ShiftTiming  string               `bson:"shiftTiming,omitempty" json:"shiftTiming,omitempty"`
	Status       string               `bson:"status" json:"status"`

	TotalOrdersHandled int            `bson:"totalOrdersHandled,omitempty" json:"totalOrdersHandled,omitempty"`
	AverageRating      float64        `bson:"averageRating,omitempty" json:"averageRating,omitempty"`
	Remarks            string         `bson:"remarks,omitempty" json:"remarks,omitempty"`

	CreatedAt    time.Time            `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt    time.Time            `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
