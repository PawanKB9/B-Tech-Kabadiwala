// package routes

// import (
// 	"net/http"

// 	"github.com/gorilla/mux"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"kabadinext/auth"        // Your auth and malikAuth middleware
// 	"kabadinext/otp"         // Your VerifyToken middleware
// 	"kabadinext/controllers" // Handlers: malik controllers, admin order controllers
// )

// // RegisterTempMalikRoutes configures the router with tempMalik related routes and middleware
// func RegisterTempMalikRoutes(router *mux.Router, client *mongo.Client) {
// 	// Middleware wrappers
// 	authMiddleware := auth.AuthMiddleware(client)       // Validate JWT token and attach user context
// 	malikAuthMiddleware := auth.MalikAuthMiddleware(client) // Validate Malik admin
// 	verifyTokenMiddleware := otp.VerifyTokenMiddleware() // OTP verification middleware

// 	// Routes with middleware in order resembling Express.js use
// 	router.Handle("/signup", verifyTokenMiddleware(authMiddleware(http.HandlerFunc(controllers.MalikSignUp(client))))).Methods("POST")
// 	router.Handle("/login", http.HandlerFunc(controllers.TempMalikLogin(client))).Methods("POST")
// 	router.Handle("/logout", malikAuthMiddleware(http.HandlerFunc(controllers.MalikLogout(client)))).Methods("POST")
// 	router.Handle("/details", malikAuthMiddleware(http.HandlerFunc(controllers.GetMalik(client)))).Methods("GET")
// 	router.Handle("/changepassword", malikAuthMiddleware(http.HandlerFunc(controllers.TempMalikChangePassword(client)))).Methods("PATCH")
// 	router.Handle("/forgotpassword", verifyTokenMiddleware(http.HandlerFunc(controllers.TempMalikForgotPassword(client)))).Methods("POST")
// 	router.Handle("/update-contact", malikAuthMiddleware(verifyTokenMiddleware(http.HandlerFunc(controllers.UpdateMalikContact(client))))).Methods("PATCH")
// 	router.Handle("/admin-order", malikAuthMiddleware(http.HandlerFunc(controllers.OrderByAdmin(client)))).Methods("POST")
// 	router.Handle("/admin-orderUpdate", malikAuthMiddleware(http.HandlerFunc(controllers.AdminEditBook(client)))).Methods("PATCH")
// }
