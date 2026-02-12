"use client";

// import OrderFeedback from "./orderFeed";
// import AdSidebar from "../CommonCode/UiCode/advertisement";
import MyOrder from "./MyOrders";
import NoCurrentOrder from "./NoBooking";
import OrderUserDetails from "./userInfo";
import { useGetActiveOrdersQuery } from "../RTK Query/orderApi";
import AuthGuard from "../CommonCode/auth/authGaurd";
import GlobalLoader from "../CommonCode/UiCode/GlobalLoader";

export default function TrackPage() {
  const { data, isLoading, isError } = useGetActiveOrdersQuery();

  /* ================= STATES ================= */

  if (isLoading) {
    return <GlobalLoader isLoading={isLoading} />;
  }

  if (isError || !data) {
    return (
      <main className="h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">
          There is No Order! It can happens when <br /> user is not Log-in or Don't have any Active Orders 
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