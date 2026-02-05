import OrderCard, { Order } from "./orderCard";

type Props = {
  orders: Order[];
};

export default function CompletedOrders({
  orders = [],
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Completed Orders (Recycled + Cancelled)
      </h2>

      {orders.length === 0 && (
        <div className="text-gray-500">
          No completed orders.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onStatusChange={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
