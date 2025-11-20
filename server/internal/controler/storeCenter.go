// package handlers

// import (
// 	"context"
// 	"encoding/json"
// 	"net/http"

// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"your_project/models"
// )

// // PriceUpdate updates pricePerKg array for an area
// func PriceUpdate(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()
// 		var input struct {
// 			Area       string               `json:"area"`
// 			PricePerKg []models.PricePerKgItem `json:"pricePerKg"`
// 		}
// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Area == "" || len(input.PricePerKg) == 0 {
// 			http.Error(w, "Area and valid pricePerKg array are required", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("appData")
// 		filter := bson.M{"area": input.Area}

// 		existing := collection.FindOne(ctx, filter)
// 		if existing.Err() == mongo.ErrNoDocuments {
// 			http.Error(w, "appData not found for specified area", http.StatusNotFound)
// 			return
// 		} else if existing.Err() != nil {
// 			http.Error(w, "DB error: "+existing.Err().Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		update := bson.M{"$set": bson.M{"pricePerKg": input.PricePerKg}}
// 		_, err := collection.UpdateOne(ctx, filter, update)
// 		if err != nil {
// 			http.Error(w, "Failed to update price list", http.StatusInternalServerError)
// 			return
// 		}

// 		w.WriteHeader(http.StatusOK)
// 		json.NewEncoder(w).Encode(struct {
// 			Message    string                 `json:"message"`
// 			Area       string                 `json:"area"`
// 			PricePerKg []models.PricePerKgItem `json:"pricePerKg"`
// 		}{"Price list updated successfully", input.Area, input.PricePerKg})
// 	}
// }

// // UpdateTotalPurchase updates totalPurchase array for an area
// func UpdateTotalPurchase(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()
// 		var input struct {
// 			Area          string                   `json:"area"`
// 			TotalPurchase []models.TotalPurchaseItem `json:"totalPurchase"`
// 		}
// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Area == "" || len(input.TotalPurchase) == 0 {
// 			http.Error(w, "Area and valid totalPurchase array are required", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("appData")
// 		filter := bson.M{"area": input.Area}

// 		existing := collection.FindOne(ctx, filter)
// 		if existing.Err() == mongo.ErrNoDocuments {
// 			http.Error(w, "appData not found for specified area", http.StatusNotFound)
// 			return
// 		} else if existing.Err() != nil {
// 			http.Error(w, "DB error: "+existing.Err().Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		update := bson.M{"$set": bson.M{"totalPurchase": input.TotalPurchase}}
// 		_, err := collection.UpdateOne(ctx, filter, update)
// 		if err != nil {
// 			http.Error(w, "Failed to update total purchase", http.StatusInternalServerError)
// 			return
// 		}

// 		w.WriteHeader(http.StatusOK)
// 		json.NewEncoder(w).Encode(struct {
// 			Message       string                   `json:"message"`
// 			Area          string                   `json:"area"`
// 			TotalPurchase []models.TotalPurchaseItem `json:"totalPurchase"`
// 		}{"Total purchase updated successfully", input.Area, input.TotalPurchase})
// 	}
// }

// // GetAppDataByArea fetches totalPurchase and pricePerKg for a given area
// func GetAppDataByArea(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()
// 		area := r.URL.Query().Get("area")
// 		if area == "" {
// 			http.Error(w, "Area is required in params", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("appData")
// 		var data models.AppData

// 		err := collection.FindOne(ctx, bson.M{"area": area}).Decode(&data)
// 		if err == mongo.ErrNoDocuments {
// 			http.Error(w, "appData not found for specified area", http.StatusNotFound)
// 			return
// 		} else if err != nil {
// 			http.Error(w, "DB error: "+err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		json.NewEncoder(w).Encode(struct {
// 			Area          string                   `json:"area"`
// 			TotalPurchase []models.TotalPurchaseItem `json:"totalPurchase"`
// 			PricePerKg    []models.PricePerKgItem    `json:"pricePerKg"`
// 		}{
// 			Area:          data.Area,
// 			TotalPurchase: data.TotalPurchase,
// 			PricePerKg:    data.PricePerKg,
// 		})
// 	}
// }

// // CreateAppData creates new appData document for an area
// func CreateAppData(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()

// 		var input struct {
// 			Area          string                   `json:"area"`
// 			TotalPurchase []models.TotalPurchaseItem `json:"totalPurchase"`
// 			PricePerKg    []models.PricePerKgItem    `json:"pricePerKg"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Area == "" {
// 			http.Error(w, "Area is required", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("appData")

// 		existing := collection.FindOne(ctx, bson.M{"area": input.Area})
// 		if existing.Err() != mongo.ErrNoDocuments {
// 			http.Error(w, "appData already exists for this area", http.StatusConflict)
// 			return
// 		}

// 		newData := models.AppData{
// 			Area:          input.Area,
// 			TotalPurchase: input.TotalPurchase,
// 			PricePerKg:    input.PricePerKg,
// 		}

// 		res, err := collection.InsertOne(ctx, newData)
// 		if err != nil {
// 			http.Error(w, "Failed to create appData", http.StatusInternalServerError)
// 			return
// 		}

// 		newData.ID = res.InsertedID.(primitive.ObjectID)

// 		w.WriteHeader(http.StatusCreated)
// 		json.NewEncoder(w).Encode(struct {
// 			Message string         `json:"message"`
// 			AppData models.AppData `json:"appData"`
// 		}{"appData created successfully", newData})
// 	}
// }
