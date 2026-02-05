package database

import "go.mongodb.org/mongo-driver/mongo"

// GetCollection returns a MongoDB collection by name
func GetCollection(db *mongo.Database, collectionName string) *mongo.Collection {
	return db.Collection(collectionName)
}

// Old version->
// package database

// import (
// 	"go.mongodb.org/mongo-driver/mongo"
// )

// // GetCollection returns a MongoDB collection from the client
// func GetCollection(client *mongo.Client, dbName, collectionName string) *mongo.Collection {
// 	return client.Database(dbName).Collection(collectionName)
// }

// var (
// 	UserCollection          *mongo.Collection
// 	UserActivityCollection  *mongo.Collection
// 	ItemCollection          *mongo.Collection
// 	CenterProductCollection *mongo.Collection
// 	AppDataCollection       *mongo.Collection
// 	CartCollection          *mongo.Collection
// 	OrderCollection         *mongo.Collection
// 	CenterCollection        *mongo.Collection
// )

// // ---------- INITIALIZERS ----------

// // Pass mongo.Database pointer from InitMongoDB()

// func InitUserCollection(db *mongo.Database) {
// 	UserCollection = db.Collection("users")
// }

// func InitUserActivityCollection(db *mongo.Database) {
// 	UserActivityCollection = db.Collection("userActivitys")
// }

// func InitItemCollection(db *mongo.Database) {
// 	ItemCollection = db.Collection("items")
// }

// func InitCenterProductCollection(db *mongo.Database) {
// 	CenterProductCollection = db.Collection("centerProducts")
// }

// func InitAppDataCollection(db *mongo.Database) {
// 	AppDataCollection = db.Collection("appDatas")
// }

// func InitCartCollection(db *mongo.Database) {
// 	CartCollection = db.Collection("carts")
// }

// func InitOrderCollection(db *mongo.Database) {
// 	OrderCollection = db.Collection("orders")
// }

// func InitCenterCollection(db *mongo.Database) {
// 	CenterCollection = db.Collection("centers")
// }
