"use client";

import { useEffect, useRef, useMemo } from "react";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
import { useLazyGetProductsByCenterQuery } from "@/app/RTK Query/appApi";

import AdminPriceTable from "./PriceUpdate";
import WeightTable from "./TotalPurchase";

export default function AdminYouSection() {
  const { getCaptchaToken } = useCaptcha();

  const centerId = process.env.NEXT_PUBLIC_CENTERID;

  const [getProductsByCenter, { data: rawResponse }] =
    useLazyGetProductsByCenterQuery();

  // ---------------- guards ----------------
  const fetchedRef = useRef(false);
  const captchaTriedRef = useRef(false);

  // ================= FETCH =================
  useEffect(() => {
    if (!centerId) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    (async () => {
      try {
        const res: any = await getProductsByCenter({ centerId }).unwrap();
        console.log(res)

        if (res?.captcha_required && !captchaTriedRef.current) {
          captchaTriedRef.current = true;

          const captchaToken = await getCaptchaToken("products");
          if (!captchaToken) return;

          await getProductsByCenter({
            centerId,
            captchaToken,
          }).unwrap();
        }
      } catch (err) {
        console.error("Product fetch failed", err);
      }
    })();
  }, [centerId, getProductsByCenter, getCaptchaToken]);

  // ================= NORMALIZATION =================
  const products = useMemo(() => {
    if (!rawResponse) return [];
    return rawResponse["Daily Scraps"] ?? [];
  }, [rawResponse]);
  console.log(rawResponse)

  // ================= RENDER =================
  return (
    <div className="space-y-6">
      <AdminPriceTable products={products} />
      <WeightTable />
    </div>
  );
}
