"use client";

import { useState, useMemo } from "react";
import ScrapItem from "./[oderid]/items";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { sampleProducts } from "../ComonCode/Data/Materials";

//Type Definitions
type Item = {
  productId: string;
  weight: number;
};

type EnrichedItem = {
  id: string;
  name: string;
  image: string;
  rate: number;
  weight: number;
  price: number;
  minWeight: number;
};

// Props Type
type PriceDetailsPageProps = {
  items: Item[];
};

export default function PriceDetailsPage({ items }: PriceDetailsPageProps) {
  console.log(items)
  const [hide, setHide] = useState(false);
  const pathname = usePathname();

  // Safely merge cart items with product details
  const enrichedItems: EnrichedItem[] = useMemo(() => {
    if (!Array.isArray(items)) return [];

    return items
      .map((cartItem) => {
        const product = sampleProducts.find(
          (p) => p._id === cartItem.productId
        );
        if (!product) return null;

        return {
          id: product._id,
          name: product.scrapName,
          image: product.imgUrl,
          rate: product.rate,
          weight: cartItem.weight,
          price: +(product.rate * cartItem.weight).toFixed(2),
          minWeight: product.minWeight,
        };
      })
      .filter(Boolean) as EnrichedItem[];
  }, [items]);

  const [cart, setCart] = useState<EnrichedItem[]>(enrichedItems);

  const handleDelete = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, newWeight: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, weight: newWeight, price: +(item.rate * newWeight).toFixed(2) }
          : item
      )
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const shippingCharge = 0.0;
  const taxes = 2.0;
  const total = subtotal + shippingCharge + taxes;

  return (
    <main className="bg-gray-100 w-full flex justify-center items-center">
      <div className="w-full p-0.5 min-w-[255px] max-w-lg bg-white rounded-xl shadow-md">
        {/* Header */}
        <details open className="border-b border-gray-200 pb-2 mb-3">
          <summary className="text-lg px-3 font-semibold text-gray-800 flex items-center justify-between">
            Price Details
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setHide(!hide)}
            >
              {hide ? <ChevronDown /> : <ChevronUp />}
            </button>
          </summary>
        </details>

        {/* Scrap Items */}
        {!hide && (
          <div className="space-y-2 duration-200 px-2">
            {cart.map((item) => (
              <ScrapItem
                key={item.id}
                {...item}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}

        {/* Shipping & Payment Details */}
        <div className="mt-4 px-3 min-w-[260px] space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Pickup</span>
            <span className="text-gray-600">Free (3–4 days)</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-gray-400">Add shipping address</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>Payment</span>
            <span>Online</span>
          </div>

          <hr className="my-2" />

          {/* Totals */}
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>₹{item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Shipping Charge</span>
            <span>₹{shippingCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>₹{taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-2 mt-5">
          {/* For Order details page */}
          {pathname.startsWith("/orders/") && pathname !== "/orders/mycart" && (
            <div className="flex gap-3">
              <button className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                Cancel
              </button>
              <button className="flex-1 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                Sell Now
              </button>
            </div>
          )}


          {/* For Cart Page */}
          {pathname === "/orders/mycart" && (
            <button className="w-full py-2 mt-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition">
              Order Pickup
            </button>
          )}
        </div>
      </div>
    </main>
  );
}


// "use client";

// // Make it Dlobally this component is used in multiple Places

// import { useState } from "react";
// import ScrapItem from "./[oderid]/items";
// import { usePathname } from "next/navigation";
// import { ChevronDown, ChevronUp } from "lucide-react";

// export default function PriceDetailsPage() {
//     const [hide, setHide] = useState(false);
//     const pathname = usePathname();
//     // const order = { // Recieved from props
//     //   id: "ORD125",
//     //   date: "2025-10-30",
//     //   status: "Processing",
//     //   items: [
//     //     { material: "Paper", weight: 8, price: 90 },
//     //     { material: "Plastic", weight: 3, price: 100 },
//     //   ],
//     // }
//   const [items, setItems] = useState([
//     {
//       id: "1",
//       name: "Plastic",
//       image: '/plastic.jpg',
//       rate: 13,
//       weight: 8.0,
//       price: 180,
//     },
//     {
//       id: "2",
//       // name: "Aluminum",
//       name: "Raddi Old Newspaper",
//       image: "/360_F_394273452_vyreTEqX9HTBoIadnZQPQejwm3Y1YYfK.jpg",
//       rate: 13,
//       weight: 8.1,
//       price: 180,
//     },
//   ]);

//   const handleDelete = (id: string) => {
//     setItems(items.filter((item) => item.id !== id));
//   };

//   const handleUpdate = (id: string, newWeight: number) => {
//     setItems(items.map((item) =>
//       item.id === id ? { ...item, weight: newWeight, price: item.rate * newWeight } : item
//     ));
//   };

//   const subtotal = items.reduce((acc, item) => acc + item.price, 0);
//   const taxes = 2.0;
//   const total = subtotal + taxes;
// //    flex items-center justify-center

//   return (
//     <main className="bg-gray-100 w-full flex justify-center items-center">
//       <div className="w-full p-0.5 min-w-[255px]  max-w-lg bg-white rounded-xl shadow-md">
//         {/* Header */}
//         <details open className="border-b border-gray-200 pb-2 mb-3">
//           <summary className="text-lg px-3 font-semibold text-gray-800  flex items-center justify-between">
//             Price Details
//             <button className="cursor-pointer" onClick={()=> setHide(!hide)}>{hide ? <ChevronDown /> : <ChevronUp />}</button>
//           </summary>
//         </details>

//         {/* Scrap Items */}
//         {!hide ? <div className="space-y-2 duration-200 [@media(min-width:320px)]:px-2">
//           {items.map((item) => (
//             <ScrapItem
//               key={item.id}
//               {...item}
//               onDelete={handleDelete}
//               onUpdate={handleUpdate}
//             />
//           ))}
//         </div> : null}

//         {/* Shipping & Payment Details */}
//         <div className="mt-4 px-3 min-w-[260px] space-y-3 text-sm text-gray-700">
//           <div className="flex justify-between">
//             <span>Pickup</span>
//             <span className="text-gray-600">Free (3–4 days)</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Shipping</span>
//             <span className="text-gray-400">Add shipping address</span>
//           </div>
//           <div className="flex justify-between border-t pt-2 font-medium">
//             <span>Payment</span>
//             <span>Online</span>
//           </div>

//           <hr className="my-2" />

//           {/* Totals */}
//           {items.map((item) => (
//             <div key={item.id} className="flex justify-between">
//               <span>{item.name}</span>
//               <span>₹{item.price.toFixed(2)}</span>
//             </div>
//           ))}
//           <div className="flex justify-between">
//             <span>Shiping Charge</span>
//             <span>₹{taxes.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Taxes</span>
//             <span>₹{taxes.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between font-semibold">
//             <span>Total</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>
//         </div>

//         <div className="px-2 mt-5">
//           {/* /Order */}
//           {pathname === "/Order" && (
//             <div className="flex gap-3">
//               <button className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition">
//                 Cancel
//               </button>
//               <button className="flex-1 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
//                 Sell Now
//               </button>
//             </div>
//           )}
//           {/* /Mycart */}
//           {pathname === "/orders/mycart" && (
//             <button className="w-full py-2 mt-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition">
//               Order Pickup
//             </button>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

