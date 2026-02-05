"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import PendingOrders from "./pendingOrders";
import SoldOrders from "./soldOrders";
import CompletedOrders from "./completedOrders";

import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
import { useLazyGetCenterOrdersAdminQuery } from "@/app/RTK Query/orderApi";

type OrderGroups = {
  pending: any[];
  picked: any[];
  sold: any[];
  cancelled: any[];
  recycled: any[];
};

const EMPTY_GROUPS: OrderGroups = {
  pending: [],
  picked: [],
  sold: [],
  cancelled: [],
  recycled: [],
};

export default function OrderManagementPage() {
  const { getCaptchaToken } = useCaptcha();
  const centerId = process.env.NEXT_PUBLIC_CENTERID;

  const [activeTab, setActiveTab] = useState<"pending" | "sold" | "completed">(
    "pending"
  );

  const [groups, setGroups] = useState<OrderGroups>(EMPTY_GROUPS);

  const [getCenterOrdersAdmin, { data: rawResponse }] =
    useLazyGetCenterOrdersAdminQuery();

  // ---------------- guards ----------------
  const fetchedRef = useRef(false);
  const captchaTriedRef = useRef(false);

  // ================= FETCH ORDERS =================
  useEffect(() => {
    if (!centerId) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    (async () => {
      try {
        const res: any = await getCenterOrdersAdmin({ centerId }).unwrap();

        // captcha retry (ONCE)
        if (res?.captcha_required && !captchaTriedRef.current) {
          captchaTriedRef.current = true;

          const captchaToken = await getCaptchaToken("orders");
          if (!captchaToken) return;

          await getCenterOrdersAdmin({
            centerId,
            captchaToken,
          }).unwrap();
        }
      } catch (err) {
        console.error("Orders fetch failed", err);
      }
    })();
  }, [centerId, getCenterOrdersAdmin, getCaptchaToken]);

  // ================= NORMALIZE RESPONSE =================
  useEffect(() => {
    if (!rawResponse?.orders) return;

    setGroups({
      pending: rawResponse.orders.pending ?? [],
      picked: rawResponse.orders.picked ?? [],
      sold: rawResponse.orders.sold ?? [],
      cancelled: rawResponse.orders.cancelled ?? [],
      recycled: rawResponse.orders.recycled ?? [],
    });
  }, [rawResponse]);

  // ================= TAB HELPERS =================
  const getOrdersForTab = (tab: string) => {
    if (tab === "pending") return [...groups.pending, ...groups.picked];
    if (tab === "sold") return [...groups.sold];
    if (tab === "completed")
      return [...groups.recycled, ...groups.cancelled];
    return [];
  };

  // ================= LOCAL STATUS MANAGEMENT =================
  const removeOrderFromGroups = (orderId: string) => {
    const next: OrderGroups = {
      pending: [...groups.pending],
      picked: [...groups.picked],
      sold: [...groups.sold],
      cancelled: [...groups.cancelled],
      recycled: [...groups.recycled],
    };

    let found: any = null;

    for (const key of Object.keys(next) as (keyof OrderGroups)[]) {
      const idx = next[key].findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        found = next[key].splice(idx, 1)[0];
        break;
      }
    }

    return { next, found };
  };

  const placeOrderToGroup = (
    order: any,
    newStatus: string,
    nextGroups: OrderGroups
  ) => {
    const target = (() => {
      switch (newStatus) {
        case "Confirmed":
        case "Out for Pickup":
        case "Arrived":
          return "pending";
        case "Picked":
          return "picked";
        case "Sold":
          return "sold";
        case "Cancelled":
          return "cancelled";
        case "Recycled":
          return "recycled";
        default:
          return null;
      }
    })();

    if (!target) return nextGroups;

    nextGroups[target] = [
      ...nextGroups[target],
      { ...order, status: newStatus },
    ];

    return nextGroups;
  };

  const updateOrderStatus = (
    orderId: string,
    currentStatus: string,
    newStatus: string
  ) => {
    setGroups((prev) => {
      const { next, found } = removeOrderFromGroups(orderId);
      if (!found) return prev;

      return placeOrderToGroup(found, newStatus, next);
    });
  };

  // ================= UI =================
  return (
    <div className="my-20 text-gray-800 bg-zinc-100 p-5 min-h-[60vh]">
      {/* TAB NAV */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Pending Orders
        </button>

        <button
          onClick={() => setActiveTab("sold")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "sold"
              ? "bg-green-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Sold Orders
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "completed"
              ? "bg-purple-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Completed Orders
        </button>
      </div>

      <div>
        {activeTab === "pending" && (
          <PendingOrders
            orders={getOrdersForTab("pending")}
            onStatusChange={updateOrderStatus}
          />
        )}

        {activeTab === "sold" && (
          <SoldOrders
            orders={getOrdersForTab("sold")}
            onStatusChange={updateOrderStatus}
          />
        )}

        {activeTab === "completed" && (
          <CompletedOrders
            orders={getOrdersForTab("completed")}
          />
        )}
      </div>
    </div>
  );
}

