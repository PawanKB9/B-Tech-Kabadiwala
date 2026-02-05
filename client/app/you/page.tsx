"use client";

import { useEffect, useState } from "react";

import ContactHelp from "../CommonCode/UiCode/contactHelp";
import ProfileCard from "../CommonCode/UiCode/topBar";
import YouNavigation from "./youNav";
import { useCaptcha } from "../CommonCode/auth/captchaHook";

import {
  useGetUserActivityStatsQuery,
} from "@/app/RTK Query/userApi";

export default function YouPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const { getCaptchaToken } = useCaptcha();

  const {
    data: activityStats,
    isLoading,
    error,
    refetch,
  } = useGetUserActivityStatsQuery(
    captchaToken ? { captchaToken } : {},
    { skip: blocked }
  );

  /* ---------------- CAPTCHA HANDLING ---------------- */

  useEffect(() => {
    const err: any = error;
    if (!err || err.status !== 403) return;

    if (err.data?.blocked) {
      setBlocked(true);
      return;
    }

    if (err.data?.captcha_required && !captchaToken) {
      (async () => {
        const token = await getCaptchaToken();
        if (!token) {
          setBlocked(true);
          return;
        }
        setCaptchaToken(token);
      })();
    }
  }, [error, captchaToken, getCaptchaToken]);

  /* Retry after captcha */
  useEffect(() => {
    if (captchaToken && !blocked) {
      refetch();
    }
  }, [captchaToken, blocked, refetch]);

  /* ---------------- SAFE FALLBACKS ---------------- */

  const totalEarned = activityStats?.totalEarned ?? 0;
  const thisMonth = activityStats?.thisMonth ?? 0;

  /* ---------------- BLOCKED STATE ---------------- */

  if (blocked) {
    return (
      <main className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-6 text-red-600 font-semibold">
          Temporarily blocked. Please try again later.
        </div>
      </main>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <main className="bg-zinc-100 h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide">
      <div className="p-1 flex flex-col mx-auto gap-6 max-w-3xl">
        {/* Profile */}
        <ProfileCard />

        {/* TOTAL EARNINGS */}
        <div className="w-full mb-6 text-lg flex gap-[7%] sm:gap-[12%] font-bold justify-between p-2 items-center rounded-2xl">
          <div className="bg-green-800 text-white w-[50%] p-3 rounded-xl">
            <div>Total Earned</div>
            <div>
              {isLoading ? "—" : `₹${totalEarned.toFixed(2)}`}
            </div>
          </div>

          <div className="bg-green-800 text-white w-[50%] p-3 rounded-xl">
            <div>This Month</div>
            <div>
              {isLoading ? "—" : `₹${thisMonth.toFixed(2)}`}
            </div>
          </div>
        </div>

        <ContactHelp />
        <YouNavigation />
      </div>
    </main>
  );
}
