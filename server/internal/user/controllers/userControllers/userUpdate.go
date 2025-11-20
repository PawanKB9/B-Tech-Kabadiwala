package userControllers

// Simple regex email validation
func isValidEmail(email string) bool {
	re := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(re, email)
	return matched
}

// Indian phone validation (+91 10 digits)
func isValidIndianPhone(phone string) bool {
	re := `^(\+91)?[6-9][0-9]{9}$`
	matched, _ := regexp.MatchString(re, phone)
	return matched
}


// update user Info
func UpdateUserInfo(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()

		// 1. Get logged-in userID from context
		userIDValue := r.Context().Value("userID")
		userID, ok := userIDValue.(primitive.ObjectID)
		if !ok {
			http.Error(w, "Unauthorized: Invalid user", http.StatusUnauthorized)
			return
		}

		// 2. Parse request body
		var input struct {
			Name          string                  `json:"name,omitempty"`
			Phone         string                  `json:"phone,omitempty"`
			AltPhone      string                  `json:"altPhone,omitempty"`
			Email         string                  `json:"email,omitempty"`
			Location      userModels.GeoJSONPoint `json:"location,omitempty"`
			IsOtpVerified bool                    `json:"isOtpVerified,omitempty"` // for phone verification
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		userCollection := database.GetCollection(client, DB_NAME, "users")

		// 3. Fetch current user
		var user userModels.User
		if err := userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		updateData := bson.M{}
		setData := bson.M{}
		pushData := bson.M{}

		// 4. Update Name
		if input.Name != "" {
			setData["name"] = input.Name
		}

		// 5. Update Email (simple validation)
		if input.Email != "" {
			if !isValidEmail(input.Email) {
				http.Error(w, "Invalid email format", http.StatusBadRequest)
				return
			}
			setData["email"] = input.Email
		}

		// 6. Update Phone (check OTP if changed)
		if input.Phone != "" && input.Phone != user.Phone {
			if !input.IsOtpVerified {
				http.Error(w, "Phone change requires OTP verification", http.StatusBadRequest)
				return
			}
			setData["phone"] = input.Phone
		}

		// 7. Validate AltPhone (+91 10 digits)
		if input.AltPhone != "" {
			if !isValidIndianPhone(input.AltPhone) {
				http.Error(w, "AltPhone must be a valid Indian number (+91xxxxxxxxxx)", http.StatusBadRequest)
				return
			}
			setData["altPhone"] = input.AltPhone
		}

		// 8. Update Location & push to savedLocations
		if len(input.Location.Coordinates) == 2 {
			if input.Location.Type == "" {
				input.Location.Type = "Point"
			}

			setData["primeLocation"] = input.Location

			// Push to savedLocations
			pushData["savedLocations"] = input.Location
		}

		if len(setData) > 0 {
			updateData["$set"] = setData
		}

		if len(pushData) > 0 {
			updateData["$push"] = pushData
		}

		if len(updateData) == 0 {
			http.Error(w, "Nothing to update", http.StatusBadRequest)
			return
		}

		// Update timestamp
		if updateData["$set"] == nil {
			updateData["$set"] = bson.M{}
		}
		updateData["$set"].(bson.M)["updatedAt"] = time.Now()

		// 9. Update DB
		_, err := userCollection.UpdateByID(ctx, user.ID, updateData)
		if err != nil {
			http.Error(w, "Failed to update user info", http.StatusInternalServerError)
			return
		}

		// 10. Return success response
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		}{
			Message: "User info updated successfully",
		})
	}
}


// change Password
func ChangePassword(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx := context.TODO()

        // 1. Extract userID from context (set by AuthMiddleware)
        userIDValue := r.Context().Value("userID")
        userID, ok := userIDValue.(primitive.ObjectID)
        if !ok {
            http.Error(w, "Unauthorized: Invalid user", http.StatusUnauthorized)
            return
        }

        // 2. Read request body
        var input struct {
            OldPassword string `json:"oldPassword"`
            NewPassword string `json:"newPassword"`
        }

        if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
            http.Error(w, "Invalid request", http.StatusBadRequest)
            return
        }

        if input.OldPassword == "" || input.NewPassword == "" {
            http.Error(w, "Both oldPassword and newPassword are required", http.StatusBadRequest)
            return
        }

        userCollection := database.GetCollection(client, DB_NAME, "users")

        // 3. Fetch user
        var user userModels.User
        err := userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
        if err != nil {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }

        // Cannot change password if user is unverified or password not set
        if user.Password == "" {
            http.Error(w, "Password cannot be changed. User not verified or password not set.", http.StatusBadRequest)
            return
        }

        // 4. Compare old password
        if !userAuth.ComparePassword(input.OldPassword, user.Password) {
            http.Error(w, "Old password incorrect", http.StatusUnauthorized)
            return
        }

        // 5. Hash new password
        hashed, err := userAuth.HashPassword(input.NewPassword)
        if err != nil {
            http.Error(w, "Failed to hash password", http.StatusInternalServerError)
            return
        }

        // 6. Update DB
        update := bson.M{
            "$set": bson.M{
                "password":  hashed,
                "updatedAt": time.Now(),
            },
        }

        _, err = userCollection.UpdateByID(ctx, user.ID, update)
        if err != nil {
            http.Error(w, "Failed to update password", http.StatusInternalServerError)
            return
        }

        // 7. Response
        json.NewEncoder(w).Encode(struct {
            Message string `json:"message"`
        }{
            Message: "Password updated successfully",
        })
    }
}


// forgot password
func ForgotPassword(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.TODO()

		var input struct {
			Phone       string `json:"phone"`
			NewPassword string `json:"newPassword"`
			IsOtpVerified bool `json:"otpVerified"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if input.Phone == "" || input.NewPassword == "" {
			http.Error(w, "Phone and newPassword are required", http.StatusBadRequest)
			return
		}

		if !input.IsOtpVerified {
			http.Error(w, "OTP not verified", http.StatusBadRequest)
			return
		}

		userCollection := database.GetCollection(client, DB_NAME, "users")

		// Fetch user by phone
		var user userModels.User
		err := userCollection.FindOne(ctx, bson.M{"phone": input.Phone}).Decode(&user)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		// Hash new password
		hashed, err := userAuth.HashPassword(input.NewPassword)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		// Update password in DB and set IsVerified true (since OTP verified)
		update := bson.M{
			"$set": bson.M{
				"password":   hashed,
				"isVerified": true,
				"updatedAt":  time.Now(),
			},
		}

		_, err = userCollection.UpdateByID(ctx, user.ID, update)
		if err != nil {
			http.Error(w, "Failed to update password", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		}{
			Message: "Password reset successfully",
		})
	}
}
