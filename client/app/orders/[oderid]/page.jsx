
"use client";
// import AdSidebar from '@/app/ComonCode/UiCode/advertisement';

// import OrderFeedback from '../../orders/orderFeed';
// import PriceDetailsPage from './priceDetails';
// import OrderTracker from './tracker'

// export default function TrackPage() {
//   // status can be "confirmed" | "pickup" | "arrived" | "sold"

//   const order = {}

//    const customSteps = [
//     { key: "confirmed", title: "Order Confirmed", description: "Ordered at : 10 AM 9 Oct 2025" },
//     { key: "pickup", title: "Out For Pickup", description: "Pickup Person : Rahul\nContact : 9876543210" },
//     { key: "arrived", title: "Arrived", description: "Reached your area" },
//   ];

//   return (
//     <main className="h-[100vh] overflow-y-auto scrollbar-hide flex flex-col items-center gap-6  p-1 bg-gray-50">
      
//       {/* when needed custom naming while looking for status of order then pass customSteps array */}
//       <OrderTracker status={"pickup"}  />
//       {/* <ScrapItem /> */}
//       <PriceDetailsPage />
//       {/* <OrderFeedback /> */}
//     </main>
//   );
// }


import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderFeedback from "../../orders/orderFeed";
import PriceDetailsPage from "../priceDetails";
import OrderTracker from "./tracker";
import { div } from "framer-motion/client";

export default function TrackPage() {
  const { orderId } = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);

  const customSteps = [
    {
      key: "confirmed",
      title: "Order Confirmed",
      description: "Ordered at : 10 AM 9 Oct 2025",
    },
    {
      key: "pickup",
      title: "Out For Pickup",
      description: "Pickup Person : Rahul\nContact : 9876543210",
    },
    { key: "arrived", title: "Arrived", description: "Reached your area" },
  ];

  // Parse order data passed from router.push()
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setOrder(parsed);
      } catch (err) {
        console.error("Invalid order data:", err);
      }
    }
  }, [searchParams]);

  if (!order)
    return (
      <main className="h-[100vh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading order details...</p>
      </main>
    );

  const items= order.items

  return (
      <main className="h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide flex flex-col items-center gap-6 p-3 bg-gray-50">
          {/* Order Tracker  customSteps={customSteps} */}
          <OrderTracker status={order.status || "pickup"}  />

          {/* Price / Summary Section */}
          <PriceDetailsPage items={items} />
          

          {/* Feedback (optional, show if delivered/sold) */}
          {/* {order.status === "sold" && <OrderFeedback orderId={orderId} />} */}
      </main>
  );
}
