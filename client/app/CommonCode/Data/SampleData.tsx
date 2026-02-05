export type Product = {
  _id: string
  isActive: boolean
  rate: number
  minWeight: number
  minPiece: number
  scrapName: string
  imgUrl: string
  category: string
  description: string
}

export const SamplePlastic: Product[] = [
  {
    _id: "692d896dbc4f16c1dd0ffe71",
    isActive: true,
    rate: 20.0,
    minWeight: 2.0,
    minPiece: 0,
    scrapName: "Mixed Plastic",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
    category: "Daily Scraps",
    description:
      "Used PET bottles from beverages and household products suitable for recycling.",
  },
  {
    _id: "692d8a50bc4f16c1dd0ffe72",
    isActive: true,
    rate: 20.0,
    minWeight: 2.0,
    minPiece: 0,
    scrapName: "Plastic Bottles",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
    category: "Daily Scraps",
    description:
      "Used PET bottles from beverages and household products suitable for recycling.",
  },
  {
    _id: "692d8addbc4f16c1dd0ffe73",
    isActive: true,
    rate: 25.5,
    minWeight: 5.0,
    minPiece: 0,
    scrapName: "Plastic Pipes",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762959108/plastic-pipes-cables-or-hoses-pile-on-green-grass-outdoors-background-blur-free-photo_cprs9o.webp",
    category: "Daily Scraps",
    description:
      "HDPE and PVC pipes used in irrigation and plumbing with high resale value.",
  },
  {
    _id: "692d8b11bc4f16c1dd0ffe74",
    isActive: true,
    rate: 16.0,
    minWeight: 3.0,
    minPiece: 0,
    scrapName: "Plastic Sheets",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762959108/plastic-carry-bags-125x125_w7vafz.webp",
    category: "Daily Scraps",
    description:
      "Discarded plastic packaging sheets, wrapping films, and covers.",
  },
  {
    _id: "692d8b55bc4f16c1dd0ffe75",
    isActive: true,
    rate: 22.0,
    minWeight: 2.5,
    minPiece: 0,
    scrapName: "Plastic Containers",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762959108/hdpe-round-with-handle-bottle-500x500_j7jltu.webp",
    category: "Daily Scraps",
    description:
      "Thick HDPE containers, buckets, and tubs used in households or industries.",
  },
]

export const SampleDaily: Product[] = [
  {
    _id: "692d8b97bc4f16c1dd0ffe76",
    isActive: true,
    rate: 20.0,
    minWeight: 2.0,
    minPiece: 0,
    scrapName: "Mixed Plastic",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/pexels-mart-production-7767614_qksb4o.jpg",
    category: "Daily Scraps",
    description:
      "Used PET bottles from beverages and household products suitable for recycling.",
  },
  {
    _id: "692d8bdfbc4f16c1dd0ffe77",
    isActive: true,
    rate: 45.0,
    minWeight: 5.0,
    minPiece: 0,
    scrapName: "Iron",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953861/pexels-padrinan-114108_kzn8vs.jpg",
    category: "Daily Scraps",
    description:
      "Scrap iron and steel materials from construction or household waste.",
  },
  {
    _id: "692d8c3fbc4f16c1dd0ffe78",
    isActive: true,
    rate: 12.0,
    minWeight: 3.0,
    minPiece: 0,
    scrapName: "Carton",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953864/71Vfw_VxYTL_ahwdbq.webp",
    category: "Daily Scraps",
    description: "Used cardboard boxes and packaging cartons.",
  },
  {
    _id: "692d8c81bc4f16c1dd0ffe79",
    isActive: true,
    rate: 20.0,
    minWeight: 2.5,
    minPiece: 0,
    scrapName: "Raddi-News Paper",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953862/newspaper-bundle_n8ijjn.webp",
    category: "Daily Scraps",
    description: "Old newspapers and magazines for recycling.",
  },
  {
    _id: "692d8cd2bc4f16c1dd0ffe7a",
    isActive: true,
    rate: 15.0,
    minWeight: 2.0,
    minPiece: 0,
    scrapName: "Paper",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953870/pexels-towfiqu-barbhuiya-3440682-9852063_dg36ut.jpg",
    category: "Daily Scraps",
    description:
      "Mixed paper waste including notebooks, sheets, and files.",
  },
  {
    _id: "692d8d07bc4f16c1dd0ffe7b",
    isActive: true,
    rate: 520.0,
    minWeight: 1.0,
    minPiece: 0,
    scrapName: "Copper",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953859/depositphotos_664372172-stock-photo-scrap-copper-wire-cable-line_yretyn.webp",
    category: "Daily Scraps",
    description:
      "High-value copper wires and components from electronic waste.",
  },
  {
    _id: "692d7f8cbc4f16c1dd0ffe65",
    isActive: true,
    rate: 120.0,
    minWeight: 1.5,
    minPiece: 0,
    scrapName: "Aluminium",
    imgUrl:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1762953861/pexels-mabelamber-13726775_dc19et.jpg",
    category: "Daily Scraps",
    description:
      "Used aluminium cans, utensils, and metal parts.",
  },
]

export const SampleProducts: Record<string, Product[]> = {
  "Plastic Scraps": SamplePlastic,
  "Daily Scraps": SampleDaily,
} 
