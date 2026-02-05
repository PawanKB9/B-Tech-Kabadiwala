"use client";

export default function AdminRateChart({
  products = [],
}: {
  products?: any[];
}) {
  if (!products?.length) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No products available
      </p>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 mt-8 p-5 md:p-8 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-green-700 font-semibold text-lg mb-4">
        Scrap Market Rate Chart (Read Only)
      </h2>

      {/* Header */}
      <div className="grid grid-cols-3 gap-4 font-semibold bg-green-700 text-white rounded px-3 py-2 mb-2">
        <div>Material</div>
        <div>Category</div>
        <div>Rate/Kg</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {products.map((p: any) => (
          <div
            key={p._id}
            className="grid grid-cols-3 gap-4 bg-white px-3 py-2 border border-green-200 rounded hover:bg-green-50"
          >
            <div className="text-green-900 font-medium">
              {p.scrapName}
            </div>
            <div className="text-green-700">
              {p.category}
            </div>
            <div className="text-green-900 font-semibold">
              ₹{p.rate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
