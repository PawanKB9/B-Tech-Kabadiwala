package database

import (
	"go.mongodb.org/mongo-driver/mongo"
)

// GetCollection returns a MongoDB collection from the client
func GetCollection(client *mongo.Client, dbName string, collectionName string) *mongo.Collection {
	return client.Database(dbName).Collection(collectionName)
}