"use client";

import { useEffect, useState } from "react";
import PriceDetailsPage from "../priceDetails";
import { useGetCartQuery } from "@/app/RTK Query/orderApi";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
import GlobalLoader from "@/app/CommonCode/UiCode/GlobalLoader";

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
    return <GlobalLoader isLoading={isLoading} />;
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
