package userRoutes

import (
	// "net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/PawanKB9/BTechKabadiwala/internal/user/controllers/userControllers"
	"github.com/PawanKB9/BTechKabadiwala/internal/user/Auth"
)

func RegisterUserRoutes(router *mux.Router, client *mongo.Client) {

    // prefix: /{BASE_URL}/user
    userRouter := router.PathPrefix("/user").Subrouter()

    // PUBLIC ROUTES
    userRouter.HandleFunc("/create", userControllers.SignUp(client)).Methods("POST")
    userRouter.HandleFunc("/login", userControllers.Login(client)).Methods("POST")

    // PROTECTED ROUTES
    protected := userRouter.NewRoute().Subrouter()
    protected.Use(userAuth.AuthMiddleware)

    protected.HandleFunc("/logout", userControllers.Logout()).Methods("POST")
    protected.HandleFunc("/me", userControllers.GetCurrentUser(client)).Methods("GET")
}

