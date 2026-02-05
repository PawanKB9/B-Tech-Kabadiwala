"use client";

import { useState, useEffect } from "react";

/* ---------------- TYPES ---------------- */

export type GeneralOrderItem = {
  productId: string;
  scrapName: string;
  measureType: "weight";
  weight: number;
};

type Product = {
  _id: string;
  scrapName: string;
  minWeight?: number;
};

type Props = {
  products: Record<string, Product[]>;
  items: GeneralOrderItem[];
  setItems: React.Dispatch<React.SetStateAction<GeneralOrderItem[]>>;
};

/* ---------------- COMPONENT ---------------- */

export default function GeneralOrder({
  products,
  items,
  setItems,
}: Props) {
  const [weights, setWeights] = useState<Record<string, string>>({});

  /* ---------------- SYNC EXISTING ITEMS → INPUTS ---------------- */
  useEffect(() => {
    const map: Record<string, string> = {};
    items.forEach((i) => {
      map[i.productId] = String(i.weight);
    });
    setWeights(map);
  }, [items]);

  /* ---------------- ADD / UPDATE ITEM ---------------- */

  const addOrUpdateItem = (p: Product) => {
    const raw = weights[p._id];
    const weight = Number(raw);

    if (!weight || weight <= 0) return;

    if (p.minWeight && weight < p.minWeight) {
      alert(`Minimum ${p.minWeight} Kg required`);
      return;
    }

    setItems((prev) => {
      const exists = prev.find((i) => i.productId === p._id);

      if (exists) {
        // UPDATE
        return prev.map((i) =>
          i.productId === p._id ? { ...i, weight } : i
        );
      }

      // ADD
      return [
        ...prev,
        {
          productId: p._id,
          scrapName: p.scrapName,
          measureType: "weight",
          weight,
        },
      ];
    });
  };

  const isAdded = (productId: string) =>
    items.some((i) => i.productId === productId);

  /* ---------------- UI ---------------- */

  return (
    <div className="border text-gray-800 rounded p-4 space-y-4">
      <h2 className="font-semibold">General Order Items</h2>

      {Object.entries(products).map(([category, list]) => (
        <div key={category} className="space-y-2">
          <div className="font-medium text-gray-700">{category}</div>

          {list.map((p) => {
            const added = isAdded(p._id);

            return (
              <div
                key={p._id}
                className="flex gap-2 items-center bg-gray-50 p-2 rounded"
              >
                <span className="flex-1">{p.scrapName}</span>

                <input
                  type="number"
                  step="0.1"
                  placeholder="Kg"
                  value={weights[p._id] || ""}
                  onChange={(e) =>
                    setWeights((w) => ({
                      ...w,
                      [p._id]: e.target.value,
                    }))
                  }
                  className="border p-1 w-24 rounded"
                />

                <button
                  onClick={() => addOrUpdateItem(p)}
                  className={`px-3 py-1 rounded text-white ${
                    added ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {added ? "Update" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
