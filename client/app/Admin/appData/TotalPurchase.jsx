"use client";

import { useState } from "react";

export default function WeightTable() {
  // Dummy purchased data (replace with backend data)
  const [purchased, setPurchased] = useState([
    {
      scrapName: "Iron",
      category: "Daily Scraps",
      quantity: 120,
      unit: "Kg",
      totalAmount: 5400,
    },
    {
      scrapName: "Plastic Bottles",
      category: "Plastic Scraps",
      quantity: 85,
      unit: "Kg",
      totalAmount: 1700,
    },
    {
      scrapName: "Tin Cans",
      category: "Metal Scraps",
      quantity: 40,
      unit: "pcs",
      totalAmount: 600,
    },
    {
      scrapName: "Zinc Sheets",
      category: "Metal Scraps",
      quantity: 62,
      unit: "Kg",
      totalAmount: 2480,
    },
  ]);

  return (
    <div className="bg-orange-50 text-gray-800 mt-6 mb-20 p-4 md:p-8 rounded shadow max-w-4xl mx-auto border border-orange-200">
      <h2 className="text-amber-700 font-medium mb-4 text-sm md:text-base">
        Below is the summary of total scrap purchased.
      </h2>
      <h3>Dummy purchased data (replace with backend data)</h3>

      {/* Header */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-4 font-semibold text-white bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 rounded px-3 py-2 mb-2 text-xs md:text-sm">
        <div>Scrap Name</div>
        <div>Category</div>
        <div>Qty</div>
        <div>Total Amount (₹)</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {purchased.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 md:grid-cols-5 gap-4 items-center px-3 py-2 bg-white rounded border border-orange-200 hover:bg-orange-50 transition text-sm"
          >
            {/* Scrap Name */}
            <div className="text-red-700 font-medium">{item.scrapName}</div>

            {/* Category */}
            <div className="text-amber-700">{item.category}</div>

            {/* Quantity + Unit */}
            <div className="text-amber-600 font-medium">
              {item.quantity} {item.unit}
            </div>

            {/* Total Amount */}
            <div className="font-bold text-green-700">
              ₹{item.totalAmount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

