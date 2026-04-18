"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mappls: any;
  }
}

const MAPPLS_KEY =
  process.env.NEXT_PUBLIC_MAPPLS_KEY ||
  "ee287c1a53dc92e27751abf2375968ef";

/* =========================
   SINGLETON SDK LOADER
========================= */
let sdkLoaded = false;

function loadScript(url: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR");

    if (document.getElementById(id)) return resolve();

    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.id = id;
    s.onload = () => resolve();
    s.onerror = reject;

    document.body.appendChild(s);
  });
}

async function loadMapplsSDK() {
  if (sdkLoaded) return;

  const sdkUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0`;
  const pluginUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk_plugins?v=3.0&libraries=getPinDetails`;

  await loadScript(sdkUrl, "mappls-sdk");
  await loadScript(pluginUrl, "mappls-plugin");

  sdkLoaded = true;
}

/* =========================
   MAIN COMPONENT
========================= */
export default function SearchAddress({ onSelect }: any) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [placeData, setPlaceData] = useState<any>(null);
  const [eLoc, setEloc] = useState("");

  /* =========================
     LOAD AUTOCOMPLETE
  ========================= */
  useEffect(() => {
    let pluginInstance: any = null;

    loadMapplsSDK()
      .then(() => {
        const mappls = window.mappls;
        const inputEl = inputRef.current;

        if (!mappls?.search || !inputEl) return;

        if (!inputEl.id) inputEl.id = "mappls-auto-input";

        pluginInstance = new mappls.search(
          inputEl,
          { region: "IND", height: 300 },
          (data: any[]) => {
            if (!data?.length) return;

            const p = data[0];

            /* ✅ BEST CASE: DIRECT LAT/LNG */
            if (p.latitude && p.longitude) {
              finalizeSelection({
                latitude: p.latitude,
                longitude: p.longitude,
                place: p,
              });
              return;
            }

            /* fallback to eLoc */
            setPlaceData(p);
            setEloc(p.eLoc || "");
          }
        );
      })
      .catch(console.error);

    return () => {
      pluginInstance?.destroy?.();
      pluginInstance?.close?.();
    };
  }, []);

  /* =========================
     FINALIZER
  ========================= */
  const finalizeSelection = ({
    latitude,
    longitude,
    place,
  }: any) => {
    const raw = `${place?.placeName || ""} ${
      place?.placeAddress || ""
    }`.trim();

    const match = raw.match(/\b\d{6}\b/);

    const geo = {
      address: raw,
      eLoc: place?.eLoc || null,
      pincode: match ? Number(match[0]) : null,
      latitude,
      longitude,
      coordinates: [longitude, latitude],
    };

    onSelect?.(geo);
  };

  /* =========================
     eLoc → LatLng (fallback only)
  ========================= */
  useEffect(() => {
    if (!eLoc) return;

    let cancelled = false;
    let attempts = 0;

    const tryFetch = () => {
      if (cancelled) return;

      if (attempts > 10) {
        console.error("getPinDetails timeout");
        return;
      }

      const mappls = window.mappls;

      if (!mappls?.getPinDetails) {
        attempts++;
        setTimeout(tryFetch, 300);
        return;
      }

      mappls.getPinDetails(
        { pin: eLoc },
        (data: any) => {
          if (cancelled) return;

          const coords = data?.marker?.obj?._lngLat;

          if (
            coords &&
            typeof coords.lng === "number" &&
            typeof coords.lat === "number"
          ) {
            finalizeSelection({
              latitude: coords.lat,
              longitude: coords.lng,
              place: placeData,
            });
          }
        }
      );
    };

    tryFetch();

    return () => {
      cancelled = true;
    };
  }, [eLoc]);

  /* =========================
     CURRENT LOCATION
  ========================= */
  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `/api/mappls/reverse?lat=${latitude}&lng=${longitude}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        const r0 = data?.results?.[0] || {};

        onSelect?.({
          address: r0.formatted_address || "",
          eLoc: r0.eLoc || null,
          pincode: r0.pincode ? Number(r0.pincode) : null,
          latitude,
          longitude,
          coordinates: [longitude, latitude],
        });
      } catch (err) {
        console.error("Reverse geocode failed", err);
      }
    });
  };

  return (
    <div className="mb-1">
      <input
        id="mappls-auto-input"
        ref={inputRef}
        type="text"
        className="w-full border rounded px-3 py-2"
        placeholder="Search places or eLoc..."
        autoComplete="off"
      />

      <button
        type="button"
        onClick={useCurrentLocation}
        className="mt-2 text-sm text-blue-600"
      >
        Use Current Location
      </button>
    </div>
  );
}


// "use client";
// import { useState } from "react";

// export default function SearchAddress({ onSelect }: any) {
//   const [q, setQ] = useState("");
//   const [list, setList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // 🔎 AUTOCOMPLETE
//   async function handleChange(v: string) {
//     setQ(v);

//     if (v.length < 3) {
//       setList([]);
//       return;
//     }

//     const r = await fetch(`/api/mappls/autocomplete?q=${v}`);
//     setList(await r.json());
//   }

//   // ✅ USER SELECTS SUGGESTION
//   async function selectSuggestion(item: any) {
//     setLoading(true);

//     const eloc = item.eLoc || item.placeId;

//     const r = await fetch(`/api/mappls/place?eloc=${eloc}`);
//     const d = await r.json();

//     const geo = {
//       address: d.placeName || item.placeName || "",
//       latitude: d.latitude ?? null,
//       longitude: d.longitude ?? null,
//       pincode: d.pincode ? Number(d.pincode) : null,
//       eLoc: eloc || "",
//       street: d.street || d.placeName || item.placeName || "",
//     };

//     onSelect(geo);

//     setQ(geo.address);
//     setList([]);
//     setLoading(false);
//   }

//   // 📍 CURRENT LOCATION
//   function useCurrentLocation() {
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       setLoading(true);

//       const { latitude, longitude } = pos.coords;

//       const r = await fetch(
//         `/api/mappls/reverse?lat=${latitude}&lng=${longitude}`
//       );
//       const d = await r.json();

//       const r0 = d.results?.[0] || {};

//       const geo = {
//         address: r0.formatted_address || "",
//         latitude,
//         longitude,
//         pincode: r0.pincode ? Number(r0.pincode) : null,
//         eLoc: r0.eLoc || "",
//         street: r0.street || r0.formatted_address || "",
//       };

//       onSelect(geo);

//       setQ(geo.address);
//       setList([]);
//       setLoading(false);
//     });
//   }

//   // ✏️ USER TYPED BUT DID NOT SELECT
//   async function useTypedAddress() {
//     if (!q) return;

//     setLoading(true);

//     const r = await fetch(`/api/mappls/geocode?address=${q}`);
//     const d = await r.json();

//     const r0 = d.results?.[0];

//     const geo = {
//       address: q,
//       latitude: r0?.latitude ?? null,
//       longitude: r0?.longitude ?? null,
//       pincode: null,
//       eLoc: "",
//       street: q,
//     };

//     onSelect(geo);

//     setLoading(false);
//   }

//   return (
//     <div className="relative">
//       <input
//         value={q}
//         onChange={(e) => handleChange(e.target.value)}
//         placeholder="Search address"
//         className="w-full border rounded px-3 py-2"
//       />

//       <div className="flex gap-2 mt-2">
//         <button
//           type="button"
//           onClick={useCurrentLocation}
//           className="text-sm text-blue-600"
//         >
//           Use Current Location
//         </button>

//         <button
//           type="button"
//           onClick={useTypedAddress}
//           className="text-sm text-gray-600"
//         >
//           Use Typed Address
//         </button>
//       </div>

//       {/* Suggestions */}
//       {list.length > 0 && (
//         <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto">
//           {list.map((item) => (
//             <li
//               key={item.eLoc}
//               onClick={() => selectSuggestion(item)}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {item.placeName}
//             </li>
//           ))}
//         </ul>
//       )}

//       {loading && (
//         <p className="text-sm text-gray-500 mt-1">Loading…</p>
//       )}
//     </div>
//   );
// }