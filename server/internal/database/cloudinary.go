package database

import (
	"fmt"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

func main() {

	cloudName := os.Getenv("CLOUD_NAME")
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")

	// Create a new Cloudinary instance
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		panic("Cloudinary configuration failed: " + err.Error())
	}

	// Example use: simply print your Cloudinary account cloud name
	fmt.Println("Cloudinary is configured for:", cld.Config.Cloud.CloudName)
}
