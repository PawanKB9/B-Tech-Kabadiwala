"use client";

import { useRouter } from "next/navigation";
import ImageWithFallback from "../CommonCode/UiCode/avatarImg";
import { useGetProductsByCenterQuery } from "../RTK Query/appApi";
import { useMemo } from "react";

/* ================= TYPES ================= */

interface OrderItem {
  productId: string;
  weight: number;
  piece: number;
  measureType: string;
  scrapName: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  isCustomOrder: boolean;
}

interface MyOrderProps {
  orders: Order[];
}

interface Product {
  _id: string;
  scrapName: string;
  imgUrl?: string;
}

/* ================= COMPONENT ================= */

export default function MyOrder({ orders }: MyOrderProps) {
  const router = useRouter();
  const imgCss = "object-cover rounded-xl border shadow-sm";

  /* DEFAULT CENTER ID */
  const centerId = process.env.NEXT_PUBLIC_CENTERID as string;

  const { data, isLoading } =
    useGetProductsByCenterQuery({centerId});

  /* ================= NORMALIZE PRODUCTS ================= */

  const productMap = useMemo(() => {
    if (!data) return {};

    // backend returns { "Daily Scraps": [...], ... }
    const allProducts = Object.values(data).flat() as Product[];

    return allProducts.reduce<Record<string, Product>>((acc, p) => {
      acc[p._id] = p;
      return acc;
    }, {});
  }, [data]);

  /* ================= HANDLERS ================= */

  const handleOrderClick = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };

  /* ================= UI ================= */

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading orders…</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto md:pt-16 text-green-600">
      <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
        My Orders
      </h1>

      {orders.map((order, index) => {
        const firstItem = order.items?.[0];

        const product = firstItem
          ? productMap[firstItem.productId]
          : undefined;

        let scrapName = product?.scrapName ?? "Unknown Material";
        let itemImage = product?.imgUrl;
        let itemWeight = firstItem?.weight ?? 0;
        let itemPiece = firstItem?.piece ?? 0;

        if(order?.isCustomOrder) {
          scrapName = firstItem?.scrapName
          if(firstItem?.measureType === "weight"){
            itemWeight = firstItem.weight;
          } else {
            itemPiece = firstItem?.piece ?? 0;
          }
        }

        return (
          <div key={order.id} className="mb-6">
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
                  {itemWeight > 0 ? itemWeight + " Kg" : itemPiece + " Pieces"}
                </p>
              </div>

              <div className="shrink-0">
                <ImageWithFallback
                  image={itemImage}
                  name={scrapName}
                  width={70}
                  height={70}
                  className={imgCss}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
