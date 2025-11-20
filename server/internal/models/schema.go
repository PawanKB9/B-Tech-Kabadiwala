// package models

// import (
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // Location sub-struct for both schemas
// type Location struct {
// 	Lat              float64 `bson:"lat,omitempty"`
// 	Lng              float64 `bson:"lng,omitempty"`
// 	FormattedAddress string  `bson:"formattedAddress,omitempty"`
// 	Pincode          string  `bson:"pincode,omitempty"`
// }

// // PendingMaterial (used in both schemas)
// type PendingMaterial struct {
// 	MaterialName string  `bson:"materialName,omitempty"`
// 	TotalWeight  float64 `bson:"totalWeight,omitempty"`
// }

// // Center schema
// type Center struct {
// 	ID            primitive.ObjectID   `bson:"_id,omitempty"`
// 	ManagerID     primitive.ObjectID   `bson:"managerId"`
// 	ManagerName   string               `bson:"managerName"`
// 	Contact       string               `bson:"contact,omitempty"`
// 	Location      Location             `bson:"location,omitempty"`
// 	HelperID      []primitive.ObjectID `bson:"helperId,omitempty"`
// 	DeliveryBoys  []primitive.ObjectID `bson:"deliveryBoys"`
// 	Pending       []PendingMaterial    `bson:"pending,omitempty"`
// 	StoreID       primitive.ObjectID   `bson:"storeId,omitempty"`
// 	CreatedAt     time.Time            `bson:"createdAt,omitempty"`
// 	UpdatedAt     time.Time            `bson:"updatedAt,omitempty"`
// }

// // Store schema
// type Store struct {
// 	ID               primitive.ObjectID   `bson:"_id,omitempty"`
// 	StoreManagerID   primitive.ObjectID   `bson:"storeManagerId"`
// 	StoreManagerName string               `bson:"storeManagerName"`
// 	Contact          string               `bson:"contact,omitempty"`
// 	Location         Location             `bson:"location,omitempty"`
// 	HelpersID        []primitive.ObjectID `bson:"helpersId,omitempty"`
// 	DeliveryTruck    []struct {
// 		ContainerType   string  `bson:"containerType,omitempty"`
// 		Capacity        float64 `bson:"capacity,omitempty"`
// 		RegistrationNo  string  `bson:"registrationNo,omitempty"`
// 	} `bson:"deliveryTruck,omitempty"`
// 	Pending          []PendingMaterial    `bson:"pending,omitempty"`
// 	ConnectedCenters []primitive.ObjectID `bson:"connectedCenters,omitempty"`
// 	CreatedAt        time.Time            `bson:"createdAt,omitempty"`
// 	UpdatedAt        time.Time            `bson:"updatedAt,omitempty"`
// }
