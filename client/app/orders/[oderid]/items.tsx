"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Minus, X } from "lucide-react";

interface ScrapItemProps {
  id: string;
  name: string;
  image: string;
  rate: number;
  weight: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newWeight: number) => void;
}

export default function ScrapItem({
  id,
  name,
  image,
  rate,
  weight,
  onDelete,
  onUpdate,
}: ScrapItemProps) {
  const handleIncrease = () => onUpdate(id, weight + 0.1);
  const handleDecrease = () => onUpdate(id, Math.max(0, weight - 0.1)); // flex flex-col

  return (
    <div className="w-full flex items-center justify-between border rounded-2xl py-1 mb-2  bg-white shadow-sm">
        <div className="flex justify-between gap-1.5 [@media(min-width:320px)]:gap-5 sm:gap-10">
          <div className="relative w-14 h-14 min-w-12 min-h-12">
            <Image src={image} alt={name} fill className="object-contain rounded-md" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
            <p className="text-xs text-gray-500">{rate} * {weight.toFixed(1)}</p>
          </div>
        </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="p-1 border rounded-full text-red-600 border-red-600 hover:bg-red-50"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-semibold text-gray-800">{weight.toFixed(1)}</span>
        <button
          onClick={handleIncrease}
          className="p-1 border rounded-full text-green-600 border-green-600 hover:bg-green-50"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1 text-red-500 hover:text-red-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
