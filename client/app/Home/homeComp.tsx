"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "./card";
import { useGetProductsByCenterQuery } from "../RTK Query/appApi";
import {
  useUpsertCartMutation,
  useGetCartQuery,
} from "../RTK Query/orderApi";
import { useCaptcha } from "../CommonCode/auth/captchaHook";
import { SampleProducts } from "../CommonCode/Data/SampleData";

type CartItem = {
  productId: string;
  scrapName: string;
  measureType: "weight" | "piece";
  weight: number;
};

export default function DailyScrapsSection() {
  const centerId = process.env.NEXT_PUBLIC_CENTERID;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [captchaToken, setCaptchaToken] =
    useState<string | undefined>();

  const isBlocked = captchaToken === "__BLOCKED__";
  const { getCaptchaToken } = useCaptcha();

  /* ---------------- PRODUCTS ---------------- */
  const { data, isLoading, isError } =
    useGetProductsByCenterQuery({ centerId, captchaToken });

  /* ---------------- CART ---------------- */
  const { data: cartData, error: cartError } =
    useGetCartQuery({ captchaToken }, { skip: isBlocked });

  const [upsertCart] = useUpsertCartMutation();

  /* ---------------- GUARDS ---------------- */
  const cartCaptchaTriedRef = useRef(false);
  const upsertCaptchaTriedRef = useRef(false);

  /* ---------------- DAILY SCRAPS (API → SAMPLE FALLBACK) ---------------- */
  const dailyScrapProducts = useMemo(() => {
    const source =
      data && Object.keys(data).length
        ? data
        : SampleProducts;

    return (source["Daily Scraps"] ?? []).filter(
      (p: any) => p.isActive
    );
  }, [data]);

  /* ---------------- CART → CAPTCHA RETRY ---------------- */
  useEffect(() => {
    if (!cartData?.captcha_required) return;
    if (cartCaptchaTriedRef.current) return;

    cartCaptchaTriedRef.current = true;

    (async () => {
      const token = await getCaptchaToken("cart");
      if (!token) {
        setCaptchaToken("__BLOCKED__");
        return;
      }
      setCaptchaToken(token);
    })();
  }, [cartData, getCaptchaToken]);

  /* ---------------- HYDRATE CART ---------------- */
  useEffect(() => {
    if (!cartData?.items) return;

    setCartItems((prev) => {
      const same =
        prev.length === cartData.items.length &&
        prev.every(
          (p, i) =>
            p.productId === cartData.items[i].productId &&
            p.weight === cartData.items[i].weight
        );
      return same ? prev : cartData.items;
    });
  }, [cartData]);

  /* ---------------- UPSERT CART ---------------- */
  const submitCart = useCallback(
    async (items: CartItem[]) => {
      if (!items.length || isBlocked) return;

      try {
        const res: any = await upsertCart({
          payload: { items },
          captchaToken,
        }).unwrap();

        if (
          res?.captcha_required &&
          !upsertCaptchaTriedRef.current
        ) {
          upsertCaptchaTriedRef.current = true;

          const token = await getCaptchaToken("cart-upsert");
          if (!token) {
            setCaptchaToken("__BLOCKED__");
            return;
          }

          setCaptchaToken(token);
        }
      } catch (err) {
        console.error("Cart upsert failed", err);
      }
    },
    [upsertCart, captchaToken, isBlocked, getCaptchaToken]
  );

  /* ---------------- ADD / UPDATE ITEM ---------------- */
  const addOrUpdateItem = useCallback(
    (product: any, weight: number) => {
      const productId = product._id ?? product.id;

      setCartItems((prev) => {
        const next = [...prev];
        const idx = next.findIndex(
          (i) => i.productId === productId
        );

        const item: CartItem = {
          productId,
          scrapName: product.scrapName,
          measureType: "weight",
          weight,
        };

        idx >= 0 ? (next[idx] = item) : next.push(item);
        submitCart(next);
        return next;
      });
    },
    [submitCart]
  );

  if (
    isBlocked ||
    isLoading ||
    isError ||
    cartError ||
    !dailyScrapProducts.length
  ) {
    return null;
  }

  return (
    <section className="w-full text-gray-800 px-3 py-3">
      <h2 className="text-lg font-bold mb-3">
        Daily Scraps
      </h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {dailyScrapProducts.map((product: any) => {
          const productId = product._id ?? product.id;

          const cartItem = cartItems.find(
            (c) => c.productId === productId
          );

          return (
            <ProductCard
              key={productId}
              {...product}
              _id={productId}
              isInCart={!!cartItem}
              cartWeight={cartItem?.weight}
              onAddToCart={(wt: number) =>
                addOrUpdateItem(product, wt)
              }
              onUpdateCart={(wt: number) =>
                addOrUpdateItem(product, wt)
              }
            />
          );
        })}
      </div>
    </section>
  );
}



// "use client";

