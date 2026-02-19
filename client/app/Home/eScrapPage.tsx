"use client";

import ElectronicsWasteCard from "./eScrapCard";
import { electronicsWasteItems } from "../CommonCode/Data/SampleData";

// cart items sample (same logic as daily scraps)
const cartItems = [
  {
    productId: "Elect01Mobiles",
    quantities: [1, 2, 0, 1], // example
  },
  {
    productId: "Elect04Printers",
    quantities: [0, 1, 0],
  },
];

export default function ElectronicsWasteSection() {
  // Filter only category === "Electronics Waste"
  const electronicsProducts = electronicsWasteItems.filter(
    (item) => item.category === "Electronics Waste"
  );

  if (!electronicsProducts.length) {
    return (
      <section className="w-full px-3 py-3">
        <h2 className="text-lg font-bold mb-3 text-gray-800">Electronics Waste</h2>
        <p className="text-gray-500 text-sm">No electronic items available right now.</p>
      </section>
    );
  }

  return (
    <section className="w-full px-3 py-3">
      {/* Header */}
      <h2 className="text-lg font-bold mb-3 text-gray-800">
        {electronicsProducts[0].category} <span className="text-red-600">{ " - Coming Soon!"}</span>
      </h2>

      {/* Horizontal scroll list */}
      <div className="flex gap-4 sm:gap-6 justify-start overflow-x-auto scrollbar-hide transition-all duration-300">
        {electronicsProducts.map((item) => (
          <div key={item._id} className="flex-shrink-0">
            {item.isActive ? (
              <ElectronicsWasteCard
                imgUrl={item.imgUrl}
                scrapName={item.scrapName}
                items={item.items}
              />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
