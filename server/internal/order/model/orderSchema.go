package orderModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Common item structure shared by both Order and Cart.
type Item struct {
    ProductID   primitive.ObjectID `bson:"productId,omitempty" json:"productId,omitempty"` // Ref: Products
	ScrapName   string             `bson:"scrapName,omitempty" json:"scrapName,omitempty"` // in Custom order, ScrapName + Category concate
    MeasureType string             `bson:"measureType" json:"measureType"` // "weight" or "piece"
    Weight      float64            `bson:"weight,omitempty" json:"weight,omitempty"`
    Piece       int32              `bson:"piece,omitempty" json:"piece,omitempty"`
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
	BaseModel `bson:",inline"` // UserID, CreatedAt, UpdatedAt
	Items     []Item           `bson:"items,omitempty" json:"items,omitempty"`
}

type GeoJSONPoint struct {
	Type        string    `bson:"type" json:"type"`
	Coordinates []float64 `bson:"coordinates" json:"coordinates"` // [lng, lat]
	Address     string    `bson:"address,omitempty" json:"address,omitempty"`
	Landmark	string	  `bson:"landmark,omitempty" json:"landmark,omitempty"`
	Street		string	  `bson:"street,omitempty" json:"street,omitempty"`
	Pincode     int       `bson:"pincode,omitempty" json:"pincode,omitempty"`
	HouseNo     int       `bson:"houseNo,omitempty" json:"houseNo,omitempty"`
	ELoc        string    `bson:"eLoc,omitempty" json:"eLoc,omitempty"`
}

// Order represents a finalized transaction or pickup.
type Order struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	BaseModel    `bson:",inline"` // Inherit common fields
	Items        []Item           `bson:"items" json:"items"`
	TotalAmount  float64          `bson:"totalAmount,omitempty" json:"totalAmount,omitempty"`
	IsCustomOrder bool            `bson:"isCustomOrder" json:"isCustomOrder"`
	Location     GeoJSONPoint     `bson:"location" json:"location"`
	Status       string           `bson:"status" json:"status"` // Enum -> [ "Confirmed", "Out for Pickup", "Arrived", "Sold", "Picked", "Cancelled", "Recycled"]
	Payment      string           `bson:"payment" json:"payment"`           // Enum ["Not Paid", "Online", "Cash"]
	TransactionID string          `bson:"transactionId,omitempty" json:"transactionId,omitempty"`
	CenterID     *primitive.ObjectID `bson:"centerId,omitempty" json:"centerId,omitempty"`
	StoreID      *primitive.ObjectID `bson:"storeId,omitempty" json:"storeId,omitempty"`
}

type Buyer struct {
	Name    string `bson:"name" json:"name"`
	UdyamNo string `bson:"udyamNo,omitempty" json:"udyamNo,omitempty"`
	Company string `bson:"company,omitempty" json:"company,omitempty"`
}

type Customer struct {
	UserId  primitive.ObjectID `bson:"userId,omitempty" json:"userId,omitempty"`
	Name    string             `bson:"name" json:"name"`
	Phone   string             `bson:"phone" json:"phone"`
	Location     GeoJSONPoint     `bson:"location" json:"location"`
}

type Taxes struct {
	GSTPercent     float64 `bson:"gstPercent,omitempty" json:"gstPercent,omitempty"`
	GSTAmount      float64 `bson:"gstAmount,omitempty" json:"gstAmount,omitempty"`
	Delivery       float64 `bson:"delivery,omitempty" json:"delivery,omitempty"`
	HandlingCharge float64 `bson:"handlingCharge,omitempty" json:"handlingCharge,omitempty"`
}

type InvoiceItem struct {
    ProductID   primitive.ObjectID `bson:"productId,omitempty" json:"productId,omitempty"` // Ref: Products
	ScrapName   string             `bson:"scrapName,omitempty" json:"scrapName,omitempty"` // in Custom order, ScrapName + Category concate
    MeasureType string             `bson:"measureType" json:"measureType"` // "weight" or "piece"
    Weight      float64            `bson:"weight,omitempty" json:"weight,omitempty"`
    Amount      float64            `bson:"amount,omitempty" json:"amount,omitempty"`
    Rate        float64            `bson:"rate,omitempty" json:"rate,omitempty"`
    Piece       int32              `bson:"piece,omitempty" json:"piece,omitempty"`
}

type Invoice struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	OrderId       primitive.ObjectID `bson:"orderId" json:"orderId"`
	InvoiceNumber string             `bson:"invoiceNumber" json:"invoiceNumber"`

	Buyer    Buyer    `bson:"buyer" json:"buyer"`
	Customer Customer `bson:"customer" json:"customer"`

	Items []InvoiceItem `bson:"items" json:"items"`

	TotalAmount float64 `bson:"totalAmount" json:"totalAmount"`
	Taxes       Taxes   `bson:"taxes,omitempty" json:"taxes,omitempty"`

	PaymentStatus string    `bson:"paymentStatus" json:"paymentStatus"`
	Date          time.Time `bson:"date" json:"date"`

	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}

