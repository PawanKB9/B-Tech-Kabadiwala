'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LogOut } from "lucide-react";

export default function ProfileCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl my-0.5 shadow-md w-full ">
      {/* User Info */}
      <div>
        <h2 className="text-green-700  font-bold">Pawan Kumar 7518315870</h2>
        <p className="text-green-700 text-sm">Khagga Taal 208002</p>
      </div>

      {/* Profile Image & Dropdown */}
      <div className="relative">
        <Image
          src="/profile.jpg" // Replace with your actual image path in /public
          alt="Profile"
          width={50}
          height={50}
          className="rounded-full bg-green-500 cursor-pointer border-2 border-green-600"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute font-semibold right-0 mt-2 w-48 bg-white border border-green-200 rounded-xl shadow-lg overflow-hidden z-10">
            <button
              className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700"
              onClick={() => alert('Logout clicked')}
            >
              Change Password
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700"
              onClick={() => alert('Update Info clicked')}
            >
              Update Info
            </button>
            <button
              className="w-full flex justify-between text-left px-4 py-2 hover:bg-green-50 text-red-500"
              onClick={() => alert('Change Password clicked')}
            >
              <span>Logout</span> <LogOut className='text-red-500'/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
