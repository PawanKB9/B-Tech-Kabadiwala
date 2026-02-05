package appModels

import (
	"time"
)

// Poster represents a single promotional poster/banner.
type Poster struct {
	l1    string `bson:"msg,omitempty" json:"msg,omitempty"`
	l2    string `bson:"msg,omitempty" json:"msg,omitempty"`
	ImgUrl string `bson:"imgUrl,omitempty" json:"imgUrl,omitempty"`
}

// Article represents a blog or informational section.
type Article struct {
	Title   string   `bson:"title" json:"title"`
	Content []string `bson:"content" json:"content"` // Multiple paragraphs or bullet points
}

// Batch represents a category or featured scrap group.
type Batch struct {
	Name   string `bson:"name" json:"name"`
	ImgUrl string `bson:"imgUrl, omitempty" json:"imgUrl,omitempty"`
}

type Help struct {
	Phone    string `bson:"phone,omitempty" json:"phone,omitempty"`
	Email    string `bson:"email,omitempty" json:"email,omitempty"`
	Whatsapp string `bson:"whatsapp,omitempty" json:"whatsapp,omitempty"`
}

// Privacy Policy
type PolicyTerms struct {
    Introduction     string `bson:"introduction,omitempty" json:"introduction,omitempty"`
    Privacy          string `bson:"privacy,omitempty" json:"privacy,omitempty"`
    Terms            string `bson:"terms,omitempty" json:"terms,omitempty"`
    FairWeight       string `bson:"fairWeight,omitempty" json:"fairWeight,omitempty"`
    UserResponsibility string `bson:"userResponsibility,omitempty" json:"userResponsibility,omitempty"`
    Refund           string `bson:"refund,omitempty" json:"refund,omitempty"`
    UserAgreement    string `bson:"userAgreement,omitempty" json:"userAgreement,omitempty"`
}


// Detailed company info
type CompanyInfo struct {
    Url           string `bson:"url,omitempty" json:"url,omitempty"`
    FounderName   string `bson:"name,omitempty" json:"name,omitempty"`
    Company       string `bson:"company,omitempty" json:"company,omitempty"`
    Address       string `bson:"address,omitempty" json:"address,omitempty"`
    Email         string `bson:"email,omitempty" json:"email,omitempty"`
    Linkedin      string `bson:"linkedin,omitempty" json:"linkedin,omitempty"`
}

// AboutUs section
type AboutUs struct {
    Introduction    string      `bson:"introduction,omitempty" json:"introduction,omitempty"`
    OurVision       string      `bson:"ourVision,omitempty" json:"ourVision,omitempty"`
    SmartPickup     string      `bson:"smartPickup,omitempty" json:"smartPickup,omitempty"`
    Sustainability  string      `bson:"sustainability,omitempty" json:"sustainability,omitempty"`
    CommunityImpact string      `bson:"communityImpact,omitempty" json:"communityImpact,omitempty"`
    Info            CompanyInfo `bson:"info,omitempty" json:"info,omitempty"`
}

// AppData holds all global content and settings for the app.
type AppData struct {
    Offer          string       `bson:"offer,omitempty" json:"offer,omitempty"`
    Posters        []Poster     `bson:"posters,omitempty" json:"posters,omitempty"`
    AutoplayBanner []string     `bson:"autoplayBanner,omitempty" json:"autoplayBanner,omitempty"`
    Articles       []Article    `bson:"articles,omitempty" json:"articles,omitempty"`
    HelpLine       Help         `bson:"helpLine,omitempty" json:"helpLine,omitempty"`
    Batches        []Batch      `bson:"batches,omitempty" json:"batches,omitempty"`
    AboutUs        AboutUs      `bson:"aboutUs,omitempty" json:"aboutUs,omitempty"`
    PolicyTerms    PolicyTerms  `bson:"policyTerms,omitempty" json:"policyTerms,omitempty"`
    CreatedAt      time.Time    `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
    UpdatedAt      time.Time    `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

