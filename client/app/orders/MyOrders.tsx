"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { sampleProducts, staticMaterials } from "../ComonCode/Data/Materials";

interface OrderItem {
  productId: string;
  weight: string;
}

interface Order {
  id: string; // add an ID for routing
  items: OrderItem[];
}

interface MyOrderProps {
  orders: Order[];
}

export default function MyOrder({ orders }: MyOrderProps) {
  const router = useRouter();

  const getImageById = (name: string) => {
    const found = sampleProducts.find((item) =>
      name.toLowerCase().includes(item._id.toLowerCase())
    );
    return found;
  };

  const handleOrderClick = (order: Order) => {
    // Send data via URL encoding
    router.push(
      `/orders/${order.id}?data=${encodeURIComponent(JSON.stringify(order))}`
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto md:pt-16 text-green-600">
      <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
        My Orders
      </h1>

      {orders?.map((order, index) => {
        const firstItem = order?.items?.[0];
        const itemId = firstItem?.productId || "Unknown Material";
        const itemWeight = firstItem?.weight || "";
        const item = getImageById(itemId);
        // const { imgUrl:itemImage, scrapName } = getImageById(itemId);
        const scrapName = item?.scrapName
        const itemImage = item?.imgUrl

        return (
          <div key={order.id || index} className="mb-6">
            <h2 className="text-lg font-semibold sm:text-xl sm:font-bold my-1 mx-4">
              Order {index + 1}
            </h2>

            <div
              onClick={() => handleOrderClick(order)}
              className="cursor-pointer flex justify-between items-center gap-3 px-4 border rounded-2xl shadow hover:shadow-lg p-3 transition-all duration-200 active:scale-[0.98] bg-white"
            >
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold">
                  {scrapName}
                </h2>
                <p className="text-sm sm:text-base font-medium text-orange-500">
                  {itemWeight} (Kg)
                </p>
              </div>

              <div className="shrink-0">
                <Image
                  src={itemImage}
                  alt={scrapName}
                  width={100}
                  height={70}
                  // unoptimized
                  className="object-cover rounded-xl border"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
