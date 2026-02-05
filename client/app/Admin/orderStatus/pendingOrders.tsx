import OrderCard from "./orderCard";
import { Order } from "./orderCard";

type Props = {
  orders: Order[];
  onStatusChange: (
    orderId: string,
    currentStatus: string,
    newStatus: string
  ) => void;
};

export default function PendingOrders({
  orders = [],
  onStatusChange,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Pending / In-progress
      </h2>

      {orders.length === 0 && (
        <div className="text-gray-500">
          No pending orders.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}




// import OrderCard from "./orderCard";

// export default function PendingOrders({ orders = [], onStatusChange }) {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Pending / In-progress</h2>
//       {orders.length === 0 && <div className="text-gray-500">No pending orders.</div>}
//       <div className="space-y-4">
//         {orders.map((o) => (
//           <OrderCard key={o.id} order={o} onStatusChange={onStatusChange} />
//         ))}
//       </div>
//     </div>
//   );
// }