"use client";

import SearchAddress from "@/app/CommonCode/HelperComp/SearchAddress";

type Props = {
  customer: any;
  setCustomer: (v: any) => void;
  onSave: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
};

export default function CustomerForm({
  customer,
  setCustomer,
  onSave,
  isSaving = false,
  isSaved = false,
}: Props) {
  const handleLocationSelect = (geo: any) => {
    if (!geo?.latitude || !geo?.longitude) return;

    setCustomer((prev: any) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [geo.longitude, geo.latitude], // [lng, lat]
        address: geo.address || undefined,
        landmark: geo.landmark || undefined,
        street: prev.location?.street || undefined,
        pincode: geo.pincode ? Number(geo.pincode) : undefined,
        houseNo: prev.location?.houseNo
          ? Number(prev.location.houseNo)
          : undefined,
        eLoc: geo.eLoc || undefined,
      },
    }));
  };

  const canSave =
    customer?.name &&
    customer?.phone &&
    customer?.location?.coordinates;

  return (
    <div>
      <h1 className="font-semibold mb-2">Customer Info</h1>

      <div className="p-3 text-gray-800 rounded bg-zinc-50 grid grid-cols-3 gap-2">
        {/* Name */}
        <input
          placeholder="Name"
          className="border-2 p-1 rounded border-purple-700"
          value={customer?.name || ""}
          onChange={(e) =>
            setCustomer((s: any) => ({ ...s, name: e.target.value }))
          }
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          className="border-2 p-1 rounded border-purple-700"
          value={customer?.phone || ""}
          onChange={(e) =>
            setCustomer((s: any) => ({ ...s, phone: e.target.value }))
          }
        />

        {/* Address Search */}
        <SearchAddress onSelect={handleLocationSelect} />

        {/* Street */}
        <input
          placeholder="Street"
          className="border-2 p-1 rounded border-purple-700"
          value={customer?.location?.street || ""}
          onChange={(e) =>
            setCustomer((s: any) => ({
              ...s,
              location: {
                ...(s.location || {}),
                street: e.target.value || undefined,
              },
            }))
          }
        />

        {/* House Number */}
        <input
          placeholder="House No"
          type="number"
          className="border-2 p-1 rounded border-purple-700"
          value={customer?.location?.houseNo || ""}
          onChange={(e) =>
            setCustomer((s: any) => ({
              ...s,
              location: {
                ...(s.location || {}),
                houseNo: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              },
            }))
          }
        />
      </div>

      {/* SAVE USER */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={!canSave || isSaving}
          className={`px-4 py-2 rounded text-white ${
            isSaved
              ? "bg-green-700"
              : "bg-black disabled:bg-gray-400"
          }`}
        >
          {isSaving
            ? "Saving..."
            : isSaved
            ? "User Saved"
            : "Save User"}
        </button>

        {isSaved && (
          <span className="text-green-700 text-sm font-medium">
            ✓ User created successfully
          </span>
        )}
      </div>
    </div>
  );
}
