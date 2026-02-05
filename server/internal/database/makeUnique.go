package database

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateIndexes(ctx context.Context, db *mongo.Database) {

    // ===================== USERS =====================
    userCol := db.Collection("users")

    // Unique Phone
    _, err := userCol.Indexes().CreateOne(ctx, mongo.IndexModel{
        Keys: bson.M{"phone": 1},
        Options: options.Index().SetUnique(true).SetName("unique_phone"),
    })
    if err != nil {
        log.Println("Error creating User.phone index:", err)
    }

    // Unique Email
    _, err = userCol.Indexes().CreateOne(ctx, mongo.IndexModel{
        Keys: bson.M{"email": 1},
        Options: options.Index().SetUnique(true).SetSparse(true).SetName("unique_email"),
    })
    if err != nil {
        log.Println("Error creating User.email index:", err)
    }

    // ===================== CENTERS =====================
    centerCol := db.Collection("centers")

    // Geo index
    _, err = centerCol.Indexes().CreateOne(ctx, mongo.IndexModel{
        Keys: bson.M{
            "location": "2dsphere",
        },
        Options: options.Index().SetName("center_location_geo"),
    })
    if err != nil {
        log.Println("Error creating Center.location geo index:", err)
    }

    // ===================== USER ACTIVITY =====================
    userActCol := db.Collection("userActivities")

    // Unique userId → ensures one activity doc per user, fast lookup
    _, err = userActCol.Indexes().CreateOne(ctx, mongo.IndexModel{
        Keys: bson.M{"userId": 1},
        Options: options.Index().SetUnique(true).SetName("unique_userId"),
    })
    if err != nil {
        log.Println("Error creating UserActivity.userId index:", err)
    }

    log.Println("All indexes created successfully")
}
