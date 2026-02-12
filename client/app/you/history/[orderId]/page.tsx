"use client";

import { useParams } from "next/navigation";
import PriceDetailsPage from "@/app/orders/priceDetails";
import { useGetOrderHistoryQuery } from "@/app/RTK Query/orderApi";
import InvoiceCard from "./invoice";
import GlobalLoader from "@/app/CommonCode/UiCode/GlobalLoader";

export default function TrackPage() {
  const params = useParams();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;
    // console.log(orderId)

  const { data, isLoading, isError } =
    useGetOrderHistoryQuery({ page: 1, limit: 10 });

  if (isLoading) {
    return <GlobalLoader isLoading={isLoading} />;
  }

  if (isError || !data) {
    return (
      <main className="h-[100vh] flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">
          Failed to load order details. <br /> It might have been removed or there was an error fetching it.
        </p>
      </main>
    );
  }

  // CORRECT ORDER SELECTION
  const order = data.orders.find(
    (o: any) => o.id === orderId || o._id === orderId
  );

  if (!order) {
    return (
      <main className="h-[100vh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">
          Order not found.
        </p>
      </main>
    );
  }

  return (
    <main className="h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide flex flex-col items-center gap-6 p-3 bg-gray-50">
      <PriceDetailsPage
        key={orderId}
        items={order.items ?? []}
      />

      <InvoiceCard orderId={orderId} />
      
    </main>
  );
}
