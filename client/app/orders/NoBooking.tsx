"use client";

import { PackageSearch } from "lucide-react";

export default function NoCurrentOrder() {
  return (
    <section className="min-h-screen flex flex-col py-24 items-center bg-stone-100">
      <div className="text-center border border-gray-100 shadow-md rounded-3xl p-8 max-w-sm w-full">
        <div className="bg-green-50 p-6 rounded-full mx-auto w-fit mb-4">
          <PackageSearch className="h-20 w-20 text-green-600" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">
          No Current Order
        </h2>
      </div>
    </section>
  );
}
