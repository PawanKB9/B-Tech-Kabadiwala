// package handlers

// import (
// 	"context"
// 	"encoding/json"
// 	"net/http"

// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"your_project/models"      // your Sell struct
// 	"your_project/storecenter" // for GetPriceFn and UpdateTotalPurchaseFn equivalents
// )

// // OrderBook creates a new order for a user
// func OrderBook(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()
// 		userId, ok := r.Context().Value("userID").(primitive.ObjectID) // assuming userID stored in context as ObjectID
// 		if !ok {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 			return
// 		}

// 		var input struct {
// 			Items  []models.SellItem `json:"items"`
// 			IsSold bool              `json:"isSold"`
// 			Area   string            `json:"area"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		if len(input.Items) == 0 {
// 			http.Error(w, "Items array is required and cannot be empty", http.StatusBadRequest)
// 			return
// 		}

// 		// Filter valid items
// 		var filteredItems []models.SellItem
// 		for _, item := range input.Items {
// 			if item.Material != "" && item.Weight > 0 {
// 				filteredItems = append(filteredItems, item)
// 			}
// 		}

// 		if len(filteredItems) == 0 {
// 			http.Error(w, "No valid items provided", http.StatusBadRequest)
// 			return
// 		}

// 		// Fetch rate map
// 		rawRates, err := storecenter.GetPriceFn(input.Area)
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
// 			totalPrice += item.Weight * rateMap[item.Material]
// 		}

// 		newOrder := models.Sell{
// 			UserID:     userId,
// 			Items:      filteredItems,
// 			TotalPrice: totalPrice,
// 			IsSold:     input.IsSold,
// 			Status:     models.OrderConfirmed, // default status
// 		}

// 		collection := client.Database("your_db").Collection("selldetails")
// 		result, err := collection.InsertOne(ctx, newOrder)
// 		if err != nil {
// 			http.Error(w, "Failed to save order", http.StatusInternalServerError)
// 			return
// 		}

// 		newOrder.ID = result.InsertedID.(primitive.ObjectID)

// 		json.NewEncoder(w).Encode(struct {
// 			Message string      `json:"message"`
// 			Order   models.Sell `json:"order"`
// 		}{"Order booked successfully", newOrder})
// 	}
// }

// // EditBook updates an existing order for a user
// func EditBook(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()
// 		userId, ok := r.Context().Value("userID").(primitive.ObjectID)
// 		if !ok {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 			return
// 		}

// 		var input struct {
// 			OrderID string          `json:"orderId"`
// 			Items   []models.SellItem `json:"items"`
// 			IsSold  bool            `json:"isSold"`
// 			Area    string          `json:"area"`
// 			Status  string          `json:"status"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		if input.OrderID == "" || len(input.Items) == 0 {
// 			http.Error(w, "orderId and valid items array are required", http.StatusBadRequest)
// 			return
// 		}

// 		orderObjID, err := primitive.ObjectIDFromHex(input.OrderID)
// 		if err != nil {
// 			http.Error(w, "Invalid orderId", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("selldetails")

// 		var existingOrder models.Sell
// 		filter := bson.M{"_id": orderObjID, "userId": userId}
// 		if err := collection.FindOne(ctx, filter).Decode(&existingOrder); err != nil {
// 			http.Error(w, "Order not found", http.StatusNotFound)
// 			return
// 		}

// 		var filteredItems []models.SellItem
// 		for _, item := range input.Items {
// 			if item.Material != "" && item.Weight > 0 {
// 				filteredItems = append(filteredItems, item)
// 			}
// 		}

// 		if len(filteredItems) == 0 {
// 			http.Error(w, "No valid items provided", http.StatusBadRequest)
// 			return
// 		}

// 		rawRates, err := storecenter.GetPriceFn(input.Area)
// 		if err != nil {
// 			http.Error(w, "Failed to get price rates", http.StatusInternalServerError)
// 			return
// 		}

// 		rateMap := make(map[string]float64)
// 		for _, p := range rawRates {
// 			rateMap[p.Material] = p.Rate
// 		}

