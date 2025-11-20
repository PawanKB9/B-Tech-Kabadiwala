// package models

// import (
// 	"time"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // GeoJSONPoint defines location structure for User
// type GeoJSONPoint struct {
// 	Type        string    `bson:"type"`        // must be "Point"
// 	Coordinates []float64 `bson:"coordinates"` // [lng, lat]
// 	Address     string    `bson:"address,omitempty"`
// 	Pincode     int       `bson:"pincode,omitempty"`
// 	ELoc        string    `bson:"eLoc,omitempty"`
// }

// // User schema equivalent
// type User struct {
// 	ID         primitive.ObjectID `bson:"_id,omitempty"`
// 	Name       string             `bson:"name"`
// 	Password   string             `bson:"password"`
// 	Phone      string             `bson:"phone"`
// 	ProfilePic string             `bson:"profilePic,omitempty"` // Cloudinary URL
// 	Location   GeoJSONPoint       `bson:"location"`
// 	Kirdar     string             `bson:"kirdar,omitempty"` // enum: 'local', default 'local'
// 	CreatedAt  time.Time          `bson:"createdAt,omitempty"`
// 	UpdatedAt  time.Time          `bson:"updatedAt,omitempty"`
// }

// // AdminUser schema equivalent
// type AdminUser struct {
// 	ID              primitive.ObjectID `bson:"_id,omitempty"`
// 	Name            string             `bson:"name"`
// 	Password        string             `bson:"password"`
// 	Address         string             `bson:"address"`
// 	Phone           string             `bson:"phone"`
// 	OptionalContact string             `bson:"optionalContact,omitempty"`
// 	AdharCardNumber string             `bson:"adharCardNumber"`
// 	AdharDocs       string             `bson:"adharDocs,omitempty"` // Cloudinary URL or file path
// 	Marksheet10     string             `bson:"marksheet10,omitempty"`
// 	Marksheet12     string             `bson:"marksheet12,omitempty"`
// 	OfferLetter     string             `bson:"offerLetter,omitempty"`
// 	JoinLetter      string             `bson:"joinLetter,omitempty"`
// 	Degree          string             `bson:"degree,omitempty"`
// 	DegreeDoc       string             `bson:"degreeDoc,omitempty"`
// 	Img             string             `bson:"img,omitempty"`
// 	CreatedAt       time.Time          `bson:"createdAt,omitempty"`
// 	UpdatedAt       time.Time          `bson:"updatedAt,omitempty"`
// }
