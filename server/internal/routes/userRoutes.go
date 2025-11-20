// package routes

// import (
// 	"net/http"

// 	"github.com/gorilla/mux"
// 	"go.mongodb.org/mongo-driver/mongo"

// 	"goserver/auth"
// 	"goserver/otp"
// 	"goserver/controllers"
// 	"goserver/middleware"
// )

// // RegisterUserRoutes sets up user routes with middlewares and file upload handling
// func RegisterUserRoutes(router *mux.Router, client *mongo.Client) {
	
// 	authMiddleware := auth.AuthMiddleware(client)
// 	verifyTokenMiddleware := otp.VerifyTokenMiddleware()
	
// 	// router.Handle("/dummy", http.HandlerFunc(controllers.Login(client))).Methods("POST")
// 	// File upload middleware can be done with a third-party package like "github.com/adelowo/gulter"

// 	// Example with Gulter middleware
// 	// uploadHandler := gulter.New(gulter.WithMaxFileSize(10 << 20)) // 10MB max
// 	// router.Handle("/update-profile-pic", authMiddleware(uploadHandler.Upload("profilePic"))(http.HandlerFunc(controllers.UploadMedia(client)))).Methods("POST")

// 	router.Handle("/signUp", verifyTokenMiddleware(http.HandlerFunc(controllers.SignUp(client)))).Methods("POST")

// 	router.Handle("/login", http.HandlerFunc(controllers.Login(client))).Methods("POST")


// 	router.Handle("/logout", authMiddleware(http.HandlerFunc(controllers.Logout()))).Methods("POST")

// 	router.Handle("/profile", authMiddleware(http.HandlerFunc(controllers.GetCurrentUser(client)))).Methods("GET")

// 	router.Handle("/update-profile", authMiddleware(http.HandlerFunc(controllers.UpdateUser(client)))).Methods("PATCH")

// 	router.Handle("/changepassword", authMiddleware(http.HandlerFunc(controllers.ChangePassword(client)))).Methods("PATCH")

// 	router.Handle("/forgotpassword", verifyTokenMiddleware(http.HandlerFunc(controllers.ForgotPassword(client)))).Methods("POST")

// 	router.Handle("/update-contact", authMiddleware(verifyTokenMiddleware(http.HandlerFunc(controllers.UpdateContact(client))))).Methods("PATCH")
// }