// 		var totalPrice float64
// 		for _, item := range filteredItems {
// 			totalPrice += item.Weight * rateMap[item.Material]
// 		}

// 		updateData := bson.M{
// 			"items":      filteredItems,
// 			"totalPrice": totalPrice,
// 			"isSold":     input.IsSold,
// 		}

// 		// Only update status if exactly "Cancelled"
// 		if input.Status == "Cancelled" {
// 			updateData["status"] = "Cancelled"
// 		}

// 		update := bson.M{"$set": updateData}

// 		_, err = collection.UpdateOne(ctx, filter, update)
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

// // GetOrderDetails returns user's order details
// func GetOrderDetails(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()

// 		userId, ok := r.Context().Value("userID").(primitive.ObjectID)
// 		if !ok {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("selldetails")

// 		cursor, err := collection.Find(ctx, bson.M{"userId": userId})
// 		if err != nil {
// 			http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
// 			return
// 		}
// 		defer cursor.Close(ctx)

// 		var orders []models.Sell
// 		if err = cursor.All(ctx, &orders); err != nil {
// 			http.Error(w, "Error parsing orders", http.StatusInternalServerError)
// 			return
// 		}

// 		var prvOrder, curOrder []models.Sell
// 		for _, order := range orders {
// 			switch order.Status {
// 			case "Cancelled", "Sold":
// 				prvOrder = append(prvOrder, order)
// 			case "Order Confirmed", "Out for Pickup":
// 				curOrder = append(curOrder, order)
// 			}
// 		}

// 		json.NewEncoder(w).Encode(struct {
// 			Message  string        `json:"message"`
// 			PrvOrder []models.Sell `json:"PrvOrder"`
// 			CurOrder []models.Sell `json:"CurOrder"`
// 		}{"Orders fetched successfully", prvOrder, curOrder})
// 	}
// }

// // UpdateStatus allows admins to update order status and triggers purchase update if sold
// func UpdateStatus(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.TODO()

// 		malikId, ok := r.Context().Value("tempMalikID").(primitive.ObjectID)
// 		if !ok {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 			return
// 		}

// 		var input struct {
// 			OrderID string `json:"orderId"`
// 			Status  string `json:"status"`
// 			Area    string `json:"area"`
// 		}

// 		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		if input.OrderID == "" || input.Status == "" {
// 			http.Error(w, "orderId and status are required", http.StatusBadRequest)
// 			return
// 		}

// 		validStatuses := map[string]bool{
// 			"Order Confirmed": true,
// 			"Out for pickup":  true,
// 			"Sold":            true,
// 		}
// 		if !validStatuses[input.Status] {
// 			http.Error(w, "Invalid status value", http.StatusBadRequest)
// 			return
// 		}

// 		orderObjID, err := primitive.ObjectIDFromHex(input.OrderID)
// 		if err != nil {
// 			http.Error(w, "Invalid orderId", http.StatusBadRequest)
// 			return
// 		}

// 		collection := client.Database("your_db").Collection("selldetails")

// 		var order models.Sell
// 		if err := collection.FindOne(ctx, bson.M{"_id": orderObjID}).Decode(&order); err != nil {
// 			http.Error(w, "Order not found", http.StatusNotFound)
// 			return
// 		}

// 		update := bson.M{"$set": bson.M{"status": input.Status}}
// 		_, err = collection.UpdateByID(ctx, orderObjID, update)
// 		if err != nil {
// 			http.Error(w, "Failed to update status", http.StatusInternalServerError)
// 			return
// 		}

// 		// Update total purchase if status is Sold
// 		if input.Status == "Sold" {
// 			err = storecenter.UpdateTotalPurchaseFn(input.Area, order.Items)
// 			if err != nil {
// 				http.Error(w, "Failed to update total purchase", http.StatusInternalServerError)
// 				return
// 			}
// 		}

// 		json.NewEncoder(w).Encode(struct {
// 			Message string      `json:"message"`
// 			Order   models.Sell `json:"order"`
// 		}{"Status updated successfully", order})
// 	}
// }
