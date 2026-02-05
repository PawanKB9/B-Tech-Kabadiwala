"use client";

import { useState, useEffect, memo, useRef } from "react";
import Image from "next/image";

function ProductCard({
  imgUrl,
  scrapName,
  rate,
  cartWeight,
  minWeight = 1.0,
  isInCart = false,
  onAddToCart,
  onUpdateCart,
}) {
  const [weight, setWeight] = useState(
    cartWeight != null ? String(cartWeight) : ""
  );

  const prevCartWeight = useRef(cartWeight);

  // Sync ONLY when cartWeight actually changes
  useEffect(() => {
    if (
      cartWeight != null &&
      prevCartWeight.current !== cartWeight
    ) {
      setWeight(String(cartWeight));
      prevCartWeight.current = cartWeight;
    }
  }, [cartWeight]);

  const isValid =
    isInCart || (weight !== "" && parseFloat(weight) >= minWeight);

  const handleClick = () => {
    const wt = parseFloat(weight);
    if (!isValid) return;
    isInCart ? onUpdateCart(wt) : onAddToCart(wt);
  };

  return (
    <div className="flex text-gray-800 flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-[175px] max-w-[220px] w-[45vw] sm:w-[240px] flex-shrink-0">

      <div className="relative w-full h-32 sm:h-40 bg-gray-50">
        <Image
          src={imgUrl}
          alt={scrapName}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-2 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold line-clamp-1">
            {scrapName}
          </h2>
          <p className="text-green-600 font-bold text-xs">
            ₹{rate}/Kg
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Min: <span className="font-semibold">{minWeight} Kg</span>
        </p>

        <input
          type="number"
          step="0.2"
          min={minWeight}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Wt. in Kg"
          className="border rounded-md px-2 py-1 text-xs bg-gray-50"
        />

        <button
          onClick={handleClick}
          className={`mt-2 py-1.5 rounded-md text-white text-xs font-semibold transition-all ${
            isValid
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isInCart ? "Update" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);