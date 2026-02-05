"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { useGetCartQuery } from "../RTK Query/orderApi";
import { useCaptcha } from "../CommonCode/auth/captchaHook";

export default function ActionButtons() {
  const router = useRouter();
  const { getCaptchaToken } = useCaptcha();

  const [captchaToken, setCaptchaToken] = useState(null);

  const shouldSkip = captchaToken === "__BLOCKED__";
  const {
    data: cartResponse,
    error,
    isFetching,
  } = useGetCartQuery({ captchaToken }, { skip: shouldSkip });

  /* ---- captcha retry logic (IDENTICAL PATTERN) ---- */
  useEffect(() => {
    const runCaptcha = async () => {
      if (!error) return;

      const err = error;
      if (err?.status !== 403 || err?.data?.captcha_required !== true) return;

      const token = await getCaptchaToken("cart_access");
      if (!token) {
        setCaptchaToken("__BLOCKED__"); // temp block
        return;
      }

      setCaptchaToken(token);
    };

    runCaptcha();
  }, [error, getCaptchaToken]);

  const items = cartResponse?.items ?? [];
  const hasItems = items.length > 0;

  const handleViewCart = () => {
    if (!hasItems) return;
    router.push("/orders/mycart");
  };

  /* Hide button if empty or blocked */
  if (!hasItems || isFetching || captchaToken === "__BLOCKED__") return null;

  return (
    <div className="fixed bottom-16 w-full flex gap-3 justify-center items-center p-2 rounded-2xl">
      <button
        onClick={handleViewCart}
        className="flex w-[50%] max-w-[200px] items-center bg-green-600 hover:bg-green-700 text-white justify-evenly py-3 rounded-2xl shadow-md transition-transform hover:scale-105"
      >
        <ShoppingCart size={28} />
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-lg">View Cart</span>
          <span className="text-sm">{items.length} Items</span>
        </div>
      </button>
    </div>
  );
}
