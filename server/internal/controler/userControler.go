package handlers

import (
	"context"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"golang.org/x/crypto/bcrypt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"your_project/models"
)







// UpdateUser handler (name and location)
func UpdateUser(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()
		userID, ok := r.Context().Value("userID").(primitive.ObjectID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var input struct {
			Name     string             `json:"name,omitempty"`
			Location *models.GeoJSONPoint `json:"location,omitempty"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		update := primitive.M{}
		if input.Name != "" {
			update["name"] = input.Name
		}
		if input.Location != nil {
			if len(input.Location.Coordinates) != 2 {
				http.Error(w, "Invalid location coordinates", http.StatusBadRequest)
				return
			}
			update["location"] = input.Location
		}
		if len(update) == 0 {
			http.Error(w, "No fields to update", http.StatusBadRequest)
			return
		}

		collection := client.Database("your_db").Collection("users")
		opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

		var updatedUser models.User
		err := collection.FindOneAndUpdate(ctx, primitive.M{"_id": userID}, primitive.M{"$set": update}, opts).Decode(&updatedUser)
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}

		updatedUser.Password = ""
		json.NewEncoder(w).Encode(updatedUser)
	}
}

// UploadMedia handler for profile pic upload using Cloudinary
func UploadMedia(client *mongo.Client, cld *cloudinary.Cloudinary) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()
		userID, ok := r.Context().Value("userID").(primitive.ObjectID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		file, header, err := r.FormFile("profilePic")
		if err != nil {
			http.Error(w, "ProfilePic file is required", http.StatusBadRequest)
			return
		}
		defer file.Close()

		uploadParams := uploader.UploadParams{Folder: "profiles"}

		uploadResult, err := cld.Upload.Upload(ctx, file, uploadParams)
		if err != nil {
			http.Error(w, "Failed to upload image", http.StatusInternalServerError)
			return
		}

		collection := client.Database("your_db").Collection("users")
		opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

		var updatedUser models.User
		err = collection.FindOneAndUpdate(ctx, primitive.M{"_id": userID}, primitive.M{"$set": primitive.M{"profilePic": uploadResult.SecureURL}}, opts).Decode(&updatedUser)
		if err != nil {
			http.Error(w, "Failed to update profile picture", http.StatusInternalServerError)
			return
		}

		updatedUser.Password = ""
		json.NewEncoder(w).Encode(struct {
			Message   string      `json:"message"`
			ProfilePic string     `json:"profilePic"`
			User      models.User `json:"user"`
		}{
			Message:   "Upload successful and profile updated",
			ProfilePic: uploadResult.SecureURL,
			User:      updatedUser,
		})
	}
}

// ChangePassword handler
func ChangePassword(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()
		userID, ok := r.Context().Value("userID").(primitive.ObjectID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var input struct {
			OldPassword string `json:"oldPassword"`
			NewPassword string `json:"newPassword"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		collection := client.Database("your_db").Collection("users")
		var user models.User
		err := collection.FindOne(ctx, primitive.M{"_id": userID}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}

		if !comparePassword(input.OldPassword, user.Password) {
			http.Error(w, "Incorrect old password", http.StatusBadRequest)
			return
		}

		hashedNewPass, err := hashPassword(input.NewPassword)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		_, err = collection.UpdateOne(ctx, primitive.M{"_id": userID}, primitive.M{"$set": primitive.M{"password": hashedNewPass}})
		if err != nil {
			http.Error(w, "Failed to update password", http.StatusInternalServerError)
			return
		}

		w.Write([]byte(`{"message":"Password updated successfully"}`))
	}
}

// ForgotPassword handler
func ForgotPassword(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()

		var input struct {
			Phone    string `json:"phone"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if input.Phone == "" || input.Password == "" {
			http.Error(w, "Phone & password required", http.StatusBadRequest)
			return
		}

		collection := client.Database("your_db").Collection("users")
		var user models.User
		err := collection.FindOne(ctx, primitive.M{"phone": input.Phone}).Decode(&user)
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}

		hashedPass, err := hashPassword(input.Password)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		_, err = collection.UpdateOne(ctx, primitive.M{"_id": user.ID}, primitive.M{"$set": primitive.M{"password": hashedPass}})
		if err != nil {
			http.Error(w, "Failed to update password", http.StatusInternalServerError)
			return
		}

		token, err := generateToken(user.ID)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "token",
			Value:    token,
			HttpOnly: true,
			Secure:   true, // use false in dev, true in prod
			SameSite: http.SameSiteStrictMode,
			Expires:  time.Now().Add(30 * 24 * time.Hour),
		})

		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
			Token   string `json:"token"`
		}{
			Message: "Password reset successfully",
			Token:   token,
		})
	}
}

// UpdateContact handler
func UpdateContact(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()

		// check OTP verified flag from context
		if verified, ok := r.Context().Value("otpVerified").(bool); !ok || !verified {
			http.Error(w, "OTP not verified. Access denied.", http.StatusUnauthorized)
			return
		}

		userID, ok := r.Context().Value("userID").(primitive.ObjectID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var input struct {
			OldContact string `json:"oldContact"`
			NewContact string `json:"newContact"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if input.OldContact == "" || input.NewContact == "" {
			http.Error(w, "Please provide old and new contacts", http.StatusBadRequest)
			return
		}
		if input.NewContact == input.OldContact {
			http.Error(w, "Current & new Contact are same", http.StatusBadRequest)
			return
		}

		collection := client.Database("your_db").Collection("users")
		var currentUser models.User
		err := collection.FindOne(ctx, primitive.M{"_id": userID}).Decode(&currentUser)
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}

		if currentUser.Phone != input.OldContact {
			http.Error(w, "Old contact does not match", http.StatusBadRequest)
			return
		}

		count, err := collection.CountDocuments(ctx, primitive.M{"phone": input.NewContact})
		if err != nil {
			http.Error(w, "DB error", http.StatusInternalServerError)
			return
		}
		if count > 0 {
			http.Error(w, "User already exists", http.StatusBadRequest)
			return
		}

		_, err = collection.UpdateOne(ctx, primitive.M{"_id": userID}, primitive.M{"$set": primitive.M{"phone": input.NewContact}})
		if err != nil {
			http.Error(w, "Failed to update contact", http.StatusInternalServerError)
			return
		}

		var updatedUser models.User
		err = collection.FindOne(ctx, primitive.M{"_id": userID}).Decode(&updatedUser)
		if err != nil {
			http.Error(w, "Failed to fetch updated user", http.StatusInternalServerError)
			return
		}
		updatedUser.Password = ""

		json.NewEncoder(w).Encode(struct {
			Message string      `json:"message"`
			User    models.User `json:"user"`
		}{
			Message: "Contact updated successfully",
			User:    updatedUser,
		})
	}
}
