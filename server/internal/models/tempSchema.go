// package models

// import (
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // MalikSchema equivalent
// type Malik struct {
// 	ID       primitive.ObjectID `bson:"_id,omitempty"`
// 	Name     string             `bson:"name"`
// 	Password string             `bson:"password"`
// 	PassKey  string             `bson:"passKey"`
// 	AadharNo int                `bson:"aadharNo"`
// 	Email    string             `bson:"email,omitempty"`
// 	Phone    string             `bson:"phone"`
// 	Kirdar   string             `bson:"kirdar"` // default 'admin' so you set that when creating
// 	CreatedAt time.Time         `bson:"createdAt,omitempty"`
// 	UpdatedAt time.Time         `bson:"updatedAt,omitempty"`
// }

// // AppDataSchema equivalent
// type AppData struct {
// 	ID          primitive.ObjectID `bson:"_id,omitempty"`
// 	UserID      primitive.ObjectID `bson:"userId"` // reference to tempMalik
// 	Area        string             `bson:"area"`
// 	TotalPurchase []struct {
// 		Material string  `bson:"material"`
// 		Weight   float64 `bson:"weight"`
// 	} `bson:"totalPurchase"`
// 	PricePerKg []struct {
// 		Material string  `bson:"material"`
// 		Rate     float64 `bson:"rate"`
// 	} `bson:"pricePerKg"`
// 	CreatedAt time.Time `bson:"createdAt,omitempty"`
// 	UpdatedAt time.Time `bson:"updatedAt,omitempty"`
// }
