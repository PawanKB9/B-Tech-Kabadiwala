package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"github.com/PawanKB9/BTechKabadiwala/internal/database"
	"github.com/PawanKB9/BTechKabadiwala/internal/user/routes"
)

func main() {

	// Load env variables
	if err := godotenv.Load(); err != nil {
		fmt.Println("Loading .env Failed")
	}
	fmt.Println(".env variables loaded2")

	// Connect to MongoDB
	client, err := database.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}
	fmt.Println("MongoDB Connected")

	// Router setup
	router := mux.NewRouter()

	// Register User Routes
	userRoutes.RegisterUserRoutes(router.PathPrefix("/api").Subrouter(), client)

	// CORS setup
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})

	handler := c.Handler(router)

	// Server Setup
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "5000"
	}

	fmt.Printf("Server running at http://localhost:%s\n", PORT)
	log.Fatal(http.ListenAndServe(":"+PORT, handler))
}
