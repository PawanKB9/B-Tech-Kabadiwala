"use client";

import { useEffect, useState } from "react";
import PriceDetailsPage from "../priceDetails";
import { useGetCartQuery } from "@/app/RTK Query/orderApi";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";

export default function MyCartPage() {
  const { getCaptchaToken } = useCaptcha();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    data: cartResponse,
    error,
    isLoading,
  } = useGetCartQuery(
    captchaToken ? { captchaToken } : undefined
  );

  /* Handle captcha challenge */
  useEffect(() => {
    if (!error) return;

    const err: any = error;

    if (err.status === 403 && err.data?.captcha_required === true) {
      (async () => {
        const token = await getCaptchaToken("cart_access");

        if (!token) {
          setCaptchaToken("__BLOCKED__");
          return;
        }

        setCaptchaToken(token);
      })();
    }
  }, [error, getCaptchaToken]);

  const items = cartResponse?.items ?? [];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading cart…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-56px)] pb-14 overflow-y-auto flex flex-col gap-6 p-3 bg-gray-50">
      <PriceDetailsPage items={items} mode={"cart"} />
    </main>
  );
}







// "use client";

// import PriceDetailsPage from "../priceDetails";

// export default function MyCartPage() {

//   //   { _id: "",imgUrl:"",isActive: true, scrapName: "Copper", category: "Daily Scraps", rate : 13, minWeight : 1.0 }
//   const cart = { // get from DB
//     userId: "Puspa123",
//     items:[{
//         productId: "Obj099PlasticBottles",
//         weight: 5.2,
//         },
//         {
//         productId: "Obj097Carton",
//         weight: 13.2,
//         },
//         {
//         productId: "Obj093Aluminium",
//         weight: 1.2,
//         },
//         {
//         productId: "Obj096RaddiNewsPaper",
//         weight: 13.2,
//         },
//         {
//         productId: "Obj100PlasticPipes",
//         weight: 15.2,
//         },
//         ],
//         createdAt: "09-11-2025",
//         updatedAt: "11-11-2025",
//     };

//     const { items } = cart;
//   return (
//     <div className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide">
//         <PriceDetailsPage items={items} />
//     </div>
//   );
// }
