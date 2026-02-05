package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	redisSetup "github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"

	// Routes
	userRoutes "github.com/PawanKB9/BTechKabadiwala/internal/user/routes"
	orderRoutes "github.com/PawanKB9/BTechKabadiwala/internal/order/routes/orderRoutes"
	cartRoutes "github.com/PawanKB9/BTechKabadiwala/internal/order/routes/cartRoutes"
	itemsRoute "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/routes"
	centerRoutes "github.com/PawanKB9/BTechKabadiwala/internal/admin/center/routes"
	securityRoute "github.com/PawanKB9/BTechKabadiwala/internal/security/routes"
)

func main() {

	// ---------------- ENV ----------------
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI not set")
	}

	mongoDB := os.Getenv("MONGO_DB")
	if mongoDB == "" {
		log.Fatal("MONGO_DB not set")
	}

	// ---------------- REDIS ----------------
	redisSetup.InitRedis()
	defer redisSetup.CloseRedis()

	clientURL := os.Getenv("CLIENT_ORIGIN") // example: https://btechkabadiwala.com
	if clientURL == "" {
		clientURL = "http://localhost:3000"
	}

	// ---------------- GIN ----------------
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	// r.RedirectTrailingSlash = true
	// r.RedirectFixedPath = true
	
	// Logging + Recover
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Prevent proxy header spoofing
	if err := r.SetTrustedProxies(nil); err != nil {
		log.Fatal("Failed to set trusted proxies:", err)
	}

	// ---------------- CORS ----------------
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{clientURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{
			"Origin",
			"Content-Type",
			"Authorization",
			"X-Captcha-Token",
			"X-OTP-Token",
			"X-OTP-Session-ID",
		},
		ExposeHeaders:    []string{"Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ---------------- SECURITY HEADERS ----------------
	r.Use(func(c *gin.Context) {
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Content-Security-Policy", "default-src 'self' 'unsafe-inline' data: blob: https://www.google.com https://www.gstatic.com")
		c.Next()
	})

	// ---------------- REQUEST TIMEOUT ----------------
	r.Use(func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 20*time.Second)
		defer cancel()
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	})

	// ---------------- REQUEST BODY LIMIT ----------------
	r.Use(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 2<<20) // 2MB
		c.Next()
	})

	// ---------------- MONGO ----------------
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Mongo connection failed:", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Mongo ping failed:", err)
	}

	db := client.Database(mongoDB)

	// ---------------- ROUTES ----------------
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "BTechKabadiwala API is running",
			"status":  "OK",
		})
	})

	// Security / Auth / OTP
	securityRoute.RegisterAuthRoutes(r)

	// User
	userRoutes.RegisterAllUserRoutes(r, client, mongoDB, db)

	// Orders
	orderRoutes.RegisterOrderRoutes(r, client, mongoDB)
	orderRoutes.RegisterOrderAdminRoutes(r, client, mongoDB)

	// Cart
	cartRoutes.RegisterCartRoutes(r, client, mongoDB)

	// Items / Catalog
	itemsRoute.RegisterItemRoutes(r, client, mongoDB)
	itemsRoute.RegisterItemMasterRoutes(r, client, mongoDB)

	// App (public app data)
	itemsRoute.RegisterAppRoutes(r, client, mongoDB)

	// Admin / Centers
	centerRoutes.RegisterCenterRoutes(r, client, mongoDB)

	// ---------------- SERVER ----------------
	srv := &http.Server{
		Addr:           ":" + port,
		Handler:        r,
		ReadTimeout:    15 * time.Second,
		WriteTimeout:   15 * time.Second,
		IdleTimeout:    60 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	fmt.Printf("Server running on http://localhost:%s\n", port)

	// Graceful Shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server failed:", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	fmt.Println("Shutting down server...")

	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelShutdown()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced shutdown:", err)
	}

	fmt.Println("Server exited cleanly")
}
