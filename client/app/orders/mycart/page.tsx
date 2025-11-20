"use client";

import PriceDetailsPage from "../priceDetails";

export default function MyCartPage() {

  //   { _id: "",imgUrl:"",isActive: true, scrapName: "Copper", category: "Daily Scraps", rate : 13, minWeight : 1.0 }
  const cart = { // get from DB
    userId: "Puspa123",
    items:[{
        productId: "Obj099PlasticBottles",
        weight: 5.2,
        },
        {
        productId: "Obj097Carton",
        weight: 13.2,
        },
        {
        productId: "Obj093Aluminium",
        weight: 1.2,
        },
        {
        productId: "Obj096RaddiNewsPaper",
        weight: 13.2,
        },
        {
        productId: "Obj100PlasticPipes",
        weight: 15.2,
        },
        ],
        createdAt: "09-11-2025",
        updatedAt: "11-11-2025",
    };

    const { items } = cart;
  return (
    <div className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide">
        <PriceDetailsPage items={items} />
    </div>
  );
}
