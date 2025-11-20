'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SearchAddress from '@/app/ComonCode/HelperComp/SearchAddress';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center py-16 min-h-screen bg-gray-100 px-4">
      <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Phone*</label>
          <PhoneInput
            country={'in'}
            value={phone}
            onChange={(value) => setPhone(value)}
            inputProps={{ name: 'phone' }}
            containerStyle={{ width: '100%' }}
            inputStyle={{
              width: '100%',
              padding: '22px 44px',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              outline: 'none',
            }}
            buttonStyle={{
              border: 'none',
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
              background: 'transparent',
            }}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Address*</label>
          <SearchAddress />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-left text-gray-700 mb-1">Password*</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Button */}
        <button
          type="button"
          className="w-full text-xl font-bold bg-blue-600 border text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Verify Contact
        </button>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 text-lg font-bold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
