"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
import {  useLazyGetCenterByIdQuery } from '@/app/RTK Query/appApi'
import {
  useGetUserDataQuery,
  useLogoutUserMutation,
} from "@/app/RTK Query/userApi";

import AdminUserDetails from "./userDetails";
import CenterDetails from "./center";

export default function AdminPanel() {
  const router = useRouter();
  const { getCaptchaToken } = useCaptcha();

  /* ---------------- CAPTCHA STATE ---------------- */
  const [userCaptchaToken, setUserCaptchaToken] =
    useState<string | undefined>();

  /* ---------------- USER (ADMIN) DATA ---------------- */
  const {
    data: userRes,
    isFetching: isUserFetching,
    error: userError,
  } = useGetUserDataQuery({
    captchaToken: userCaptchaToken,
  });

  /* ---------------- CENTER ---------------- */
  const [getCenterById, { data: centerRes }] =
    useLazyGetCenterByIdQuery();

  /* ---------------- LOGOUT ---------------- */
  const [logoutUser] = useLogoutUserMutation();

  /* ---------------- GUARDS ---------------- */
  const userCaptchaTriedRef = useRef(false);
  const centerFetchedRef = useRef(false);
  const centerCaptchaTriedRef = useRef(false);

    //  USER DATA → CAPTCHA RETRY (ONLY ONCE)
  useEffect(() => {
    if (!userRes?.captcha_required) return;
    if (userCaptchaTriedRef.current) return;

    userCaptchaTriedRef.current = true;

    (async () => {
      const captchaToken = await getCaptchaToken("admin-user-data");
      if (!captchaToken) return;

      // changing arg triggers refetch (correct RTK pattern)
      setUserCaptchaToken(captchaToken);
    })();
  }, [userRes, getCaptchaToken]);

    //  CENTER FETCH (ONCE + OPTIONAL CAPTCHA RETRY)
  useEffect(() => {
    const centerId = userRes?.user?.centerId;
    if (!centerId) return;

    //HARD STOP — prevents infinite calls
    if (centerFetchedRef.current) return;
    centerFetchedRef.current = true;

    (async () => {
      try {
        const res: any = await getCenterById({ id: centerId }).unwrap();

        // Retry ONCE with captcha
        if (res?.captcha_required && !centerCaptchaTriedRef.current) {
          centerCaptchaTriedRef.current = true;

          const captchaToken = await getCaptchaToken("admin-center");
          if (!captchaToken) return;

          await getCenterById({
            id: centerId,
            captchaToken,
          }).unwrap();
        }
      } catch (err) {
        console.error("Center fetch failed", err);
      }
    })();
  }, [userRes?.user?.centerId, getCenterById, getCaptchaToken]);

    //  LOGOUT
  const handleLogout = async () => {
    try {
      const res: any = await logoutUser({}).unwrap();

      if (res?.captcha_required) {
        const captchaToken = await getCaptchaToken("logout");
        if (!captchaToken) return;

        await logoutUser({ captchaToken }).unwrap();
      }

      router.push("/Admin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  /* ---------------- UI STATES ---------------- */
  if (isUserFetching) {
    return <p className="text-center mt-10">Loading dashboard…</p>;
  }

  if (userError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Access denied
      </p>
    );
  }
  console.log(userRes)
  console.log(centerRes)

  /* ---------------- RENDER ---------------- */
  return (
    <div className="mt-4 h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide bg-stone-100 mx-auto px-4 py-6 space-y-6">
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <LogOut size={18} /> Logout
      </button>

      <AdminUserDetails admin={userRes?.user} />
      <CenterDetails center={centerRes} />
    </div>
  );
}



// use this Component to Show data for any other Admin user
// <AdminUserDetails admin={dummyAdmin} />