// import { useMemo, useState, useEffect, useCallback, useRef}  from "react";
// import ProductCard from "./card";
// import { useGetProductsByCenterQuery } from "../RTK Query/appApi";
// import {
//   useUpsertCartMutation,
//   useGetCartQuery,
// } from "../RTK Query/orderApi";
// import { useCaptcha } from "../CommonCode/auth/captchaHook";
// import { SampleProducts } from "../CommonCode/Data/SampleData";

// type CartItem = {
//   productId: string;
//   scrapName: string;
//   measureType: "weight" | 'piece';
//   weight: number;
// };

// export default function DailyScrapsSection() {
//   const centerId = process.env.NEXT_PUBLIC_CENTERID;

//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [captchaToken, setCaptchaToken] =
//     useState<string | undefined>();

//   const isBlocked = captchaToken === "__BLOCKED__";

//   const { getCaptchaToken } = useCaptcha();

//   /* ---------------- PRODUCTS ---------------- */
//   const { data, isLoading, isError } =
//     useGetProductsByCenterQuery({centerId, captchaToken});

//   /* ---------------- CART ---------------- */
//   const {
//     data: cartData,
//     error: cartError,
//   } = useGetCartQuery(
//     { captchaToken },
//     { skip: isBlocked }
//   );

//   const [upsertCart] = useUpsertCartMutation();

//   /* ---------------- GUARDS ---------------- */
//   const cartCaptchaTriedRef = useRef(false);
//   const upsertCaptchaTriedRef = useRef(false);

//   /* ---------------- DAILY SCRAPS ---------------- */
//   const dailyScrapProducts = useMemo(() => {
//     if (!data) return [];
//     return (data["Daily Scraps"] ?? []).filter(
//       (p: any) => p.isActive
//     );
//   }, [data]);

//   /* ---------------- CART → CAPTCHA RETRY ---------------- */
//   useEffect(() => {
//     if (!cartData?.captcha_required) return;
//     if (cartCaptchaTriedRef.current) return;

//     cartCaptchaTriedRef.current = true;

//     (async () => {
//       const token = await getCaptchaToken("cart");
//       if (!token) {
//         setCaptchaToken("__BLOCKED__");
//         return;
//       }
//       setCaptchaToken(token);
//     })();
//   }, [cartData, getCaptchaToken]);

//   /* ---------------- HYDRATE CART ---------------- */
//   useEffect(() => {
//     if (!cartData?.items) return;

//     setCartItems((prev) => {
//       const same =
//         prev.length === cartData.items.length &&
//         prev.every(
//           (p, i) =>
//             p.productId === cartData.items[i].productId &&
//             p.weight === cartData.items[i].weight
//         );
//       return same ? prev : cartData.items;
//     });
//   }, [cartData]);

//   /* ---------------- UPSERT CART ---------------- */
//   const submitCart = useCallback(
//     async (items: CartItem[]) => {
//       if (!items.length || isBlocked) return;

//       try {
//         const res: any = await upsertCart({
//           payload: { items },
//           captchaToken,
//         }).unwrap();

//         if (
//           res?.captcha_required &&
//           !upsertCaptchaTriedRef.current
//         ) {
//           upsertCaptchaTriedRef.current = true;

//           const token = await getCaptchaToken("cart-upsert");
//           if (!token) {
//             setCaptchaToken("__BLOCKED__");
//             return;
//           }

//           setCaptchaToken(token);
//         }
//       } catch (err) {
//         console.error("Cart upsert failed", err);
//       }
//     },
//     [
//       upsertCart,
//       captchaToken,
//       isBlocked,
//       getCaptchaToken,
//     ]
//   );

//   /* ---------------- ADD / UPDATE ITEM ---------------- */
//   const addOrUpdateItem = useCallback(
//     (product: any, weight: number) => {
//       setCartItems((prev) => {
//         const next = [...prev];
//         const idx = next.findIndex(
//           (i) => i.productId === product._id
//         );

//         const item: CartItem = {
//           productId: product._id,
//           scrapName: product.scrapName,
//           measureType: "weight",
//           weight,
//         };

//         idx >= 0 ? (next[idx] = item) : next.push(item);
//         submitCart(next);
//         return next;
//       });
//     },
//     [submitCart]
//   );

//   if (
//     isBlocked ||
//     isLoading ||
//     isError ||
//     cartError ||
//     !dailyScrapProducts.length
//   ) {
//     return null;
//   }

//   return (
//     <section className="w-full text-gray-800 px-3 py-3">
//       <h2 className="text-lg font-bold mb-3">
//         Daily Scraps
//       </h2>

//       <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//         {dailyScrapProducts.map((product: any) => {
//           const cartItem = cartItems.find(
//             (c) => c.productId === product._id
//           );

//           return (
//             <ProductCard
//               key={product._id}
//               {...product}
//               isInCart={!!cartItem}
//               cartWeight={cartItem?.weight}
//               onAddToCart={(wt: number) =>
//                 addOrUpdateItem(product, wt)
//               }
//               onUpdateCart={(wt: number) =>
//                 addOrUpdateItem(product, wt)
//               }
//             />
//           );
//         })}
//       </div>
//     </section>
//   );
// }
