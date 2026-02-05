package centerModels

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// No need for now this inc+ the complications & not optimised
// TotalWeight tracks product-wise weight statuses for a center.
// Recomanded for later -> its fast but not good approach
// type TotalWeight struct {
// 	ProductID primitive.ObjectID `bson:"productId,omitempty" json:"productId,omitempty"`
// 	ScrapName string             `bson:"scrapName,omitempty" json:"scrapName,omitempty"`// in Custom order, ScrapName + Category concate
// 	Pending   float64            `bson:"pending" json:"pending"`
// 	Picked    float64            `bson:"picked" json:"picked"`
// 	Sold      float64            `bson:"sold" json:"sold"`
// 	Recycled  float64            `bson:"recycled" json:"recycled"`
// }

// GeoJSONPoint represents a geographic location in GeoJSON format.
type GeoJSONPoint struct {
	Type        string    `bson:"type" json:"type"`
	Coordinates []float64 `bson:"coordinates" json:"coordinates"` // [lng, lat]
	Address     string    `bson:"address,omitempty" json:"address,omitempty"`
	Landmark	string	  `bson:"landmark,omitempty" json:"landmark,omitempty"`
	Street		string	  `bson:"street,omitempty" json:"street,omitempty"`
	HouseNo     int       `bson:"houseNo,omitempty" json:"houseNo,omitempty"`
	Pincode     int       `bson:"pincode,omitempty" json:"pincode,omitempty"`
	ELoc        string    `bson:"eLoc,omitempty" json:"eLoc,omitempty"`
}

// Help contains contact details for the center’s support.
type Help struct {
	Phone    string `bson:"phone,omitempty" json:"phone,omitempty"`
	Email    string `bson:"email,omitempty" json:"email,omitempty"`
	Whatsapp string `bson:"whatsapp,omitempty" json:"whatsapp,omitempty"`
}

// Center represents a distribution center or store hub.
type Center struct {
	ID              primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    ManagerID       primitive.ObjectID   `bson:"managerId" json:"managerId"`                   // Reference to User
	StoreID         primitive.ObjectID   `bson:"storeId,omitempty" json:"storeId,omitempty"`                       // Reference to Store
	DeliveryBoys    []primitive.ObjectID `bson:"deliveryBoys,omitempty" json:"deliveryBoys,omitempty"`
	HelperIDs       []primitive.ObjectID `bson:"helperIds,omitempty" json:"helperIds,omitempty"`
	Location        GeoJSONPoint         `bson:"location,omitempty" json:"location,omitempty"`
	HelpLine        Help                 `bson:"helpLine,omitempty" json:"helpLine,omitempty"`
	CreatedAt       time.Time            `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt       time.Time            `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
// No need...
// PendingOrderCnt int32                `bson:"pendingOrderCnt,omitempty" json:"pendingOrderCnt,omitempty"`
// PickedOrderCnt  int32                `bson:"pickedOrderCnt,omitempty" json:"pickedOrderCnt,omitempty"`
// TotalWeight     []TotalWeight        `bson:"totalWeight,omitempty" json:"totalWeight,omitempty"`
