"use client";

import { useEffect, useState } from "react";
import { User, Phone, MapPin } from "lucide-react";

import { useGetUserDataQuery } from "../RTK Query/userApi";
import { useCaptcha } from "../CommonCode/auth/captchaHook";

/* ================= REUSABLE DETAIL ITEM ================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <Icon className="text-green-600 w-6 h-6 flex-shrink-0 mt-1" />
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-800 break-words mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

/* ================= COMPONENT ================= */

export default function OrderUserDetails() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const { getCaptchaToken } = useCaptcha();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetUserDataQuery(
    captchaToken ? { captchaToken } : {},
    { skip: blocked }
  );

  /* ================= CAPTCHA HANDLING ================= */

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

  /* Retry fetch after captcha token */
  useEffect(() => {
    if (captchaToken && !blocked) {
      refetch();
    }
  }, [captchaToken, blocked, refetch]);

  /* ================= STATES ================= */

  if (blocked) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-red-600 font-semibold">
            Temporarily blocked. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Loading user details…</p>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-red-500">Failed to load user details.</p>
        </div>
      </div>
    );
  }

  /* ================= NORMALIZE USER ================= */

  const user = {
    name: data.user.name ?? "—",
    phone: data.user.phone ?? "—",
    address:
      data.user.location?.address ||
      data.user.location?.street ||
      "—",
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
      <div className="bg-white rounded-2xl shadow p-6 lg:p-8 space-y-6 border border-gray-100">
        <div className="flex items-center border-b-2 border-green-500 pb-3">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Pickup Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem icon={User} label="Name" value={user.name} />
          <DetailItem icon={Phone} label="Contact Number" value={user.phone} />

          <div className="md:col-span-2 lg:col-span-3">
            <DetailItem
              icon={MapPin}
              label="Pickup Address"
              value={user.address}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
          This address will be used by the executive for scrap pickup.
        </p>
      </div>
    </div>
  );
}
