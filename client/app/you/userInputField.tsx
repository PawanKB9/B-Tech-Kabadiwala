"use client";

import { useState } from "react";

interface UserInputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: string;
}

export default function UserInputField({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: UserInputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full mt-4">
      {/* Label on top border */}
      <label
        className={`absolute left-4 px-1 bg-gradient-to-b from-zinc-100 to-white text-sm transition-all duration-200 
          ${focused || value
            ? "-top-2 text-green-600 text-xs font-medium"
            : "-top-2 text-gray-500 text-xs font-medium"
          }`}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={focused ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 pt-4 pb-2 text-gray-800 border border-gray-300 rounded-xl 
                   focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none
                   transition-all duration-200 bg-white shadow-sm text-sm"
      />
    </div>
  );
}
