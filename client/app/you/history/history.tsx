"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface OrderItem {
  productId: string;
  weight: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
}
const orders = [
  {
    id: "ORD123",
    date: "2025-10-28 14:36 PM",
    status: "confirmed",
    items: [
      { productId: "Obj098Iron", weight: 10 },
      { productId: "Obj100PlasticPipes", weight: 4 },
    ],
  },
  {
    id: "ORD124",
    date: "2025-10-29 09:15 AM",
    status: "pickup",
    items: [{ productId: "Obj094Copper", weight: 2.5 }],
  },
  {
    id: "ORD125",
    date: "2025-10-30 11:20 AM",
    status: "arrived",
    items: [
      { productId: "Obj095Paper", weight: 8 },
      { productId: "Obj099PlasticBottles", weight: 3 },
      { productId: "Obj093Aluminium", weight: 1.3 },
      { productId: "Obj098Iron", weight: 3 },
    ],
  },
];


export default function OrderHistory() {
  const router = useRouter();
  const [orderList, setOrderList] = useState<Order[]>(orders);

  // WHEN CLICKED → navigate to /record/history/[orderId]
  const handleClick = (order: Order) => {
    const encoded = encodeURIComponent(JSON.stringify(order));
    router.push(`/you/history/${order.id}?data=${encoded}`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this order?")) return;
    setOrderList((prev) => prev.filter((o) => o.id !== id));
  };

  const handleDeleteAll = () => {
    if (!confirm("Delete all order history?")) return;
    setOrderList([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3 border-b pb-1">
        <h2 className="text-lg text-black font-semibold">Order History</h2>

        {orderList.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600"
          >
            Delete All
          </button>
        )}
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-3">
        {orderList.length > 0 ? (
          orderList.map((order) => (
            <div
              key={order.id}
              onClick={() => handleClick(order)}
              className="flex items-center justify-between bg-white shadow-sm border rounded-2xl p-3 hover:shadow-md cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-orange-600">Order ID</p>
                <p className="text-sm font-medium text-gray-700">{order.id}</p>
              </div>
                <p className="text-xs text-gray-500">{order.date}</p>

              <button
                onClick={(e) => handleDelete(order.id, e)}
                className="p-1 rounded-full hover:bg-red-100"
                title="Delete order"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
}
