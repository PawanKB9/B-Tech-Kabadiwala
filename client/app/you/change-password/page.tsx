"use client";

import { useState } from "react";
import UserInputField from "../userInputField";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🔐 Password changed successfully!");
  };

  return (
    <main className="flex justify-center items-start min-h-screen bg-stone-100 sm:px-6 py-10">
      <div className="w-full max-w-xl rounded-3xl shadow-lg p-4 sm:p-8">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <UserInputField
            label="Old Password"
            type="password"
            value={formData.oldPassword}
            onChange={(val) => handleChange("oldPassword", val)}
          />

          <UserInputField
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(val) => handleChange("newPassword", val)}
          />

          <button
            type="submit"
            className="my-4 w-full bg-green-600 hover:bg-green-700 text-white 
                       font-semibold rounded-xl py-2 transition-all duration-200 
                       active:scale-95 shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
}
