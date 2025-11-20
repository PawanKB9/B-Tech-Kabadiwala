// package handlers

// import (
// 	"context"
// 	"encoding/json"
// 	"net/http"

// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"your_project/models"    // your Sell struct model here
// 	"your_project/storecenter" // your getPriceFn and updateTotalPurchaseFn equivalents here
// )

// // OrderByAdmin handles admin ordering on behalf of user
// func OrderByAdmin(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()

// 		var reqBody struct {
// 			Items    []models.SellItem    `json:"items"`
// 			IsSold   bool                 `json:"isSold"`
// 			Area     string               `json:"area"`
// 			UserInfo *models.UserInfo     `json:"userInfo,omitempty"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		if len(reqBody.Items) == 0 {
// 			http.Error(w, "Items array is required and cannot be empty", http.StatusBadRequest)
// 			return
// 		}

// 		// Validate userInfo if provided
// 		if reqBody.UserInfo != nil {
// 			if reqBody.UserInfo.Name == "" || reqBody.UserInfo.Phone == "" || reqBody.UserInfo.Location.Type != "Point" ||
// 				len(reqBody.UserInfo.Location.Coordinates) != 2 || reqBody.UserInfo.Location.Address == "" ||
// 				reqBody.UserInfo.Location.Pincode == 0 || reqBody.UserInfo.Location.ELoc == "" {
// 				http.Error(w, "userInfo must include valid name, phone, and location with all required fields", http.StatusBadRequest)
// 				return
// 			}
// 		}

// 		// Filter valid items
// 		var filteredItems []models.SellItem
// 		for _, item := range reqBody.Items {
// 			if item.Material != "" && item.Weight > 0 {
// 				filteredItems = append(filteredItems, item)
// 			}
// 		}

// 		// Get price mapping
// 		rawRates, err := storecenter.GetPriceFn(reqBody.Area)
// 		if err != nil {
// 			http.Error(w, "Failed to get price rates", http.StatusInternalServerError)
// 			return
// 		}

// 		rateMap := make(map[string]float64)
// 		for _, p := range rawRates {
// 			rateMap[p.Material] = p.Rate
// 		}

// 		// Calculate total price
// 		var totalPrice float64
// 		for _, item := range filteredItems {
// 			rate := rateMap[item.Material]
// 			totalPrice += item.Weight * rate
// 		}

// 		// Prepare new order document
// 		newOrder := models.Sell{
// 			Items:      filteredItems,
// 			TotalPrice: totalPrice,
// 			IsSold:     reqBody.IsSold,
// 			UserInfo:   reqBody.UserInfo,
// 			Status:     models.OrderConfirmed,
// 		}

// 		collection := client.Database("your_db").Collection("selldetails")
// 		res, err := collection.InsertOne(ctx, newOrder)
// 		if err != nil {
// 			http.Error(w, "Failed to save order", http.StatusInternalServerError)
// 			return
// 		}

// 		newOrder.ID = res.InsertedID.(primitive.ObjectID)
// 		json.NewEncoder(w).Encode(struct {
// 			Message string      `json:"message"`
// 			Order   models.Sell `json:"order"`
// 		}{"Order booked successfully", newOrder})
// 	}
// }

// // AdminEditBook updates an existing order
// func AdminEditBook(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()

// 		var reqBody struct {
// 			OrderID string             `json:"orderId"`
// 			Items   []models.SellItem  `json:"items"`
// 			IsSold  bool               `json:"isSold"`
// 			Area    string             `json:"area"`
// 			Status  string             `json:"status"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		if reqBody.OrderID == "" || len(reqBody.Items) == 0 {
// 			http.Error(w, "orderId and valid items are required", http.StatusBadRequest)
// 			return
// 		}

// 		orderObjID, err := primitive.ObjectIDFromHex(reqBody.OrderID)
// 		if err != nil {
// 			http.Error(w, "Invalid orderId", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("selldetails")

// 		// Find existing order
// 		var existingOrder models.Sell
// 		if err := collection.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&existingOrder); err != nil {
// 			http.Error(w, "Order not found", http.StatusNotFound)
// 			return
// 		}

// 		// Filter valid items
// 		var filteredItems []models.SellItem
// 		for _, item := range reqBody.Items {
// 			if item.Material != "" && item.Weight > 0 {
// 				filteredItems = append(filteredItems, item)
// 			}
// 		}

// 		if len(filteredItems) == 0 {
// 			http.Error(w, "No valid items provided after filtering", http.StatusBadRequest)
// 			return
// 		}

// 		// Get price map
// 		rawRates, err := storecenter.GetPriceFn(reqBody.Area)
// 		if err != nil {
// 			http.Error(w, "Failed to get price rates", http.StatusInternalServerError)
// 			return
// 		}

// 		rateMap := make(map[string]float64)
// 		for _, p := range rawRates {
// 			rateMap[p.Material] = p.Rate
// 		}

// 		// Calculate total price
// 		var totalPrice float64
// 		for _, item := range filteredItems {
// 			rate := rateMap[item.Material]
// 			totalPrice += item.Weight * rate
// 		}

// 		update := bson.M{
// 			"$set": bson.M{
// 				"items":      filteredItems,
// 				"totalPrice": totalPrice,
// 			},
// 		}

// 		if reqBody.Status != "" {
// 			validStatuses := map[string]bool{
// 				"Order Confirmed": true,
// 				"Cancelled":       true,
// 				"Out for pickup":  true,
// 				"Sold":            true,
// 			}
// 			if validStatuses[reqBody.Status] {
// 				update["$set"].(bson.M)["status"] = reqBody.Status
// 				update["$set"].(bson.M)["isSold"] = reqBody.Status == "Sold"
// 			} else {
// 				update["$set"].(bson.M)["isSold"] = reqBody.IsSold
// 			}
// 		}

// 		if reqBody.Status == "Sold" {
// 			err = storecenter.UpdateTotalPurchaseFn(reqBody.Area, filteredItems)
// 			if err != nil {
// 				http.Error(w, "Failed to update total purchase", http.StatusInternalServerError)
// 				return
// 			}
// 		}

// 		_, err = collection.UpdateByID(ctx, orderObjID, update)
// 		if err != nil {
// 			http.Error(w, "Failed to update order", http.StatusInternalServerError)
// 			return
// 		}

// 		json.NewEncoder(w).Encode(struct {
// 			Message string      `json:"message"`
// 			Order   models.Sell `json:"order"`
// 		}{"Order updated successfully", existingOrder})
// 	}
// }
