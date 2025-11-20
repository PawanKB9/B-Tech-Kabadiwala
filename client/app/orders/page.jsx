
import AdSidebar from '../ComonCode/UiCode/advertisement';
import MyOrder from './MyOrders';
import NoCurrentOrder from './NoBooking';
import OrderFeedback from './orderFeed';

export default function TrackPage() {
  // status can be "confirmed" | "pickup" | "arrived" | "sold"

  // [ "confirmed", "pickup", "arrived", "sold"]
  const orders = [
    {
      id: "ORD123",
      date: "2025-10-28",
      status: "confirmed",
      items: [
        { productId: "Obj098Iron", weight: 10 },
        { productId: "Obj100PlasticPipes", weight: 4 },
      ],
    },
    {
      id: "ORD124",
      date: "2025-10-29",
      status: "pickup",
      items: [
        { productId: "Obj094Copper", weight: 2.5 },
      ],
    },
    {
      id: "ORD125",
      date: "2025-10-30",
      status: "arrived",
      items: [
        { productId: "Obj095Paper", weight: 8 },
        { productId: "Obj099PlasticBottles", weight: 3 },
        { productId: "Obj093Aluminium", weight: 1.3 },
        { productId: "Obj098Iron", weight: 3 },
      ],
    },
  ];

  const isOreder = orders.length


  return (

    <main className="h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide items-center gap-6  p-1 bg-gray-50">
      {!isOreder ? <NoCurrentOrder />: <MyOrder orders={orders} />}   
      {/* <OrderFeedback /> */}
    </main>
  );
}

// datbase 
//[ _id	BaseModel -> { userId, createdAt, updatedAt }	Items	TotalAmount	Status	Payment ]