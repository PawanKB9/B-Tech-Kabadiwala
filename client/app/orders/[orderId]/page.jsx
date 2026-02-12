"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderTracker from "./tracker";
import PriceDetailsPage from "../priceDetails";
import { useGetActiveOrdersQuery, useGetOrderByIdQuery } from "@/app/RTK Query/orderApi";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
import GlobalLoader from "@/app/CommonCode/UiCode/GlobalLoader";

export default function TrackPage() {
  const { getCaptchaToken } = useCaptcha();
  const [captchaToken, setCaptchaToken] = useState(null);

  const params = useParams();
  const orderId = params.orderId;

  const { data: activeOrdersResponse } = useGetActiveOrdersQuery();

  const cachedOrder = activeOrdersResponse?.activeOrders?.find(
    (order) => order.id === orderId
  );

  const {
    data: orderResponse,
    error,
    isLoading,
  } = useGetOrderByIdQuery(
    { orderId, captchaToken },
    { skip: !!cachedOrder || !orderId }
  );

  useEffect(() => {
    if (!error) return;

    const err= error;

    if (err.status === 403 && err.data?.captcha_required === true) {
      (async () => {
        const token = await getCaptchaToken("order_access");

        if (!token) {
          setCaptchaToken("__BLOCKED__");
          return;
        }

        setCaptchaToken(token);
      })();
    }
  }, [error, getCaptchaToken]);

  const order = cachedOrder ?? orderResponse?.order;

  if (isLoading && !order) {
    return <GlobalLoader isLoading={isLoading || !order} />;
  }

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Oops! It seems Access blocked or order not found
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-56px)] scrollbar-hide pb-14 overflow-y-auto flex flex-col gap-6 p-3 bg-gray-50">
      <OrderTracker status={order?.status ?? "pickup"} />
      <PriceDetailsPage items={order.items} mode={"order"}/>
    </main>
  );
}
