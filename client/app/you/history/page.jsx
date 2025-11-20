"use client";

import { useState } from "react";
import ScrapItem from "./items";
import { ChevronDown, ChevronUp } from "lucide-react";
import OrderHistory from "./history";
import { sampleProducts } from "../../ComonCode/Data/Materials";

export default function RecordPage() {
  const [hide, setHide] = useState(false);

  // You can maintain local state if needed for delete/update
  const [productList, setProductList] = useState(sampleProducts);

  const orders = [
    { id: "Obj539336id", time: "24 Oct 2025, 2:45 PM" },
    { id: "Obj123456id", time: "23 Oct 2025, 11:10 AM" },
    { id: "Obj123457id", time: "23 Oct 2025, 11:10 AM" },
    { id: "Obj123458id", time: "23 Oct 2025, 11:10 AM" },
    { id: "Obj123459id", time: "23 Oct 2025, 11:10 AM" },
    { id: "Obj998877id", time: "22 Oct 2025, 9:00 AM" },
  ];


  return (
    <main className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col items-center">

        
        {/* SCRAP MATERIAL LIST */}
        <div className="max-w-xl w-full space-y-2 mb-5 duration-200 [@media(min-width:320px)]:px-2">
          <details open className="border-b border-gray-800 pb-2 mb-3">
              <summary className="text-lg px-3 font-semibold text-gray-800 flex items-center justify-between">
                  Total Scraps Sold
                  <button
                  className="cursor-pointer"
                  onClick={(e) => {
                      e.preventDefault();
                      setHide(!hide);
                  }}
                  >
                  {hide ? <ChevronDown /> : <ChevronUp />}
                  </button>
              </summary>
          </details>

          {!hide &&
            productList.map((item) => (
              <ScrapItem
                key={item.id}
                {...item}
              />
            ))}
        </div>

        {/* ORDER HISTORY SECTION */}
        <OrderHistory orders={orders} />
      </div>
    </main>
  );
}
