"use client";

import GlobalLoader from "@/app/CommonCode/UiCode/GlobalLoader";
// import ScrapItem from "./items";
// import { ChevronDown, ChevronUp } from "lucide-react";
import OrderHistory from "./history";
import { useGetOrderHistoryQuery } from "@/app/RTK Query/orderApi";

export default function RecordPage() {
  /**
   * Fetch order history
   * Cached & reused automatically by RTK Query
   */
  const { data, isLoading, isError } =
    useGetOrderHistoryQuery({ page: 1, limit: 10 });

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <main className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 flex items-center justify-center">
        <p className="text-gray-600">Loading order history…</p>
        <GlobalLoader isLoading={isLoading} />;
      </main>
    );
  }

  // ---------- Error ----------
  if (isError || !data) {
    return (
      <main className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 flex items-center justify-center">
        <p className="text-red-500">Failed to load order history.</p>
      </main>
    );
  }

  const orders = data.orders.map((order) => ({
    ...order,
    createdAt: order.createdAt,
  }));

  return (
    <main className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col items-center">

        <OrderHistory orders={orders} />
      </div>
    </main>
  );
}

        // {/* SCRAP MATERIAL LIST  */}
        // {/* <div className="max-w-xl w-full space-y-2 mb-5 duration-200 [@media(min-width:320px)]:px-2">
        //   <details open className="border-b border-gray-800 pb-2 mb-3">
        //       <summary className="text-lg px-3 font-semibold text-gray-800 flex items-center justify-between">
        //           Total Scraps Sold
        //           <button
        //           className="cursor-pointer"
        //           onClick={(e) => {
        //               e.preventDefault();
        //               setHide(!hide);
        //           }}
        //           >
        //           {hide ? <ChevronDown /> : <ChevronUp />}
        //           </button>
        //       </summary>
        //   </details>

        //   {!hide &&
        //     productList.map((item) => (
        //       <ScrapItem
        //         key={item._id}
        //         {...item}
        //       />
        //     ))}
        // </div> */}
