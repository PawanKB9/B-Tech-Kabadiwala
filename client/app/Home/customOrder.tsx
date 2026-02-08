"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useCreateOrderMutation } from "../RTK Query/orderApi";
import { useGetUserDataQuery } from "../RTK Query/userApi";
import { useCaptcha } from "../CommonCode/auth/captchaHook";

type OrderItem = {
  productId?: string;
  scrapName: string;
  measureType: "piece" | "weight";
  piece?: number;
  weight?: number;
};

/* ---------------- INPUT ---------------- */
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: "text" | "number";
}) => (
  <div>
    <label className="block font-medium mb-1 text-gray-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-400 rounded-lg px-3 py-2"
    />
  </div>
);

/* ---------------- COMPONENT ---------------- */
export default function CustomOrderAccordion() {
  const [open, setOpen] = useState(false);

  /* ---------------- CAPTCHA STATE ---------------- */
  const [captchaToken, setCaptchaToken] =
    useState<string | undefined>();
  const isBlocked = captchaToken === "__BLOCKED__";

  const { getCaptchaToken } = useCaptcha();

  /* ---------------- FORM ---------------- */
  const [form, setForm] = useState({
    scrapName: "",
    category: "",
    orderType: "piece" as "piece" | "weight",
    piece: "1",
    weight: "",
  });

  const [items, setItems] = useState<OrderItem[]>([]);

  /* ---------------- USER DATA ---------------- */
  const {
    data: userRes,
    isFetching: isUserFetching,
    error: userError,
  } = useGetUserDataQuery(
    { captchaToken },
    { skip: isBlocked }
  );

  const userCaptchaTriedRef = useRef(false);

  /* USER DATA → CAPTCHA RETRY (ONCE) */
  useEffect(() => {
    if (!userRes?.captcha_required) return;
    if (userCaptchaTriedRef.current) return;

    userCaptchaTriedRef.current = true;

    (async () => {
      const token = await getCaptchaToken(
        "custom-order-user"
      );
      if (!token) {
        setCaptchaToken("__BLOCKED__");
        return;
      }
      setCaptchaToken(token);
    })();
  }, [userRes, getCaptchaToken]);

  /* ---------------- CREATE ORDER ---------------- */
  const [createOrder, createState] =
    useCreateOrderMutation();

  const createCaptchaTriedRef = useRef(false);

  /* ---------------- HELPERS ---------------- */
  const update = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const resetForm = () =>
    setForm({
      scrapName: "",
      category: "",
      orderType: "piece",
      piece: "1",
      weight: "",
    });

  /* ---------------- ADD ITEM ---------------- */
  const addItem = () => {
    if (!form.scrapName.trim()) return;

    const finalScrapName = form.category
      ? `${form.scrapName} - ${form.category}`
      : form.scrapName;

    if (form.orderType === "piece") {
      const pcs = Number(form.piece);
      if (!pcs || pcs <= 0) return;

      setItems((p) => [
        ...p,
        {
          scrapName: finalScrapName,
          measureType: "piece",
          piece: pcs,
        },
      ]);
    }

    if (form.orderType === "weight") {
      const wt = Number(form.weight);
      if (!wt || wt <= 0) return;

      setItems((p) => [
        ...p,
        {
          scrapName: finalScrapName,
          measureType: "weight",
          weight: wt,
        },
      ]);
    }

    resetForm();
  };

  const removeItem = (index: number) =>
    setItems((p) => p.filter((_, i) => i !== index));

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    if (!userRes?.user || items.length === 0 || isBlocked)
      return;

    try {
      const res: any = await createOrder({
        userId: userRes.user._id,
        centerId: userRes.user.centerId,
        location: userRes.user.location,
        items,
        isCustomOrder: true,
        captchaToken,
      }).unwrap();

      if (
        res?.captcha_required &&
        !createCaptchaTriedRef.current
      ) {
        createCaptchaTriedRef.current = true;

        const token = await getCaptchaToken(
          "custom-order-create"
        );
        if (!token) {
          setCaptchaToken("__BLOCKED__");
          return;
        }

        setCaptchaToken(token);
        return;
      }

      setItems([]);
      setOpen(false);
      setCaptchaToken(undefined);
    } catch (err) {
      console.error("Order creation failed", err);
    }
  };

  if (isBlocked) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        You are temporarily blocked. Please try again
        later.
      </div>
    );
  }

  if (isUserFetching || userError) return <DummyBox/>;

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full text-gray-800 max-w-3xl mx-auto my-4 px-2">
      <button
        className="w-full flex justify-between bg-green-600 text-white px-4 py-3 rounded-lg"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-lg font-semibold">
          Place Custom Scrap Order
        </span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      <div
        className={`transition-all  bg-white ${
          open
            ? "p-5 max-h-[1200px]"
            : "p-0 max-h-0 overflow-hidden"
        }`}
      >
        {open && (
          <div className="flex border-t flex-col gap-4">
            <Input
              label="Scrap Name"
              value={form.scrapName}
              onChange={(v) => update("scrapName", v)}
              placeholder="Plastic, Iron, Paper..."
            />

            <Input
              label="Category"
              value={form.category}
              onChange={(v) => update("category", v)}
              placeholder="Optional"
            />

            <div>
              <label className="block font-medium mb-1">
                Order Type
              </label>
              <div className="flex gap-3">
                {["piece", "weight"].map((t) => (
                  <button
                    key={t}
                    onClick={() => update("orderType", t)}
                    className={`flex-1 py-2 rounded border ${
                      form.orderType === t
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {t === "piece"
                      ? "By Piece"
                      : "By Weight"}
                  </button>
                ))}
              </div>
            </div>

            {form.orderType === "piece" && (
              <Input
                label="Pieces"
                type="number"
                value={form.piece}
                onChange={(v) => update("piece", v)}
                placeholder="Quantity"
              />
            )}

            {form.orderType === "weight" && (
              <Input
                label="Weight (kg)"
                type="number"
                value={form.weight}
                onChange={(v) => update("weight", v)}
                placeholder="Kg"
              />
            )}

            <button
              onClick={addItem}
              className="py-2 bg-blue-600 text-white rounded"
            >
              Add Item
            </button>

            {items.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">
                  Added Items
                </h4>

                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded mb-2"
                  >
                    <div>
                      <div className="font-medium">
                        {item.scrapName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.measureType === "piece"
                          ? `${item.piece} pcs`
                          : `${item.weight} kg`}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(i)}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={
                items.length === 0 ||
                createState.isLoading
              }
              onClick={placeOrder}
              className={`py-3 rounded text-white ${
                items.length === 0
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Order Pickup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function DummyBox(){

  return(
    <div className="bg-green-600 font-bold my-3 px-4 sm:max-w-2xl mx-auto rounded-lg py-2">
      Custom Order Form
    </div>
  )
}
