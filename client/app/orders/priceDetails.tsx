"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

import ScrapItem from "./[orderId]/items";
import { useGetProductsByCenterQuery } from "../RTK Query/appApi";
import {
  // cart
  useGetCartQuery,
  useClearCartMutation,
  useUpsertCartMutation,
  //order
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUserUpdateOrderStatusMutation,
  useUpdateOrderItemsMutation,
} from "../RTK Query/orderApi";

import { useCaptcha } from "../CommonCode/auth/captchaHook";

/* ================= TYPES ================= */

type Item = {
  productId: string;
  weight: number;
};

type Product = {
  _id: string;
  scrapName: string;
  rate: number;
  imgUrl?: string;
  minWeight?: number;
};

type EnrichedItem = {
  id: string;
  name: string;
  image?: string;
  rate: number;
  weight: number;
  price: number;
  minWeight?: number;
};

type PriceDetailsPageProps = {
  items?: Item[];
  mode?: "history" | "order" | "cart";
};

/* ================= COMPONENT ================= */

export default function PriceDetailsPage({
  items,
  mode,
}: PriceDetailsPageProps) {
  const router = useRouter();
  const params = useParams();

  const orderId = params.orderId as string | undefined;
  const isEditable = mode === "order" || mode === "cart";

  const [hide, setHide] = useState(false);

  /* ================= CAPTCHA ================= */
  const { getCaptchaToken } = useCaptcha();

  /* ================= API ================= */
  const [upsertCart] = useUpsertCartMutation();
  const [clearCart] = useClearCartMutation();
  const [createOrder] = useCreateOrderMutation();

  const [updateOrderItems] = useUpdateOrderItemsMutation();
  const [userUpdateOrderStatus] = useUserUpdateOrderStatusMutation();

  /* ================= DATA FETCH ================= */

  const centerId = process.env.NEXT_PUBLIC_CENTERID;

  const { data: productsData } =
    useGetProductsByCenterQuery({centerId});

  const [orderCaptchaToken, setOrderCaptchaToken] = useState<string | null>();

  const { data: orderData, error: orderError } =
    useGetOrderByIdQuery(
      { orderId: orderId!, captchaToken: orderCaptchaToken },
      {
        skip: mode !== "order" || !orderId,
      }
    );



    useEffect(() => {
    if ((orderError as any)?.status === 403 && !orderCaptchaToken) {
      (async () => {
        const token = await getCaptchaToken();
        setOrderCaptchaToken(token);
      })();
    }
  }, [orderError, orderCaptchaToken, getCaptchaToken]);


  const { data: cartData } =
    useGetCartQuery(undefined, {
      skip: !!items || mode !== "cart",
    });

  /* ================= RESOLVE ITEMS ================= */

  const resolvedItems: Item[] = useMemo(() => {
    if (items?.length) return items;
    if (orderData?.items) return orderData.items;
    if (cartData?.items) return cartData.items;
    return [];
  }, [items, orderData, cartData]);

  /* ================= PRODUCT MAP ================= */

  const productMap = useMemo(() => {
    if (!productsData) return {};
    const allProducts = Object.values(productsData).flat() as Product[];
    return allProducts.reduce<Record<string, Product>>((acc, p) => {
      acc[p._id] = p;
      return acc;
    }, {});
  }, [productsData]);

  /* ================= ENRICH ITEMS ================= */

  const enrichedItems: EnrichedItem[] = useMemo(() => {
    return resolvedItems
      .map((item) => {
        const product = productMap[item.productId];
        if (!product) return null;

        return {
          id: product._id,
          name: product.scrapName,
          image: product.imgUrl,
          rate: product.rate,
          weight: item.weight,
          price: +(product.rate * item.weight).toFixed(2),
          minWeight: product.minWeight,
        };
      })
      .filter(Boolean) as EnrichedItem[];
  }, [resolvedItems, productMap]);

  /* ================= CART STATE ================= */

  const [cart, setCart] = useState<EnrichedItem[]>([]);
  const userChangedCartRef = useRef(false);

  /* Sync cart ONLY from server / props */
  useEffect(() => {
    setCart(enrichedItems);
  }, [enrichedItems]);

  /* ================= UPSERT CART (SAFE) ================= */
  useEffect(() => {
    if (!userChangedCartRef.current) return;
    if (mode !== "cart" && mode !== "order") return;

    userChangedCartRef.current = false;

    const payload = {
      orderId,
      items: cart.map((i) => ({
        productId: i.id,
        scrapName: i.name,
        measureType: "weight",
        weight: i.weight,
      })),
    };

    (async () => {
      try {
        if (mode === "cart") {
          await upsertCart({ payload }).unwrap();
        }

        if (mode === "order" && orderId) {
          await updateOrderItems({ orderId, payload }).unwrap();
        }
      } catch (e: any) {
        if (e?.status === 403) {
          const captchaToken = await getCaptchaToken();

          if (mode === "cart") {
            await upsertCart({ payload, captchaToken }).unwrap();
          }

          if (mode === "order" && orderId) {
            await updateOrderItems({
              orderId,
              payload,
              captchaToken,
            }).unwrap();
          }
        }
      }
    })();
  }, [
    cart,
    mode,
    orderId,
    upsertCart,
    updateOrderItems,
    getCaptchaToken,
  ]);


  /* ================= HANDLERS ================= */

  const handleDelete = (id: string) => {
    if (!isEditable) return;
    userChangedCartRef.current = true;
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdate = (id: string, newWeight: number) => {
    if (!isEditable) return;
    userChangedCartRef.current = true;
    setCart((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              weight: newWeight,
              price: +(i.rate * newWeight).toFixed(2),
            }
          : i
      )
    );
  };

  /* ================= CLEAR CART ================= */

  const handleClearCart = async () => {
    try {
      await clearCart({}).unwrap();
      router.push("/");
    } catch (err: any) {
      if (err?.status === 403) {
        const captchaToken = await getCaptchaToken();
        await clearCart({ captchaToken }).unwrap();
        router.push("/");
      }
    }
  };

  /* ================= CREATE ORDER ================= */
  const handleOrderPickup = async () => {
    const payload = {
      isCustomOrder: false,
      items: cart.map((i) => ({
        productId: i.id,
        scrapName: i.name,
        measureType: "weight",
        weight: i.weight,
      })),
    };

    try {
      await createOrder({ payload }).unwrap();
      router.push("/");
    } catch (e: any) {
      if (e?.status === 403) {
        const captchaToken = await getCaptchaToken();
        await createOrder({ payload, captchaToken }).unwrap();
        router.push("/");
      }
    }
  };

  /* ================= TOTAL ================= */

  const total = cart.reduce((a, i) => a + i.price, 0);

  const handleFinalSell = async () => {
    if (!orderId) return;

    console.log(orderData)

    if (!orderData) {
      alert("Order is still loading. Please wait.");
      return;
    }

    if (orderData.status !== "Arrived") {
      alert("Order must be Arrived before final selling.");
      return;
    }

    const itemsPayload = {
      items: cart.map((i) => ({
        productId: i.id,
        scrapName: i.name,
        measureType: "weight",
        weight: i.weight,
      })),
    };

    try {
      // await updateOrderItems({ orderId, payload: itemsPayload }).unwrap();
      const res = await userUpdateOrderStatus({ payload: { orderId } }).unwrap();
      console.log(res)
    } catch (err: any) {
      if (err?.status === 403) {
        const captchaToken = await getCaptchaToken();

        await updateOrderItems({
          orderId,
          payload: itemsPayload,
          captchaToken,
        }).unwrap();

        await userUpdateOrderStatus({
          payload: { orderId },
          captchaToken,
        }).unwrap();
      }
    }
  };

  /* ================= UI ================= */

  return (
    <main className="bg-gray-50 text-gray-800 w-full flex justify-center">
      <div className="w-full max-w-lg bg-stone-100 rounded-xl p-2">

        <details open>
          <summary className="flex justify-between font-semibold">
            Price Details
            <button onClick={() => setHide(!hide)}>
              {hide ? <ChevronDown /> : <ChevronUp />}
            </button>
          </summary>
        </details>

        {!hide && (
          <div className="space-y-2">
            {cart.map((item) => (
              <ScrapItem
                key={item.id}
                {...item}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                disabled={!isEditable}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        {isEditable && mode === "cart" && (
          <div className="flex gap-3">
            <button
              onClick={handleOrderPickup}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl"
            >
              Order Pickup
            </button>
            <button
              onClick={handleClearCart}
              className="w-full mt-4 bg-red-600 text-white py-2 rounded-xl"
            >
              Clear Cart
            </button>
          </div>
        )}
        {mode === "order" && (
          <button onClick={handleFinalSell} className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl">
            Finally Sell
          </button>
        )}
      </div>
    </main>
  );
}
