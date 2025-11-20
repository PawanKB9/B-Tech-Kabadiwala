package appModels

import (
	"time"
)

// Poster represents a single promotional poster/banner.
type Poster struct {
	Msg    string `bson:"msg,omitempty" json:"msg,omitempty"`
	ImgURL string `bson:"imgUrl,omitempty" json:"imgUrl,omitempty"`
}

// Article represents a blog or informational section.
type Article struct {
	Title   string   `bson:"title" json:"title"`
	Content []string `bson:"content" json:"content"` // Multiple paragraphs or bullet points
}

// Batch represents a category or featured scrap group.
type Batch struct {
	Name   string `bson:"name" json:"name"`
	ImgURL string `bson:"imgUrl,omitempty" json:"imgUrl,omitempty"`
}

type Help struct {
	Phone    string `bson:"phone,omitempty" json:"phone,omitempty"`
	Email    string `bson:"email,omitempty" json:"email,omitempty"`
	Whatsapp string `bson:"whatsapp,omitempty" json:"whatsapp,omitempty"`
}

// AppData holds all global content and settings for the app.
type AppData struct {
	Offer          string   `bson:"offer,omitempty" json:"offer,omitempty"`                     // App-wide offer message
	Posters        []Poster `bson:"posters,omitempty" json:"posters,omitempty"`                 // Promotional posters
	AutoplayBanner []string `bson:"autoplayBanner,omitempty" json:"autoplayBanner,omitempty"`   // Banner image URLs
	Articles       []Article `bson:"articles,omitempty" json:"articles,omitempty"`              // Informational articles
	HelpLine       Help     `bson:"helpLine,omitempty" json:"helpLine,omitempty"`
	Batches        []Batch  `bson:"batches,omitempty" json:"batches,omitempty"`                 // Featured scrap types or groups
	AboutUs        string   `bson:"aboutUs,omitempty" json:"aboutUs,omitempty"`                 // About the company/app
	PolicyTerms    string   `bson:"policyTerms,omitempty" json:"policyTerms,omitempty"`         // Terms & conditions / privacy policy
	CreatedAt      time.Time `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt      time.Time `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
