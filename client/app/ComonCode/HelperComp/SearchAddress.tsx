"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../Contexts/UserContext";

// Extend global window for Mappls SDK
declare global {
  interface Window {
    mappls?: any; // You can refine this later if you want stronger types
    initMap?: () => void;
  }
}

const SearchAddress: React.FC = () => {
  const { location, setLocation } = useUser();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [eLoc, setEloc] = useState<string>("");
  const [placeData, setPlaceData] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const scriptPlugin = document.createElement("script");
    scriptPlugin.src = `https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_TOKEN}/map_sdk_plugins?v=3.0`;
    scriptPlugin.async = true;
    document.body.appendChild(scriptPlugin);

    scriptPlugin.onload = () => {
      const optionalConfig = {
        region: "IND",
        height: 300,
      };

      if (window.mappls?.search && searchInputRef.current) {
        new window.mappls.search(searchInputRef.current, optionalConfig, callback);
      }
    };

    const callback = (data: any[]) => {
      const inputValue = searchInputRef.current?.value?.trim() || "";
      if (!inputValue || !data?.length) return;

      setPlaceData(data[0]);
      setEloc(data[0].eLoc);
    };

    return () => {
      document.body.removeChild(scriptPlugin);
    };
  }, []);

  useEffect(() => {
    if (!placeData || !coordinates) return;

    const address = `${placeData.placeName} ${placeData.placeAddress}`;
    const pincodeMatch = address?.match(/\b\d{6}\b/);
    const pincode = pincodeMatch ? parseInt(pincodeMatch[0]) : null;

    setLocation({
      address,
      eLoc,
      pincode,
      coordinates,
    });
  }, [placeData, coordinates, eLoc, setLocation]);

  return (
    <div className="mb-1">
      <input
        type="text"
        ref={searchInputRef}
        className="search-outer form-control as-input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search places or eLoc's..."
        spellCheck="false"
      />
      <HiddenMapElocToLatLng eLoc={eLoc} setCoordinates={setCoordinates} />
    </div>
  );
};

export default SearchAddress;

interface HiddenMapProps {
  eLoc: string;
  setCoordinates: (coords: [number, number]) => void;
}

export const HiddenMapElocToLatLng: React.FC<HiddenMapProps> = ({ eLoc, setCoordinates }) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPPLS_TOKEN;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load SDK
  useEffect(() => {
    const scriptId1 = "mappls-map-sdk";
    const scriptId2 = "mappls-plugin-sdk";

    if (!document.getElementById(scriptId1)) {
      const mapScript = document.createElement("script");
      mapScript.src = `https://apis.mappls.com/advancedmaps/api/${accessToken}/map_sdk?layer=vector&v=3.0&callback=initMap`;
      mapScript.id = scriptId1;
      mapScript.async = true;
      document.body.appendChild(mapScript);
    }

    if (!document.getElementById(scriptId2)) {
      const pluginScript = document.createElement("script");
      pluginScript.src = `https://apis.mappls.com/advancedmaps/api/${accessToken}/map_sdk_plugins?v=3.0&libraries=getPinDetails`;
      pluginScript.id = scriptId2;
      pluginScript.async = true;
      document.body.appendChild(pluginScript);
    }

    window.initMap = () => {
      if (!mapRef.current || !window.mappls) return;

      mapInstance.current = new window.mappls.Map(mapRef.current, {
        center: [28.61, 77.23],
        zoom: 5,
      });

      mapInstance.current.addListener("load", () => {
        setSdkReady(true);
      });
    };
  }, [accessToken]);

  // Convert eLoc to coordinates
  useEffect(() => {
    if (!sdkReady || !eLoc || !eLoc.length || isLoaded) return;

    setIsLoaded(true);

    window.mappls?.getPinDetails(
      {
        map: mapInstance.current,
        pin: eLoc,
      },
      (data: any) => {
        try {
          const coords = data?.marker?.obj?._lngLat;
          if (coords) {
            setCoordinates([coords.lng, coords.lat]);
          }
        } catch (err) {
          console.error("❌ Error parsing pin details:", err);
        }
      }
    );
  }, [sdkReady, eLoc, isLoaded, setCoordinates]);

  return (
    <div
      ref={mapRef}
      id="hidden-map"
      style={{
        width: "0px",
        height: "0px",
        visibility: "hidden",
        position: "absolute",
      }}
    />
  );
};
