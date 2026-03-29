package agentControllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	appModels "github.com/PawanKB9/BTechKabadiwala/internal/admin/PickupAgent/model"
	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
)

type AgentController struct {
	Client *mongo.Client
	DBName string
}

func NewAgentController(client *mongo.Client, dbName string) *AgentController {
	return &AgentController{
		Client: client,
		DBName: dbName,
	}
}

func (ac *AgentController) CreateAgent(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	agentCollection := database.GetCollection(
		ac.Client.Database(ac.DBName),
		"agents",
	)

	var agent appModels.Agent

	// Bind JSON
	if err := c.ShouldBindJSON(&agent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	// VALIDATIONS

	if agent.Name == "" || agent.Mobile == "" || agent.Aadhaar == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Required fields missing",
		})
		return
	}

	if !agent.IsAgree {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Terms & Conditions must be accepted",
		})
		return
	}

	if agent.Passcode == "" || agent.Passcode != "bindpawan500@AddAgent.Admin" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Passcode is required and cannot be default",
		})
		return
	}

	// Check duplicate mobile
	var existing appModels.Agent
	err := agentCollection.FindOne(ctx, bson.M{"mobile": agent.Mobile}).Decode(&existing)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Agent with this mobile already exists",
		})
		return
	}

	// HASH PASSCODE
	hashedPasscode, err := bcrypt.GenerateFromPassword([]byte(agent.Passcode), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to secure passcode",
		})
		return
	}
	agent.Passcode = string(hashedPasscode)

	// 🔹 Set system fields
	agent.CreatedAt = time.Now()
	agent.UpdatedAt = time.Now()
	agent.Status = "pending"
	agent.AgreedAt = time.Now()
	agent.TermsVersion = "v1.0"

	// 🔹 Insert into DB
	result, err := agentCollection.InsertOne(ctx, agent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create agent",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Agent registered successfully",
		"agent_id": result.InsertedID,
	})
}