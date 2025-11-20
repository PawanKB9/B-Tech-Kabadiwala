// package main

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"net/http"
// 	"os"

// 	"github.com/joho/godotenv"
// )

// // Structs for request and response JSON
// type VerifyRequest struct {
// 	Token string `json:"token"`
// }

// type Msg91Request struct {
// 	AuthKey     string `json:"authkey"`
// 	AccessToken string `json:"access-token"`
// }

// type Msg91Response struct {
// 	Type    string `json:"type"`
// 	Message string `json:"message"`
// 	Code    string `json:"code"`
// }

// // Middleware-like handler function
// func VerifyToken(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		var reqBody VerifyRequest
// 		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}

// 		token := reqBody.Token
// 		if token == "" {
// 			fmt.Println("❌ No token provided")
// 			http.Error(w, "Token is required", http.StatusBadRequest)
// 			return
// 		}

// 		if err := godotenv.Load(); err != nil {
// 			fmt.Println("⚠️ Could not load .env file (continuing)")
// 		}

// 		msg91URL := os.Getenv("MSG91URL")
// 		authKey := os.Getenv("MSG91AUTH_KEY")

// 		bodyData := Msg91Request{
// 			AuthKey:     authKey,
// 			AccessToken: token,
// 		}

// 		jsonBody, _ := json.Marshal(bodyData)
// 		req, err := http.NewRequest("POST", msg91URL, bytes.NewBuffer(jsonBody))
// 		if err != nil {
// 			http.Error(w, "Error creating request", http.StatusInternalServerError)
// 			return
// 		}

// 		req.Header.Set("Content-Type", "application/json")
// 		req.Header.Set("Accept", "application/json")

// 		client := &http.Client{}
// 		resp, err := client.Do(req)
// 		if err != nil {
// 			fmt.Println("❌ Exception during MSG91 verification:", err)
// 			http.Error(w, "Internal server error", http.StatusInternalServerError)
// 			return
// 		}
// 		defer resp.Body.Close()

// 		respBody, _ := io.ReadAll(resp.Body)

// 		var result Msg91Response
// 		if err := json.Unmarshal(respBody, &result); err != nil {
// 			http.Error(w, "Error parsing response", http.StatusInternalServerError)
// 			return
// 		}

// 		fmt.Println("✅ MSG91 Response:", result)

// 		if result.Type == "success" {
// 			// Add context metadata if integrated in a real app
// 			next.ServeHTTP(w, r)
// 		} else {
// 			w.WriteHeader(http.StatusUnauthorized)
// 			json.NewEncoder(w).Encode(map[string]interface{}{
// 				"verified": false,
// 				"msg":      result.Message,
// 				"code":     result.Code,
// 			})
// 		}
// 	})
// }

// func main() {
// 	mux := http.NewServeMux()
// 	mux.Handle("/verify", VerifyToken(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		w.Write([]byte("OTP verified successfully!"))
// 	})))

// 	fmt.Println("Server running on :8080")
// 	http.ListenAndServe(":8080", mux)
// }

package authKro
