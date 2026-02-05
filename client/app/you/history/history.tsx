"use client";

import { useRouter } from "next/navigation";

interface OrderHistoryItem {
  id: string;
  createdAt: string; // Removed optional '?' to catch errors early
  status: string;
  items: Array<{
    productId: string;
    weight: number;
  }>;
}

interface OrderHistoryProps {
  orders: OrderHistoryItem[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const router = useRouter();

  const handleClick = (orderId: string) => {
    // console.log(orderId);
    router.push(`/you/history/${orderId}`);
  };
  // console.log(orders[1].id);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-3 border-b pb-1">
        <h2 className="text-lg text-black font-semibold">Order History</h2>
      </div>

      <div className="flex flex-col gap-3">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleClick(order.id)}
              className="flex items-center justify-between bg-white shadow-sm border rounded-2xl p-3 hover:shadow-md cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-orange-600">Order ID</p>
                <p className="text-sm font-medium text-gray-700">{order.id}</p>
              </div>

              <div className="text-right">
                {/* Ensure we are accessing the correct key name */}
                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-xs font-medium text-green-700">
                  {order.status || "No Status"} 
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function formatDate(dateString?: string) {
  // If the API returns nothing, or a null value
  if (!dateString) return "Date missing"; 

  const date = new Date(dateString);

  // Check if the string is a valid date format
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}