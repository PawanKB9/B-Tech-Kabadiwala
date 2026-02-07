import { useEffect, useRef, useState } from "react";
import { ensureMapplsPluginsLoaded } from "./mapplsLoader";

export function useMapplsSearch(inputRef, apiKey, onSelect) {
  const lastSelectedRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  // This effect sets ready=true when inputRef.current exists
  useEffect(() => {
    if (inputRef.current && !ready) {
      setReady(true);
    }
  }, [inputRef.current, ready]);

  useEffect(() => {
    if (!apiKey) {
      setStatus("Missing Mappls key");
      setLoading(false);
      return;
    }

    if (!ready) {
      setStatus("Input not ready");
      setLoading(true);
      return;
    }

    let searchInstance = null;
    let mounted = true;

    ensureMapplsPluginsLoaded(apiKey)
      .then(() => {
        if (!mounted) return;

        searchInstance = new window.mappls.search(
          inputRef.current,
          { region: "IND", height: 320 },
          (data) => {
            const value = inputRef.current?.value?.trim() || "";
            if (!value || !data?.length) {
              setStatus("No value or empty results");
              return;
            }

            const selected = data[0];
            if (!selected?.eLoc) {
              setStatus("No eLoc data in selection");
              return;
            }

            if (lastSelectedRef.current === selected.eLoc) return;
            lastSelectedRef.current = selected.eLoc;

            setStatus("Resolving location...");

            window.mappls.getPinDetails({ pin: selected.eLoc }, (resp) => {
              let coords =
                resp?.place?.geometry?.coordinates ??
                (resp?.marker?.obj?._lngLat
                  ? [resp.marker.obj._lngLat.lng, resp.marker.obj._lngLat.lat]
                  : null);

              if (!coords) {
                setStatus("Could not fetch coordinates");
                return;
              }

              const address = `${selected.placeName || ""} ${selected.placeAddress || ""}`.trim();
              const pincodeMatch = address.match(/\b\d{6}\b/);
              const pincode = pincodeMatch ? parseInt(pincodeMatch[0], 10) : null;

              const geo = {
                type: "Point",
                coordinates: [coords[0], coords[1]],
                address,
                pincode,
                eLoc: selected.eLoc,
              };

              setStatus("Location selected");
              if (typeof onSelect === "function") onSelect(geo);
            });
          }
        );

        setLoading(false);
        setStatus("Type address or eLoc…");
      })
      .catch((err) => {
        setStatus("Failed to load map plugin");
        setLoading(false);
        if (process.env.NODE_ENV !== "production") {
          console.error("Mappls plugin error:", err);
        }
      });

    return () => {
      mounted = false;
      try {
        searchInstance?.close?.();
      } catch {}
    };
  }, [apiKey, onSelect, ready, inputRef]);

  return { loading, status };
}