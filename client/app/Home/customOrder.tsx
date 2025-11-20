"use client";

import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

export default function CustomOrderAccordion() {
  const [open, setOpen] = useState(false);

  const [scrapName, setScrapName] = useState("");
  const [category, setCategory] = useState("");

  const [orderType, setOrderType] = useState<"piece" | "weight">("piece");
  const [pieces, setPieces] = useState(1);
  const [weight, setWeight] = useState("");

  const increasePieces = () =>
  setPieces((prev) => {
    const num = Number(prev);
    return isNaN(num) || num < 1 ? 1 : num + 1;
  });

  const decreasePieces = () =>
    setPieces((prev) => (prev > 1 ? prev - 1 : 1));

  const handlePiecesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // const value = e.target.value
    setPieces(value);
  };

  const handleSubmit = () => {
    const payload =
      orderType === "piece"
        ? { scrapName, category, orderType, pieces }
        : { scrapName, category, orderType, weight };

    console.log("Custom order placed:", payload);
    alert("Your custom order has been submitted!");
  };

  return (
    <div className="w-full max-w-3xl px-2 mx-auto mt-4">
      {/* Accordion Header */}
      <button
        className="w-full flex items-center justify-between bg-green-600 text-white px-4 py-3 rounded-lg shadow-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-lg font-semibold">Place Custom Scrap Order</span>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-300 border border-gray-300 rounded-b-lg bg-white ${
          open ? "max-h-[1000px] p-5" : "max-h-0 p-0"
        }`}
      >
        {open && (
          <div className="flex flex-col gap-4">

            {/* Scrap Name */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Scrap Name
              </label>
              <input
                type="text"
                value={scrapName}
                onChange={(e) => setScrapName(e.target.value)}
                placeholder="Enter scrap name"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Order Type */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Order Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderType("piece")}
                  className={`flex-1 py-2 rounded-lg border text-center ${
                    orderType === "piece"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 text-gray-700 border-gray-400"
                  }`}
                >
                  By Piece
                </button>

                <button
                  onClick={() => setOrderType("weight")}
                  className={`flex-1 py-2 rounded-lg border text-center ${
                    orderType === "weight"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 text-gray-700 border-gray-400"
                  }`}
                >
                  By Weight
                </button>
              </div>
            </div>

            {/* PIECES INPUT SECTION */}
            {orderType === "piece" && (
              <div className="flex text-gray-800 items-center justify-between border border-gray-400 rounded-lg px-3 py-3">
                {/* Minus Button */}
                <button
                  onClick={decreasePieces}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>

                {/* Number Input */}
                <input
                  type="number"
                  value={pieces}
                  onChange={handlePiecesInput}
                  min={1}
                  className="w-20 max-w-[50%] flex-1 text-center border border-gray-300 rounded-lg py-1 text-lg font-semibold  
                  focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p>Pice</p>

                {/* Plus Button */}
                <button
                  onClick={increasePieces}
                  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* WEIGHT INPUT */}
            {orderType === "weight" && (
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight in kg"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-gray-800 
                  focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
            >
              Submit Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
