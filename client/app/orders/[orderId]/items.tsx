"use client";

import ImageWithFallback from "@/app/CommonCode/UiCode/avatarImg";
import { useState, useEffect } from "react";

type ScrapItemProps = {
  id: string;
  name: string;
  image?: string;
  rate: number;
  weight: number;
  price: number;
  minWeight?: number;
  disabled?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newWeight: number) => void;
};

export default function ScrapItem({
  id,
  name,
  image,
  rate,
  weight,
  price,
  minWeight,
  disabled = false,
  onDelete,
  onUpdate,
}: ScrapItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempWeight, setTempWeight] = useState(String(weight));

  useEffect(() => {
    setTempWeight(String(weight));
  }, [weight]);

  const handleSave = () => {
    if (disabled) return;

    const parsed = Number(tempWeight);
    if (Number.isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    if (minWeight && parsed < minWeight) {
      alert(`Minimum allowed amount is ${minWeight} kg.`);
      return;
    }

    const newVal = Math.round(parsed * 1000) / 1000;
    onUpdate(id, newVal);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempWeight(String(weight));
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between border rounded-xl p-2 shadow-sm bg-zinc-50">
      {/* LEFT */}
      <div className="flex gap-3 items-center">
        <ImageWithFallback
          image={image}
          name={name}
          width={75}
          height={75}
          className="rounded-lg object-cover shadow"
        />

        <div>
          <p className="font-bold text-lg">{name}</p>
          <p className="text-sm text-gray-500">
            Rate: <span className="font-medium text-blue-600">₹{rate.toFixed(2)}</span>/kg
          </p>
          {minWeight && (
            <p className="text-xs text-red-500">Min: {minWeight} kg</p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">
        {!isEditing ? (
          <div className="text-xl font-bold text-green-700">
            {weight} <span className="text-sm text-gray-600">kg</span>
          </div>
        ) : (
          <input
            type="number"
            step="0.1"
            min={minWeight ?? 0}
            value={tempWeight}
            onChange={(e) => setTempWeight(e.target.value)}
            disabled={disabled}
            className="border rounded px-2 py-1 w-28"
          />
        )}

        <div className="font-bold">₹{price.toFixed(2)}</div>

        {!disabled && <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={disabled}
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"}
                `}
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => !disabled && setIsEditing(true)}
                disabled={disabled}
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${disabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"}
                `}
              >
                Edit
              </button>

              <button
                onClick={() => !disabled && onDelete(id)}
                disabled={disabled}
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${disabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-600 hover:bg-red-100"}
                `}
              >
                Delete
              </button>
            </>
          )}
        </div>}
      </div>
    </div>
  );
}
