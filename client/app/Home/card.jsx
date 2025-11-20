"use client";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

const user = {
  _id:"userId",
  userInfo: {},
}


export default function ProductCard({ 
  imgUrl, 
  scrapName, 
  rate, 
  minWeight = 1.0
}) {

  //   { _id: "",imgUrl:"",isActive: true, scrapName: "Copper", category: "Daily Scraps", rate : 13, minWeight : 1.0 },

  const [weight, setWeight] = useState(minWeight);

  const handleIncrease = () => setWeight(prev  => ( prev + 0.2 <= 999999 ? +(prev + 0.2).toFixed(1): prev));
  const handleDecrease = () => setWeight(prev => (prev - 0.2 >= minWeight ? +(prev - 0.2).toFixed(1) : prev));

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-[156px] max-w-[180px] w-[40vw] sm:w-[200px] flex-shrink-0 hover:shadow-md transition-all duration-200">
      
      {/* Image */}
      <div className="relative flex justify-end items-end min-w-[145Px] max-w-[220px] w-full h-24 sm:h-32 bg-gray-50">
        <Image
          src={imgUrl}
          alt={scrapName}
          fill
          // unoptimized // remove in production
          className="object-cover w-full h-24 sm:h-32"
          sizes="(max-width: 640px) 100vw, 180px"
        />
        {/* -- w ++ */}
        <div className="absolute p-1 rounded-lg bg-gray-50 flex items-center gap-1">
          <button
            onClick={handleDecrease}
            className="bg-red-500 text-white rounded-md p-1 hover:bg-red-600"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm text-gray-800 font-semibold">{weight.toFixed(1)}</span>
          <button
            onClick={handleIncrease}
            className="bg-green-500 text-white rounded-md p-1 hover:bg-green-600"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>


      {/* Content */}
      <div className="p-2 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">{scrapName}</h2>
          <p className="text-green-600 font-bold sm:text-sm text-xs">₹{rate}/Kg</p>
        </div>

        <p className="text-xs sm:text-sm text-gray-500">
          Min: <span className="font-semibold text-gray-700"> {minWeight} Kg</span>
        </p>

        {/* Weight Control */}
        <div className="text-gray-800 font-semibold flex justify-between items-center mt-1.5">
          <input
            type="number"
            step="0.2"
            min={minWeight}
            max={999999}
            value={weight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
                setWeight(val);
            }}
            className="border rounded-md text-gray-800 px-1 py-0.5 text-xs sm:text-sm text-center bg-gray-50 font-medium focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <p>
            Kg
          </p>
        </div>
      </div>
    </div>
  );
}
