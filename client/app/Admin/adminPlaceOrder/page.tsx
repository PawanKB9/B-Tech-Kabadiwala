"use client";

import { useState } from "react";
import { useGetProductsByCenterQuery } from "@/app/RTK Query/appApi";
import { useCreateUserByAdminMutation } from "@/app/RTK Query/userApi";
import { useCreateOrderMutation } from "@/app/RTK Query/orderApi";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";

import CustomerForm from "./customerForm";
import GeneralOrder, { GeneralOrderItem } from "./generalOrder";
import CustomOrder, { CustomOrderItem } from "./customOrder";

export default function AdminPlaceOrder() {
  /* ---------------- ORDER TYPE ---------------- */

  const [orderType, setOrderType] =
    useState<"general" | "custom">("general");

  /* ---------------- CUSTOMER ---------------- */

  const [customer, setCustomer] = useState<any>({
    name: "",
    phone: "",
    location: undefined,
  });

  const [savedUser, setSavedUser] = useState<any>(null);
  const [savingUser, setSavingUser] = useState(false);

  /* ---------------- ITEMS ---------------- */

  const [generalItems, setGeneralItems] =
    useState<GeneralOrderItem[]>([]);
  const [customItems, setCustomItems] =
    useState<CustomOrderItem[]>([]);

  /* ---------------- DATA ---------------- */

  const centerId = process.env.NEXT_PUBLIC_CENTERID as string;

  const { data: products } = useGetProductsByCenterQuery(
    { centerId },
    { skip: orderType !== "general" }
  );

  /* ---------------- API ---------------- */

  const [createUser] = useCreateUserByAdminMutation();
  const [createOrder] = useCreateOrderMutation();
  const { getCaptchaToken } = useCaptcha();

  /* ---------------- SAVE USER ---------------- */

  const saveUser = async () => {
    if (!customer?.name || !customer?.phone || !customer?.location) return;

    setSavingUser(true);

    const payload = {
      name: customer.name,
      phone: customer.phone,
      location: customer.location,
    };

    try {
      const user = await createUser({payload}).unwrap();
      console.log(user);
      setSavedUser(user);
    } catch (err: any) {
      if (err?.data?.code === "CAPTCHA_REQUIRED") {
        const captchaToken = await getCaptchaToken();
        const user = await createUser({
          ...payload,
          captchaToken,
        }).unwrap();
        setSavedUser(user);
      } else {
        throw err;
      }
    } finally {
      setSavingUser(false);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */

  const placeOrder = async () => {
    if (!savedUser) return;

    const items =
      orderType === "general" ? generalItems : customItems;

    if (items.length === 0) return;

    const payload = {
      isCustomOrder: orderType === "custom",
      userId: savedUser._id,
      items,
    };

    try {
      await createOrder(payload).unwrap();
    } catch (err: any) {
      if (err?.data?.code === "CAPTCHA_REQUIRED") {
        const captchaToken = await getCaptchaToken();
        await createOrder({ ...payload, captchaToken }).unwrap();
      } else {
        throw err;
      }
    }

    // reset after success
    setGeneralItems([]);
    setCustomItems([]);
    setSavedUser(null);
    setCustomer({ name: "", phone: "", location: undefined });
  };

  /* ---------------- UI ---------------- */

  const hasItems =
    orderType === "general"
      ? generalItems.length > 0
      : customItems.length > 0;

  return (
    <div className="space-y-4 py-16 text-gray-800 max-w-4xl mx-auto">
      {/* ORDER TYPE */}
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            checked={orderType === "general"}
            onChange={() => setOrderType("general")}
          />
          General Order
        </label>

        <label>
          <input
            type="radio"
            checked={orderType === "custom"}
            onChange={() => setOrderType("custom")}
          />
          Custom Order
        </label>
      </div>

      {/* CUSTOMER */}
      <CustomerForm
        customer={customer}
        setCustomer={setCustomer}
        onSave={saveUser}
        isSaving={savingUser}
        isSaved={!!savedUser}
      />

      {/* ITEMS (NEVER DISAPPEAR) */}
      {orderType === "general" && products && (
        <GeneralOrder
          products={products}
          items={generalItems}
          setItems={setGeneralItems}
        />
      )}

      {orderType === "custom" && (
        <CustomOrder
          items={customItems}
          setItems={setCustomItems}
        />
      )}

      {/* PLACE ORDER */}
      <button
        onClick={placeOrder}
        disabled={!savedUser || !hasItems}
        className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Place Order
      </button>
    </div>
  );
}
