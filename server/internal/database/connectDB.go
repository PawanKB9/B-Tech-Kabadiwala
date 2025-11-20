package database

import (
	"context"
	"fmt"
	"os"
	"time"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() (*mongo.Client, error) {
	
	mongoURI := os.Getenv("MONGO_URL")
	if mongoURI == "" {
		return nil, fmt.Errorf("MONGO_URL not set in environment")
	}

	// Set a timeout for the database connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}

	// Attempt ping to verify connection
	if err := client.Ping(ctx, nil); err != nil {
		return nil, err
	}

	fmt.Println("Connected to Database Successfully")
	return client, nil
}
