import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useAdminLogInMutation } from '../RTK Query/AdminApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { selectGetAdminProfileResult } from '../RTK Query/Selectors.jsx'

const AdminLoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [loginAdmin] = useAdminLogInMutation();
  const { data: adminData } = useSelector(selectGetAdminProfileResult) || {};
  const navigate = useNavigate();

  // Navigate after adminData is updated in Redux
  useEffect(() => {
    if (isLoggingIn && adminData) {
      toast.success('Admin login successful');
      navigate('/admin/orders');
    }
  }, [isLoggingIn, adminData, navigate]);

  //validation
  const validate = () => {
    const newErrors = {};
    if (!phone) newErrors.phone = 'Phone is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // trigger login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const mob = '91' + phone;
      const res = await loginAdmin({ phone: mob, password }).unwrap();
      setIsLoggingIn(true); // triggers useEffect
      setPhone('');
      setPassword('');
      // console.log(res);
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid admin credentials');
      // console.error('Login error:', err);
    }
  };

  return (
    <div className="flex justify-center py-24 min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-1">Phone*</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="mb-6 relative">
          <label className="block text-left text-gray-700 mb-1">Password*</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-600"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 my-6 text-lg font-bold text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
