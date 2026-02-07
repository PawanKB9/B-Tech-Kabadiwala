"use client";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

interface ElectronicsWasteCardProps {
  imgUrl: string;
  scrapName: string;
  items: string[];
}

export default function ElectronicsWasteCard({
  imgUrl,
  scrapName,
  items = [],
}: ElectronicsWasteCardProps) {
  
  const [quantities, setQuantities] = useState<number[]>(
    items.map(() => 0)
  );

  const handleIncrease = (index: number) => {
    setQuantities((prev) => {
      const updated = [...prev];
      updated[index] = updated[index] + 1;
      return updated;
    });
  };

  const handleDecrease = (index: number) => {
    setQuantities((prev) => {
      const updated = [...prev];
      updated[index] = updated[index] > 0 ? updated[index] - 1 : 0;
      return updated;
    });
  };

  const handleInputChange = (index: number, val: string) => {
    const num = Number(val);
    setQuantities((prev) => {
      const updated = [...prev];
      updated[index] = num >= 0 ? num : 0;
      return updated;
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-[180px] max-w-[250px] w-[45vw] sm:w-[240px] hover:shadow-md transition-all duration-200">

      {/* Image */}
      <div className="relative w-full h-28 sm:h-36 bg-gray-50">
        <Image
          src={imgUrl}
          alt={scrapName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 240px"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <h2 className="text-sm sm:text-[15px] font-semibold text-gray-800 line-clamp-2">
          {scrapName}
        </h2>

        {/* Items List */}
        <div className="flex flex-col gap-3 mt-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200"
            >
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {item}
              </p>

              <div className="flex items-center justify-between">

                <input
                  type="number"
                  min={0}
                  value={quantities[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="border rounded-md text-gray-800 px-2 py-1 text-xs w-16 text-center bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                />

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDecrease(index)}
                    className="bg-red-500 text-white rounded-md p-1 hover:bg-red-600"
                  >
                    <Minus size={12} />
                  </button>

                  <button
                    onClick={() => handleIncrease(index)}
                    className="bg-green-500 text-white rounded-md p-1 hover:bg-green-600"
                  >
                    <Plus size={12} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
