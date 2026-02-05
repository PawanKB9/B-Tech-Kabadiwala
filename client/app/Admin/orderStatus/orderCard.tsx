"use client";

import { useState } from "react";
import StatusDropdown from "./status";

/* ---------------- Types ---------------- */
type Props = {
  order: Order;
  onStatusChange: (
    orderId: string,
    currentStatus: string,
    newStatus: string
  ) => void;
};

/* ---------------- Component ---------------- */

export default function OrderCard({
  order,
  onStatusChange,
}: Props) {
  const [showUser, setShowUser] = useState<boolean>(false);


  return (
    <div className="p-4 rounded-xl bg-white shadow mb-4 border">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg">
          Order #{order.id}
        </h2>
        <span className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
          {order.status}
        </span>
      </div>

      {/* Order Info */}
      <div className="mt-3 text-sm text-gray-700 space-y-1">
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>
        <p>
          <strong>Payment:</strong> {order.payment}
        </p>
      </div>

      {/* Items */}
      <div className="mt-3">
        <h3 className="font-semibold">Items:</h3>
        <ul className="mt-1 pl-5 list-disc text-sm">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.scrapName} —{" "}
              {item.measureType === "weight"
                ? `${item.weight} kg`
                : `${item.piece} pcs`}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <StatusDropdown
          currentStatus={order.status}
          onSelect={(newStatus: string) =>
            onStatusChange(order.id, order.status, newStatus)
          }
        />

        <button
          className="px-3 py-1 rounded bg-gray-200 text-sm"
          onClick={() => setShowUser((prev) => !prev)}
        >
          {showUser ? "Hide User" : "Show User"}
        </button>
      </div>

      {/* User Info */}
      {showUser && (
        <div className="mt-3 p-3 bg-gray-100 rounded text-sm">
          <p>
            <strong>User ID:</strong> {order.userId}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {order.location?.address ?? "N/A"}
          </p>
          <p>
            <strong>Pincode:</strong>{" "}
            {order.location?.pincode ?? "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}


export type Order = {
  id: string;
  userId: string,
  status: string;
  payment: string;
  totalAmount: number;
  createdAt: string;
  items: {
    productId: string;
    scrapName: string;
    measureType: string;
    weight?: number;
    piece?: number;
  }[];
  location: {
    address: string;
    pincode: number;
  };
};