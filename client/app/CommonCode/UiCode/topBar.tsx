"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCaptcha } from "../auth/captchaHook";

import ImageWithFallback from "./avatarImg";
import {
  useGetUserDataQuery,
  useLogoutUserMutation,
} from "@/app/RTK Query/userApi";

export default function ProfileCard() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { getCaptchaToken } = useCaptcha();

  /* ---------------- CAPTCHA STATE ---------------- */
  const [userCaptchaToken, setUserCaptchaToken] =
    useState<string | undefined>();
  const isBlocked = userCaptchaToken === "__BLOCKED__";

  /* ---------------- RTK QUERY ---------------- */
  const {
    data,
    isFetching,
    error,
  } = useGetUserDataQuery(
    { captchaToken: userCaptchaToken },
    { skip: isBlocked }
  );

  const [logoutUser, { isLoading: isLoggingOut }] =
    useLogoutUserMutation();

  const user = data?.user;

  /* ---------------- GUARDS ---------------- */
  const userCaptchaTriedRef = useRef(false);
  const logoutCaptchaTriedRef = useRef(false);

  /* ---------------- USER DATA → CAPTCHA RETRY ---------------- */
  useEffect(() => {
    if (!data?.captcha_required) return;
    if (userCaptchaTriedRef.current) return;

    userCaptchaTriedRef.current = true;

    (async () => {
      const token = await getCaptchaToken("user-data");
      if (!token) {
        setUserCaptchaToken("__BLOCKED__");
        return;
      }
      setUserCaptchaToken(token);
    })();
  }, [data, getCaptchaToken]);

  /* ---------------- CLOSE DROPDOWN ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [open]);

  if (isFetching || error || !user) return <UnknownUser/>;

  /* ---------------- NAME + PHONE ---------------- */
  const namePhone = `${user.name} ${user.phone}`;

  /* ---------------- ADDRESS ---------------- */
  const location = user.location;
  let street = location?.street;

  if (!street && location?.address) {
    street = location.address
      .split(" ")
      .slice(0, 2)
      .join(" ");
  }

  const addressLine = `${street ?? ""} ${
    location?.pincode ?? ""
  }`.trim();

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    try {
      const res: any = await logoutUser({
        captchaToken: userCaptchaToken,
      }).unwrap();

      if (
        res?.captcha_required &&
        !logoutCaptchaTriedRef.current
      ) {
        logoutCaptchaTriedRef.current = true;

        const token = await getCaptchaToken("logout");
        if (!token) {
          setUserCaptchaToken("__BLOCKED__");
          return;
        }

        await logoutUser({
          captchaToken: token,
        }).unwrap();
      }

      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl my-0.5 shadow-md w-full">
      {/* User Info */}
      <div>
        <h2 className="text-green-700 font-bold">
          {namePhone}
        </h2>
        <p className="text-green-700 text-sm">
          {addressLine}
        </p>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setOpen((p) => !p)}>
          <ImageWithFallback
            image=""
            name={user.name}
            width={50}
            height={50}
            className="rounded-full bg-green-500 cursor-pointer border-2 border-green-600"
          />
        </button>

        {open && (
          <div className="absolute font-semibold right-0 mt-2 w-48 bg-white border border-green-200 rounded-xl shadow-lg overflow-hidden z-10">
            <button
              className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700"
              onClick={() => {
                router.push("/you/change-password");
                setOpen(false);
              }}
            >
              Change Password
            </button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700"
              onClick={() => {
                router.push("/you/updateUserInfo");
                setOpen(false);
              }}
            >
              Update Info
            </button>

            <button
              disabled={isLoggingOut}
              className="w-full flex justify-between text-left px-4 py-2 hover:bg-green-50 text-red-500 disabled:opacity-50"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <LogOut className="text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UnknownUser(){
   return(
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl my-0.5 shadow-md w-full">
      {/* User Info */}
      <div>
        <h2 className="text-green-700 font-bold">
          Unknown User
        </h2>
        <p className="text-green-700 text-sm">
          User is Not loged in Please do Login or Signup...
        </p>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative">
          <ImageWithFallback
            image=""
            name={'Unknown'}
            width={50}
            height={50}
            className="rounded-full bg-green-500 cursor-pointer border-2 border-green-600"
          />
      </div>
    </div>
   )
}
