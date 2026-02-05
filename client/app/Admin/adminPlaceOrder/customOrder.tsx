"use client";

import { useState } from "react";

export type CustomOrderItem = {
  scrapName: string;
  measureType: "piece" | "weight";
  piece?: number;
  weight?: number;
};

export default function CustomOrder({
  items,
  setItems,
}: {
  items: CustomOrderItem[];
  setItems: React.Dispatch<React.SetStateAction<CustomOrderItem[]>>;
}) {
  const [scrapName, setScrapName] = useState("");
  const [measureType, setMeasureType] =
    useState<"piece" | "weight">("piece");
  const [value, setValue] = useState("");

  const addItem = () => {
    const num = Number(value);
    if (!scrapName || !num || num <= 0) return;

    setItems((prev) => [
      ...prev,
      measureType === "piece"
        ? { scrapName, measureType, piece: num }
        : { scrapName, measureType, weight: num },
    ]);

    setScrapName("");
    setValue("");
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <h2 className="font-semibold">Custom Items</h2>

      <input
        placeholder="Scrap name"
        value={scrapName}
        onChange={(e) => setScrapName(e.target.value)}
        className="border p-2 w-full"
      />

      <div className="flex gap-2">
        <label>
          <input
            type="radio"
            checked={measureType === "piece"}
            onChange={() => setMeasureType("piece")}
          />
          Piece
        </label>
        <label>
          <input
            type="radio"
            checked={measureType === "weight"}
            onChange={() => setMeasureType("weight")}
          />
          Weight
        </label>
      </div>

      <input
        type="number"
        placeholder={measureType === "piece" ? "Pieces" : "Kg"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={addItem}
        className="bg-blue-600 text-white py-2 rounded"
      >
        Add Item
      </button>
    </div>
  );
}
