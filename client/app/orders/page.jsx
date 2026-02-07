"use client";

// import OrderFeedback from "./orderFeed";
// import AdSidebar from "../CommonCode/UiCode/advertisement";
import MyOrder from "./MyOrders";
import NoCurrentOrder from "./NoBooking";
import OrderUserDetails from "./userInfo";
import { useGetActiveOrdersQuery } from "../RTK Query/orderApi";

export default function TrackPage() {
  const { data, isLoading, isError } = useGetActiveOrdersQuery();

  /* ================= STATES ================= */

  if (isLoading) {
    return (
      <main className="h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">
          Loading your active orders…
        </p>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">
          Failed to load active orders.
        </p>
      </main>
    );
  }

  /* ================= NORMALIZE API DATA ================= */

  const orders = data.activeOrders ?? [];
  const hasOrders = orders.length > 0;

  /* ================= UI ================= */

  return (
    <AuthGuard>
    <main className="h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide items-center gap-6 p-1 bg-gray-50">
      
      {!hasOrders ? (
        <NoCurrentOrder />
      ) : (
        <MyOrder orders={orders} />
      )}

      <OrderUserDetails />

      {/* Enable later when backend is ready */}
      {/* <OrderFeedback /> */}
    </main>
    </AuthGuard>
  );
}


// datbase 
//[ _id	BaseModel -> { userId, createdAt, updatedAt }	Items	TotalAmount	Status	Payment ]