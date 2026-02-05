package appData

import (
	appModels "github.com/PawanKB9/BTechKabadiwala/internal/appCatalog/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var SamplePlastic = []appModels.Product{
	{
		ID:          mustObjectID("692d896dbc4f16c1dd0ffe71"),
		IsActive:    true,
		Rate:        20.0,
		MinWeight:   2.0,
		MinPiece:    0,
		ScrapName:   "Mixed Plastic",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
		Category:    "Daily Scraps",
		Description: "Used PET bottles from beverages and household products suitable for recycling.",
	},
	{
		ID:          mustObjectID("692d8a50bc4f16c1dd0ffe72"),
		IsActive:    true,
		Rate:        20.0,
		MinWeight:   2.0,
		MinPiece:    0,
		ScrapName:   "Plastic Bottles",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
		Category:    "Daily Scraps",
		Description: "Used PET bottles from beverages and household products suitable for recycling.",
	},
	{
		ID:          mustObjectID("692d8addbc4f16c1dd0ffe73"),
		IsActive:    true,
		Rate:        25.5,
		MinWeight:   5.0,
		MinPiece:    0,
		ScrapName:   "Plastic Pipes",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762959108/plastic-pipes-cables-or-hoses-pile-on-green-grass-outdoors-background-blur-free-photo_cprs9o.webp",
		Category:    "Daily Scraps",
		Description: "HDPE and PVC pipes used in irrigation and plumbing with high resale value.",
	},
	{
		ID:          mustObjectID("692d8b11bc4f16c1dd0ffe74"),
		IsActive:    true,
		Rate:        16.0,
		MinWeight:   3.0,
		MinPiece:    0,
		ScrapName:   "Plastic Sheets",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762959108/plastic-carry-bags-125x125_w7vafz.webp",
		Category:    "Daily Scraps",
		Description: "Discarded plastic packaging sheets, wrapping films, and covers.",
	},
	{
		ID:          mustObjectID("692d8b55bc4f16c1dd0ffe75"),
		IsActive:    true,
		Rate:        22.0,
		MinWeight:   2.5,
		MinPiece:    0,
		ScrapName:   "Plastic Containers",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762959108/hdpe-round-with-handle-bottle-500x500_j7jltu.webp",
		Category:    "Daily Scraps",
		Description: "Thick HDPE containers, buckets, and tubs used in households or industries.",
	},
}

var SampleDaily = []appModels.Product{
	{
		ID:          mustObjectID("692d8b97bc4f16c1dd0ffe76"),
		IsActive:    true,
		Rate:        20.0,
		MinWeight:   2.0,
		MinPiece:    0,
		ScrapName:   "Mixed Plastic",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
		Category:    "Daily Scraps",
		Description: "Used PET bottles from beverages and household products suitable for recycling.",
	},
	{
		ID:          mustObjectID("692d8bdfbc4f16c1dd0ffe77"),
		IsActive:    true,
		Rate:        45.0,
		MinWeight:   5.0,
		MinPiece:    0,
		ScrapName:   "Iron",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953861/pexels-padrinan-114108_kzn8vs.jpg",
		Category:    "Daily Scraps",
		Description: "Scrap iron and steel materials from construction or household waste.",
	},
	{
		ID:          mustObjectID("692d8c3fbc4f16c1dd0ffe78"),
		IsActive:    true,
		Rate:        12.0,
		MinWeight:   3.0,
		MinPiece:    0,
		ScrapName:   "Carton",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953864/71Vfw_VxYTL_ahwdbq.webp",
		Category:    "Daily Scraps",
		Description: "Used cardboard boxes and packaging cartons.",
	},
	{
		ID:          mustObjectID("692d8c81bc4f16c1dd0ffe79"),
		IsActive:    true,
		Rate:        20.0,
		MinWeight:   2.5,
		MinPiece:    0,
		ScrapName:   "Raddi-News Paper",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/newspaper-bundle_n8ijjn.webp",
		Category:    "Daily Scraps",
		Description: "Old newspapers and magazines for recycling.",
	},
	{
		ID:          mustObjectID("692d8cd2bc4f16c1dd0ffe7a"),
		IsActive:    true,
		Rate:        15.0,
		MinWeight:   2.0,
		MinPiece:    0,
		ScrapName:   "Paper",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953870/pexels-towfiqu-barbhuiya-3440682-9852063_dg36ut.jpg",
		Category:    "Daily Scraps",
		Description: "Mixed paper waste including notebooks, sheets, and files.",
	},
	{
		ID:          mustObjectID("692d8d07bc4f16c1dd0ffe7b"),
		IsActive:    true,
		Rate:        520.0,
		MinWeight:   1.0,
		MinPiece:    0,
		ScrapName:   "Copper",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953859/depositphotos_664372172-stock-photo-scrap-copper-wire-cable-line_yretyn.webp",
		Category:    "Daily Scraps",
		Description: "High-value copper wires and components from electronic waste.",
	},
	{
		ID:          mustObjectID("692d7f8cbc4f16c1dd0ffe65"),
		IsActive:    true,
		Rate:        120.0,
		MinWeight:   1.5,
		MinPiece:    0,
		ScrapName:   "Aluminium",
		ImgUrl:      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953861/pexels-mabelamber-13726775_dc19et.jpg",
		Category:    "Daily Scraps",
		Description: "Used aluminium cans, utensils, and metal parts.",
	},
}

var SampleProducts = map[string][]appModels.Product{
	"Plastic Scraps": SamplePlastic,
	"Daily Scraps":   SampleDaily,
}

func mustObjectID(hex string) primitive.ObjectID {
	id, err := primitive.ObjectIDFromHex(hex)
	if err != nil {
		panic("invalid ObjectID in sample data: " + hex)
	}
	return id
}
