"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AcceptButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    // 👉 BEST: use redirect param
    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/you/add-agent");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label>I agree / मैं सहमत हूँ</label>
      </div>

      <button
        disabled={!checked}
        onClick={handleAccept}
        className={`w-full mt-4 py-2 rounded text-white ${
          checked ? "bg-green-600" : "bg-gray-400"
        }`}
      >
        Accept & Continue
      </button>
    </div>
  );
}