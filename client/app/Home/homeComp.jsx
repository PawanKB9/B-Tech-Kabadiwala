"use client";
import ProductCard from "./card";
import { sampleProducts } from "../ComonCode/Data/Materials";


//Later it wil be get old cart items, and update within : reflect that into this
const cartItems = [
  {
    productId: "Obj099PlasticBottles",
    weight: 5.2,
  },
  {
    productId: "Obj097Carton",
    weight: 13.2,
  }
];
export default function DailyScrapsSection() {
  // Filter products by category "Daily Scraps"
  const dailyScrapProducts = sampleProducts.filter(
    (item) => item.category === "Daily Scraps"
  );

  // If no products found, handle gracefully
  if (!dailyScrapProducts.length) {
    return (
      <section className="w-full px-3 py-3">
        <h2 className="text-lg font-bold mb-3 text-gray-800">Daily Scraps</h2>
        <p className="text-gray-500 text-sm">No items available right now.</p>
      </section>
    );
  }

  return (
    <section className="w-full px-3 py-3">
      {/* Header */}
      <h2 className="text-lg font-bold mb-3 text-gray-800">
        {dailyScrapProducts[0].category}
      </h2>

      {/* Product List */}
      <div className="flex gap-4 sm:gap-6 justify-start overflow-x-auto scrollbar-hide transition-all duration-300">
        {dailyScrapProducts.map((item) => (
          <div key={item._id} className="flex-shrink-0">
            {item.isActive ?  <ProductCard {...item} /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}


// const category = "Daily Scraps";
// const products = [
//   { img_url:'depositphotos_664372172-stock-photo-scrap-copper-wire-cable-line.jpg', name: "Copper", rate : 13, min_weight : 1.0 },
//   { img_url:'360_F_394273452_vyreTEqX9HTBoIadnZQPQejwm3Y1YYfK.jpg', name: "Aluminium", rate : 13, min_weight : 1.0 },
//   { img_url:'plastic.jpg',name: 'Plastic', rate : 13, min_weight : 1.0 },
//   { img_url:'plastic.jpg',name: 'Plastic', rate : 13, min_weight : 1.0 },
//   { img_url:'plastic.jpg',name: 'Plastic', rate : 13, min_weight : 1.0 },
//   { img_url:'newspaper-bundle.jpg', name: "Old Newspaper", rate : 13, min_weight : 1.0 }
// ];