package orderRoutes

import (
	"github.com/gin-gonic/gin"
	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"
	orderControllers "github.com/PawanKB9/BTechKabadiwala/internal/order/controllers/order"
	"go.mongodb.org/mongo-driver/mongo"
)

// NOTE: We are using Non-blocking auth Middleware
func RegisterOrderRoutes(r *gin.Engine, client *mongo.Client, dbName string) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	orderCtrl := orderControllers.NewOrderController(client, dbName)
	invoiceCtrl := orderControllers.NewInvoiceController(client, dbName) // ✅ FIX

	api := r.Group("/api/orders")

	// ---------------- PROTECTED ROUTES ----------------
	api.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	// Create order (Admin + Customer)
	api.POST("/create", orderCtrl.CreateOrder())

	// Delete history (user only)
	api.DELETE("/history/delete", orderCtrl.DeleteOrder())
	api.DELETE("/history/delete-all", orderCtrl.DeleteAllOrders())

	// Active Orders (user)
	api.GET("/active", orderCtrl.GetActiveOrders())

	// Order History (user)
	api.GET("/history", orderCtrl.GetUserOrderHistory())

	// User Status Update (Arrived ➝ Picked)
	api.PATCH("/status/user", orderCtrl.UserUpdateOrderStatus())

	// Update items inside order
	api.PUT("/update-items/user", orderCtrl.UpdateOrder())

	// Order by OrderId
	api.GET("/:orderId", orderCtrl.GetOrderByID())

	// FIXED: invoice routes use InvoiceController
	api.GET("/invoices/order/:orderId", invoiceCtrl.GetInvoiceByOrderID())
	api.GET("/invoices/:invoiceId/download", invoiceCtrl.DownloadInvoicePDF())
}

func RegisterOrderAdminRoutes(r *gin.Engine, client *mongo.Client, dbName string) {

	authCtrl := &auth.AuthController{
		Client: client,
		DBName: dbName,
	}

	orderCtrl := orderControllers.NewOrderController(client, dbName)

	orders := r.Group("/api/orders")

	// ---------------- ADMIN PROTECTED ROUTES ----------------
	orders.Use(
		securityMiddleware.IPThrottleMiddleware(),
		securityMiddleware.HeaderValidationMiddleware(),
		authCtrl.AuthMiddleware(),
		authCtrl.TokenValidityMiddleware(),
		securityMiddleware.UserRateLimitMiddleware(),
		securityMiddleware.RiskMiddleware(),
		securityMiddleware.RiskCaptchaGate(),
	)

	// Admin → View center orders
	orders.GET("/center/:centerId", orderCtrl.GetCenterOrdersAdmin())

	// Admin → change status
	orders.PUT("/status/admin", orderCtrl.UpdateOrderStatus())

	// Admin select & delete multiple
	orders.DELETE("/select/delete-many", orderCtrl.DeleteMultipleOrders())
}





// package orderRoutes

// import (
// 	"github.com/gin-gonic/gin"
// 	auth "github.com/PawanKB9/BTechKabadiwala/internal/auth"
// 	securityMiddleware "github.com/PawanKB9/BTechKabadiwala/internal/security/middleware"
// 	orderControllers "github.com/PawanKB9/BTechKabadiwala/internal/order/controllers/order"
// 	"go.mongodb.org/mongo-driver/mongo"
// )

// // NOTE: We are using Non-blocking auth Middleware
// func RegisterOrderRoutes(r *gin.Engine, client *mongo.Client, dbName string) {

// 	authCtrl := &auth.AuthController{
// 		Client: client,
// 		DBName: dbName,
// 	}

// 	orderCtrl := orderControllers.NewOrderController(client, dbName)

// 	api := r.Group("/api/orders")

// 	// ---------------- PROTECTED ROUTES ----------------
// 	api.Use(
// 		securityMiddleware.IPThrottleMiddleware(),
// 		securityMiddleware.HeaderValidationMiddleware(),
// 		authCtrl.AuthMiddleware(),
// 		authCtrl.TokenValidityMiddleware(),
// 		securityMiddleware.UserRateLimitMiddleware(),
// 		securityMiddleware.RiskMiddleware(),
// 		securityMiddleware.RiskCaptchaGate(),
// 	)

// 	// Create order (Admin + Customer)
// 	api.POST("/create", orderCtrl.CreateOrder())

// 	// Delete history (user only)
// 	api.DELETE("/history/delete", orderCtrl.DeleteOrder())

// 	api.DELETE("/history/delete-all", orderCtrl.DeleteAllOrders())

// 	// Active Orders (user)
// 	api.GET("/active", orderCtrl.GetActiveOrders())

// 	// Order History (user)
// 	api.GET("/history", orderCtrl.GetUserOrderHistory())

// 	// User Status Update (Arrived ➝ Picked)
// 	api.PATCH("/status/user", orderCtrl.UserUpdateOrderStatus())

// 	// Update items inside order
// 	api.PUT("/update-items/user", orderCtrl.UpdateOrder())

// 	// Order by OrderId
// 	api.GET("/:orderId", orderCtrl.GetOrderByID())

// 	// get invoice (JSON)
// 	api.GET("/invoices/order/:orderId", orderCtrl.GetInvoiceByOrderID())

// 	// download invoice PDF
// 	api.GET("/invoices/:invoiceId/download", orderCtrl.DownloadInvoicePDF())

// }

// func RegisterOrderAdminRoutes(r *gin.Engine, client *mongo.Client, dbName string) {

// 	authCtrl := &auth.AuthController{
// 		Client: client,
// 		DBName: dbName,
// 	}

// 	orderCtrl := orderControllers.NewOrderController(client, dbName)

// 	orders := r.Group("/api/orders")

// 	// ---------------- ADMIN PROTECTED ROUTES ----------------
// 	orders.Use(
// 		securityMiddleware.IPThrottleMiddleware(),
// 		securityMiddleware.HeaderValidationMiddleware(),
// 		authCtrl.AuthMiddleware(),
// 		authCtrl.TokenValidityMiddleware(),
// 		securityMiddleware.UserRateLimitMiddleware(),
// 		securityMiddleware.RiskMiddleware(),
// 		securityMiddleware.RiskCaptchaGate(),
// 	)

// 	// Admin → View center orders
// 	orders.GET("/center/:centerId", orderCtrl.GetCenterOrdersAdmin())

// 	// Admin → change status
// 	orders.PUT("/status/admin", orderCtrl.UpdateOrderStatus())

// 	// Admin select & delete multiple
// 	orders.DELETE("/select/delete-many", orderCtrl.DeleteMultipleOrders())
// }
