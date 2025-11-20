package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var UserCollection *mongo.Collection

func InitMongoDB() *mongo.Client {
	mongoURI := os.Getenv("MONGO_URL")
	if mongoURI == "" {
		log.Fatal("MONGO_URL not set in environment")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}

	UserCollection = client.Database("myapp").Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	indexModel := mongo.IndexModel{
		Keys: bson.M{"phone": 1},
		Options: options.Index().SetUnique(true).SetName("unique_phone"),
	}

	_, err = UserCollection.Indexes().CreateOne(ctx, indexModel)
	if err != nil {
		log.Fatal("Could not create index:", err)
	} else {
		fmt.Println("Unique index created for 'phone'")
	}

	fmt.Println("Connected to MongoDB Atlas successfully!")
	return client
}
