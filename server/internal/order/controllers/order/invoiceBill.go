package orderControllers

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	database "github.com/PawanKB9/BTechKabadiwala/internal/database"
	orderModels "github.com/PawanKB9/BTechKabadiwala/internal/order/model"
)

type InvoiceController struct {
	Client *mongo.Client
	DBName string
}

func NewInvoiceController(client *mongo.Client, dbName string) *InvoiceController {
	return &InvoiceController{
		Client: client,
		DBName: dbName,
	}
}

// USER: GET INVOICE BY ORDER ID
func (ic *InvoiceController) GetInvoiceByOrderID() gin.HandlerFunc {
	return func(c *gin.Context) {

		// ✅ FIX 1: correct auth extraction
		userIDValue, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		userID, ok := userIDValue.(primitive.ObjectID)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user"})
			return
		}

		// Validate orderId
		orderIDParam := strings.TrimSpace(c.Param("orderId"))
		if orderIDParam == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "orderId is required"})
			return
		}

		// ✅ FIX 2: ObjectID parsing
		orderObjID, err := primitive.ObjectIDFromHex(orderIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid orderId"})
			return
		}

		ctx := c.Request.Context()

		invoiceCol := database.GetCollection(
			ic.Client.Database(ic.DBName),
			"invoices",
		)

		// Fetch invoice
		var invoice orderModels.Invoice
		err = invoiceCol.FindOne(ctx, bson.M{
			"orderId":         orderObjID,
			"customer.userId": userID,
		}).Decode(&invoice)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "invoice not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"invoice": invoice})
	}
}

// USER: DOWNLOAD INVOICE PDF
func (ic *InvoiceController) DownloadInvoicePDF() gin.HandlerFunc {
	return func(c *gin.Context) {

		// ✅ FIX 3: use same auth style (auth.GetUserID does NOT exist)
		userIDValue, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		userID, ok := userIDValue.(primitive.ObjectID)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user"})
			return
		}

		invoiceIDParam := strings.TrimSpace(c.Param("invoiceId"))
		if invoiceIDParam == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invoiceId is required"})
			return
		}

		invoiceObjID, err := primitive.ObjectIDFromHex(invoiceIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invoiceId"})
			return
		}

		ctx := c.Request.Context()

		invoiceCol := database.GetCollection(
			ic.Client.Database(ic.DBName),
			"invoices",
		)

		var invoice orderModels.Invoice
		err = invoiceCol.FindOne(ctx, bson.M{
			"_id":             invoiceObjID,
			"customer.userId": userID,
		}).Decode(&invoice)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "invoice not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		filename := fmt.Sprintf("Invoice-%s.pdf", invoice.InvoiceNumber)

		c.Header("Content-Type", "application/pdf")
		c.Header(
			"Content-Disposition",
			fmt.Sprintf(`attachment; filename="%s"`, filename),
		)

		if err := GenerateInvoicePDF(c.Writer, invoice); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to generate invoice PDF",
			})
			return
		}
	}
}

// CREATE PDF
func GenerateInvoicePDF(w io.Writer, invoice orderModels.Invoice) error {

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(15, 15, 15)
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(0, 10, "INVOICE")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 11)
	pdf.Cell(0, 8, fmt.Sprintf("Invoice No: %s", invoice.InvoiceNumber))
	pdf.Ln(6)

	pdf.Cell(0, 8, fmt.Sprintf("Date: %s", invoice.Date.Format("02 Jan 2006")))
	pdf.Ln(10)

	// Seller
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 8, "Seller")
	pdf.Ln(6)

	pdf.SetFont("Arial", "", 11)
	pdf.Cell(0, 6, invoice.Buyer.Name)
	pdf.Ln(5)

	if invoice.Buyer.Company != "" {
		pdf.Cell(0, 6, invoice.Buyer.Company)
		pdf.Ln(5)
	}

	if invoice.Buyer.UdyamNo != "" {
		pdf.Cell(0, 6, "Udyam No: "+invoice.Buyer.UdyamNo)
		pdf.Ln(5)
	}

	pdf.Ln(5)

	// Customer
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 8, "Bill To")
	pdf.Ln(6)

	pdf.SetFont("Arial", "", 11)

	// ✅ FIX 4: Customer struct DOES NOT have Name
	pdf.Cell(0, 6, invoice.Customer.Name)
	pdf.Ln(5)

	pdf.Cell(0, 6, "Phone: "+invoice.Customer.Phone)
	pdf.Ln(5)

	if invoice.Customer.Location.Address != "" {
		pdf.MultiCell(0, 6, "Address: "+invoice.Customer.Location.Address, "", "", false)
	}

	pdf.Ln(8)

	// Items
	pdf.SetFont("Arial", "B", 11)
	pdf.CellFormat(60, 8, "Item", "1", 0, "", false, 0, "")
	pdf.CellFormat(30, 8, "Weight", "1", 0, "", false, 0, "")
	pdf.CellFormat(30, 8, "Rate", "1", 0, "", false, 0, "")
	pdf.CellFormat(30, 8, "Amount", "1", 1, "", false, 0, "")

	pdf.SetFont("Arial", "", 11)

	for _, item := range invoice.Items {
		pdf.CellFormat(60, 8, item.ScrapName, "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 8, fmt.Sprintf("%.2f", item.Weight), "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 8, fmt.Sprintf("₹%.2f", item.Rate), "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 8, fmt.Sprintf("₹%.2f", item.Amount), "1", 1, "", false, 0, "")
	}

	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(120, 8, "Total Amount")
	pdf.Cell(0, 8, fmt.Sprintf("₹%.2f", invoice.TotalAmount))
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 10)
	pdf.Cell(0, 8, "This is a system generated invoice.")
	pdf.Ln(5)
	pdf.Cell(0, 8, "Thank you for using B Tech Kabadiwala.")

	return pdf.Output(w)
}
