"use client";

import { useRef } from "react";
import { useMapplsSearch } from "./useMapplsSearch";

const MAPPLS_KEY = "ee287c1a53dc92e27751abf2375968ef";

export default function SearchAddress({ onSelect }) {
  const inputRef = useRef(null);
  const { loading, status } = useMapplsSearch(inputRef, MAPPLS_KEY, onSelect);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="search"
        placeholder="Search address or eLoc..."
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      <div className="text-xs text-gray-500 mt-1">
        {loading ? "Loading address helper…" : status}
      </div>
    </div>
  );
}