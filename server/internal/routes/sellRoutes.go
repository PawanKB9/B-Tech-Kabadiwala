// package routes

// import (
// 	"net/http"

// 	"github.com/gorilla/mux"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"kabadinext/auth"        // your JWT auth middleware
// 	"kabadinext/handlers"    // your route handlers
// 	"kabadinext/storecenter" // store center handlers
// 	"kabadinext/sellcontrol" // sell controllers
// )

// // RegisterRoutes setups all HTTP routes with middleware
// func RegisterRoutes(router *mux.Router, client *mongo.Client) {

// 	// Middleware instances
// 	authMiddleware := auth.AuthMiddleware(client)
// 	malikAuthMiddleware := auth.MalikAuthMiddleware(client)

// 	// Order Routes
// 	router.Handle("/newOrder", authMiddleware(http.HandlerFunc(sellcontrol.OrderBook(client)))).Methods("POST")
// 	router.Handle("/editOrder", authMiddleware(http.HandlerFunc(sellcontrol.EditBook(client)))).Methods("PATCH")
// 	router.Handle("/getOrder", authMiddleware(http.HandlerFunc(sellcontrol.GetOrderDetails(client)))).Methods("GET")
// 	router.Handle("/status-update", malikAuthMiddleware(http.HandlerFunc(sellcontrol.UpdateStatus(client)))).Methods("PATCH")

// 	// App Data Routes (admin only)
// 	router.Handle("/price-update", malikAuthMiddleware(http.HandlerFunc(storecenter.PriceUpdate(client)))).Methods("PATCH")
// 	router.Handle("/update-totalPurchase", malikAuthMiddleware(http.HandlerFunc(storecenter.UpdateTotalPurchase(client)))).Methods("PATCH")
// 	router.Handle("/app-data", malikAuthMiddleware(http.HandlerFunc(storecenter.GetAppDataByArea(client)))).Methods("GET")
// 	router.Handle("/create-appData", malikAuthMiddleware(http.HandlerFunc(storecenter.CreateAppData(client)))).Methods("POST")
// 	router.Handle("/prices", http.HandlerFunc(storecenter.GetPrice)).Methods("GET") // open for public

// 	router.Handle("/get-userOrder", malikAuthMiddleware(http.HandlerFunc(storecenter.GetAllOrdersGrouped(client)))).Methods("GET")
// 	router.Handle("/delete-userOrder", malikAuthMiddleware(http.HandlerFunc(storecenter.DeleteSoldOrders(client)))).Methods("DELETE")
// }
