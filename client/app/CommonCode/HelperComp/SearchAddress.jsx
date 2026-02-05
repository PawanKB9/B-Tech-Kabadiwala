"use client";

import { useEffect, useRef, useState } from "react";

const MAPPLS_KEY = process.env.NEXT_PUBLIC_MAPPLS_KEY || "ee287c1a53dc92e27751abf2375968ef";

// Utility to load a script only once and return a promise that resolves when loaded
function loadScript(url, id) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("Not in browser");
    if (document.getElementById(id)) return resolve();
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.id = id;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}

export default function SearchAddress({ onSelect }) {
  const searchInputRef = useRef(null);
  const [placeData, setPlaceData] = useState(null);
  const [eLoc, setEloc] = useState("");
  const [coordinates, setCoordinates] = useState(null); // [lng, lat]
  const lastProcessedEloc = useRef("");

  // ------------------ UPDATED EFFECT ------------------
  useEffect(() => {
    let pluginInstance = null;
    let mounted = true;

    // URLs — load map SDK first, then plugin for get/search
    const sdkUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0`;
    // plugin URL: explicit (search library included in plugin by default on many setups)
    const pluginUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk_plugins?v=3.0`;

    console.debug("[SearchAddress] starting to load Mappls SDK + search plugin");

    // Load SDK first, then plugin
    loadScript(sdkUrl, "mappls-map-sdk")
      .then(() => {
        console.debug("[SearchAddress] map SDK loaded:", sdkUrl);
        return loadScript(pluginUrl, "mappls-search-plugin");
      })
      .then(() => {
        console.debug("[SearchAddress] search plugin script loaded:", pluginUrl);

        // Wait for window.mappls.search and input element to exist.
        // Retry a few times (in case scripts attach slightly later or React double-invoke)
        const maxAttempts = 10;
        let attempt = 0;

        const tryInit = () => {
          attempt += 1;
          const hasSearch = !!window.mappls && typeof window.mappls.search === "function";
          const hasInput = !!searchInputRef.current;

          if (!mounted) return;

          if (hasSearch && hasInput) {
            console.debug("[SearchAddress] mappls.search ready and input present — creating plugin instance");
            try {
              pluginInstance = new window.mappls.search(
                searchInputRef.current,
                { region: "IND", height: 300 },
                (data) => {
                  console.debug("[SearchAddress] search callback fired:", data);
                  if (!data?.length) return;
                  const newPlace = data[0];
                  setPlaceData(newPlace);
                  setEloc(newPlace.eLoc || "");
                  setCoordinates(null);
                  console.info("[SearchAddress] selected place:", newPlace.placeName, newPlace.eLoc);
                }
              );
              console.debug("[SearchAddress] plugin instance created");
            } catch (err) {
              console.error("[SearchAddress] failed to instantiate search plugin:", err);
            }
            return;
          }

          if (attempt >= maxAttempts) {
            console.warn("[SearchAddress] giving up init after attempts. hasSearch:", hasSearch, "hasInput:", hasInput);
            return;
          }

          // Try again after short delay
          setTimeout(tryInit, 200 * attempt); // backoff
        };

        tryInit();
      })
      .catch((err) => {
        console.error("[SearchAddress] failed to load SDK/plugin:", err);
      });

    return () => {
      mounted = false;
      try {
        if (pluginInstance && typeof pluginInstance.destroy === "function") pluginInstance.destroy();
        if (pluginInstance && typeof pluginInstance.close === "function") pluginInstance.close();
      } catch (e) {}
    };
  }, []);

  // Combine placeData + coordinates -> final object and call onSelect
  useEffect(() => {
    if (!placeData || !eLoc || !coordinates) return;
    if (lastProcessedEloc.current === eLoc) return;

    lastProcessedEloc.current = eLoc;

    const address = `${placeData.placeName || ""} ${placeData.placeAddress || ""}`.trim();
    const pincodeMatch = address.match(/\b\d{6}\b/);

    const geo = {
      address,
      eLoc,
      pincode: pincodeMatch ? parseInt(pincodeMatch[0], 10) : null,
      latitude: Array.isArray(coordinates) ? coordinates[1] : null, // [lng, lat]
      longitude: Array.isArray(coordinates) ? coordinates[0] : null,
      coordinates, // [lng, lat]
    };

    console.info("[SearchAddress] final geo ready, calling onSelect:", geo);
    if (typeof onSelect === "function") {
      try {
        onSelect(geo);
      } catch (err) {
        console.error("[SearchAddress] onSelect threw error:", err);
      }
    } else {
      console.warn("[SearchAddress] onSelect is not a function");
    }

    setPlaceData(null);
    setEloc("");
    setCoordinates(null);
  }, [placeData, eLoc, coordinates, onSelect]);

  return (
    <div className="mb-1">
      <input
        type="text"
        id="auto"
        ref={searchInputRef}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search places or eLoc's..."
        spellCheck="false"
        autoComplete="off"
      />
      <HiddenMapElocToLatLng eLoc={eLoc} onLatLng={setCoordinates} />
    </div>
  );
}
// ----------------------------------------------------------------------
// HiddenMapElocToLatLng (updated): waits for SDK/plugin to be fully ready before calling getPinDetails
function HiddenMapElocToLatLng({ eLoc, onLatLng }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // mapReadyPromise will resolve when the hidden map is actually loaded (map 'load' event fired)
  const mapReadyPromiseRef = useRef(null);
  const mapReadyResolveRef = useRef(null);
  const lastFetchedEloc = useRef("");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // Create a promise that resolves when the hidden map is ready (or after a timeout as fallback)
    if (!mapReadyPromiseRef.current) {
      mapReadyPromiseRef.current = new Promise((resolve) => {
        mapReadyResolveRef.current = resolve;
        // safety fallback: resolve after 10s to avoid indefinite waiting
        setTimeout(() => {
          if (mapReadyResolveRef.current) {
            console.warn("[HiddenMap] map readiness fallback triggered after timeout");
            mapReadyResolveRef.current();
            mapReadyResolveRef.current = null;
          }
        }, 10000);
      });
    }

    // Global callback that the SDK will call via the URL callback param
    window.initHiddenMap = () => {
      if (!mapRef.current) {
        console.warn("[HiddenMap] initHiddenMap called but mapRef not present yet");
        // still resolve to allow getPinDetails attempts; user may not need a map instance
        if (mapReadyResolveRef.current) {
          mapReadyResolveRef.current();
          mapReadyResolveRef.current = null;
        }
        return;
      }

      try {
        // create hidden map instance (use same ordering as your working version)
        mapInstance.current = new window.mappls.Map(mapRef.current, { center: [28.61, 77.23], zoom: 5 });
        mapInstance.current.addListener("load", () => {
          console.debug("[HiddenMap] map load event fired");
          if (mapReadyResolveRef.current) {
            mapReadyResolveRef.current();
            mapReadyResolveRef.current = null;
          }
        });
        console.debug("[HiddenMap] map instance created");
      } catch (err) {
        console.error("[HiddenMap] error creating map instance:", err);
        // resolve anyway so the app can attempt getPinDetails (plugin might not require a map instance)
        if (mapReadyResolveRef.current) {
          mapReadyResolveRef.current();
          mapReadyResolveRef.current = null;
        }
      }
    };

    const sdkUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0&callback=initHiddenMap`;
    const detailsPluginUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk_plugins?v=3.0&libraries=getPinDetails`;

    console.debug("[HiddenMap] loading SDK:", sdkUrl);
    loadScript(sdkUrl, "mappls-map-sdk").catch((e) => console.error("[HiddenMap] map sdk load failed", e));
    // load the getPinDetails plugin; loadScript resolves when <script> tag is loaded (not necessarily when plugin attaches to window)
    loadScript(detailsPluginUrl, "mappls-plugin-sdk").catch((e) => console.error("[HiddenMap] map plugin load failed", e));

    return () => {
      mounted.current = false;
      // if unresolved, resolve to avoid leaving awaiting .then hanging
      if (mapReadyResolveRef.current) {
        mapReadyResolveRef.current();
        mapReadyResolveRef.current = null;
      }
      try {
        delete window.initHiddenMap;
      } catch (e) {}
    };
  }, []);

  // When eLoc changes wait for mapReadyPromise to resolve, then call getPinDetails
  useEffect(() => {
    if (!eLoc) return;

    // prevent duplicate fetches
    if (lastFetchedEloc.current === eLoc) {
      console.debug("[HiddenMap] already fetched this eLoc:", eLoc);
      return;
    }

    lastFetchedEloc.current = eLoc;

    let cancelled = false;
    const handler = setTimeout(async () => {
      if (!mounted.current) return;
      try {
        console.debug("[HiddenMap] waiting for map SDK & hidden map to be ready for eLoc:", eLoc);
        // await readiness (resolves either when map 'load' fired or fallback timeout)
        if (mapReadyPromiseRef.current) {
          await mapReadyPromiseRef.current;
        }
        if (cancelled || !mounted.current) return;

        console.debug("[HiddenMap] calling getPinDetails for eLoc:", eLoc);
        if (window.mappls && typeof window.mappls.getPinDetails === "function") {
          try {
            window.mappls.getPinDetails(
              { map: mapInstance.current, pin: eLoc },
              (data) => {
                console.debug("[HiddenMap] getPinDetails response:", data);
                try {
                  const coords = data?.marker?.obj?._lngLat;
                  if (coords && typeof coords.lng === "number" && typeof coords.lat === "number") {
                    console.info("[HiddenMap] coordinates found:", coords);
                    onLatLng([coords.lng, coords.lat]);
                  } else {
                    console.error("[HiddenMap] No valid coords returned for eLoc:", eLoc, data);
                    onLatLng(null);
                  }
                } catch (err) {
                  console.error("[HiddenMap] Error parsing getPinDetails response:", err);
                  onLatLng(null);
                }
              }
            );
          } catch (err) {
            console.error("[HiddenMap] getPinDetails call failed:", err);
            onLatLng(null);
          }
        } else {
          console.error("[HiddenMap] mappls.getPinDetails not available after SDK load for eLoc:", eLoc);
          onLatLng(null);
        }
      } catch (err) {
        console.error("[HiddenMap] unexpected error while getting pin details:", err);
        onLatLng(null);
      }
    }, 250); // small debounce

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [eLoc, onLatLng]);

  return (
    <div
      ref={mapRef}
      id="hidden-map"
      style={{ width: "0px", height: "0px", visibility: "hidden", position: "absolute" }}
    />
  );
}