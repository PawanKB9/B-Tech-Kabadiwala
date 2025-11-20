"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import ProductCard from "./card";
import ElectronicsWasteCard from "./eScrapCard";
import { sampleProducts } from "../ComonCode/Data/Materials";
import { electronicsWasteItems } from "../ComonCode/Data/Materials";

// ---- Types ----
type DailyProduct = {
  _id: string;
  imgUrl: string;
  scrapName: string;
  rate: number;
  category: string;
  isActive: boolean;
  minWeight: number;
};

type ElectronicProduct = {
  _id: string;
  imgUrl: string;
  scrapName: string;
  category: string;
  isActive: boolean;
  description: string;
  items: string[];
};

// Combined Type
type ProductType = DailyProduct | ElectronicProduct;

// Combine all categories
const ALL_ITEMS: ProductType[] = [...sampleProducts, ...electronicsWasteItems];

export default function SearchScrap() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<ProductType[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
      return;
    }

    const lower = value.toLowerCase();

    const results = ALL_ITEMS.filter((item: ProductType) => {
      const mainMatch = item.scrapName.toLowerCase().includes(lower);

      // ------------------------------
      // SPECIAL SEARCH FOR ELECTRONICS
      // ------------------------------
      const itemsMatch =
        "items" in item &&
        item.items.some((sub) => sub.toLowerCase().includes(lower));

      return mainMatch || itemsMatch;
    });

    setFiltered(results);
  };

  const clearSearch = () => {
    setQuery("");
    setFiltered([]);
  };

  return (
    <div className="flex flex-col px-4 sm:px-12 items-center">
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-3xl bg-green-100 border border-green-300 rounded-lg px-3 py-2 shadow-sm">
        <Search className="text-green-900 w-5 h-5 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search your scrap material"
          className="flex-1 bg-transparent outline-none text-green-900 placeholder-green-900/70 px-2"
        />
        {query && (
          <button onClick={clearSearch}>
            <X className="text-green-900 w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {query && (
        <section className="w-full px-3 py-3">
          <h2 className="text-lg font-bold mb-3 text-gray-800">{query}</h2>

          <div className="flex gap-4 sm:gap-6 justify-start overflow-x-auto scrollbar-hide transition-all duration-300">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div key={item._id} className="flex-shrink-0">
                  {/* Render different cards based on category */}
                  {item.category === "Electronics Waste" ? (
                    <ElectronicsWasteCard
                      scrapName={item.scrapName}
                      imgUrl={item.imgUrl}
                      items={item.items}
                    />
                  ) : (
                    <ProductCard
                      scrapName={item.scrapName}
                      rate={"rate" in item ? item.rate : 0}
                      imgUrl={item.imgUrl}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No matching materials found.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
