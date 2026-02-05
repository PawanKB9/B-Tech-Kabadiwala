import OrderCard, { Order } from "./orderCard";

type Props = {
  orders: Order[];
  onStatusChange: (
    orderId: string,
    currentStatus: string,
    newStatus: string
  ) => void;
};

export default function SoldOrders({
  orders = [],
  onStatusChange,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Sold Orders (Stored at Center)
      </h2>

      {orders.length === 0 && (
        <div className="text-gray-500">
          No sold orders.
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
