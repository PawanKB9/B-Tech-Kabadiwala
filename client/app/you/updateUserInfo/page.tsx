"use client";

import { useState } from "react";
import UserInputField from "../userInputField";

export default function UpdateUserInfo() {
  const [userData, setUserData] = useState({
    name: "Pawan Kumar Bind",
    currentAddress: "Cur Address",
    newAddress: "",
    phone: "Cur Phone No.",
    alternateContact: "",
    email: "",
  });
    const [street, setStreet] = useState('')
    const [houseNo, setHouseNo] = useState("");

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ User info updated successfully!");
  };

  return (
    <main className="flex justify-center items-start min-h-screen bg-stone-100 sm:px-6 py-10">
      <div className="w-full max-w-xl rounded-3xl shadow-lg p-4 sm:p-8">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Update User Info
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <UserInputField
            label="Full Name"
            value={userData.name}
            onChange={(val) => handleChange("name", val)}
          />
          <UserInputField
            label="Current Address"
            value={userData.currentAddress}
            onChange={(val) => handleChange("currentAddress", val)}
          />
          {/* more info for Address */}
          <div className="mb-3 relative">
            <label className="block text-gray-700 mb-1">House/Flat No.</label>
            <input
              type="text"
              placeholder="House/Flat No.: Not Compulsary"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Street Gali */}
          <div className="mb-3 relative">
            <label className="block text-gray-700 mb-1">Street</label>
            <input type='text' placeholder='Gali/Mohalla: Not Compulsary' value={street} onChange={(e) => setStreet(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>

          <UserInputField
            label="Current Phone No."
            value={userData.phone}
            onChange={(val) => handleChange("phone", val)}
          />
          <UserInputField
            label="Alternate Contact"
            value={userData.alternateContact}
            onChange={(val) => handleChange("alternateContact", val)}
          />
          <UserInputField
            label="Add Email"
            value={userData.email}
            onChange={(val) => handleChange("email", val)}
          />

          <button
            type="submit"
            className="my-4 w-full bg-green-600 hover:bg-green-700 text-white 
               font-semibold rounded-xl py-2 transition-all duration-200 active:scale-95 shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
