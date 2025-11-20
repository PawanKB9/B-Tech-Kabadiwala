import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-hot-toast';
import OtpVerification from '../Forms/VerifyOtp';
import { useAdminSignUpMutation } from '../RTK Query/AdminApi';

const AdminSignUp = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passKey, setPassKey] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verify, setVerify] = useState(false);
  const [token, setToken] = useState('');
  const [joinNo, setJoinNo] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [adminSignUp] = useAdminSignUpMutation();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!password) newErrors.password = 'Password is required';
    if (!passKey) newErrors.passKey = 'PassKey is required';
    if (!aadharNo) newErrors.aadharNo = 'Aadhar number is required';
    if (!phone) newErrors.phone = 'Phone is required';
    if(!joinNo) newErrors.joinNo = 'Joining Later No is Required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setVerify(true);
  };

  useEffect(() => {
    if (!token?.length) return;

    (async () => {
      try {
        const response = await adminSignUp({ name, password, passKey, aadharNo, email, phone, token, }).unwrap();
        toast.success('Admin Registered Successfully!');
        navigate('/admin/login');
      } catch (err) {
        toast.error('Registration Failed');
        setErrors({ general: err?.data?.message || 'Unknown error' });
      }
    })();
  }, [token]);

  return (
    verify ? (
      <OtpVerification mobile={phone} setToken={setToken} />
    ) : (
      <div className="flex justify-center py-16 min-h-screen bg-gray-100 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Admin Sign Up</h2>

          <Input label="Name" value={name} onChange={setName} error={errors.name} />
          <Input label="Aadhar No" type="number" value={aadharNo} onChange={setAadharNo} error={errors.aadharNo} />
          <Input label="Email" value={email} onChange={setEmail} />

          <div className="mb-4">
            <label className="block text-left text-gray-700 mb-1">Phone*</label>
            <PhoneInput
              country={'in'}
              value={phone}
              onChange={(value) => setPhone(value)}
              inputProps={{ required: true }}
              containerStyle={{ width: '100%' }}
              inputStyle={{ width: '100%', padding: '22px 44px', fontSize: '1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              buttonStyle={{ border: 'none', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', background: 'transparent' }}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <PasswordInput label="Password" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} error={errors.password} />
          <Input label="PassKey" value={passKey} onChange={setPassKey} error={errors.passKey} />
          <Input label="Joining Later No" value={joinNo} onChange={setJoinNo} error={errors.joinNo} />

          <button type="submit" className="w-full text-xl font-bold bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Verify Contact</button>

          <div className="mt-6 text-center text-sm">
            Already an admin?{' '}
            <Link to="/admin/login" className="text-blue-500 text-lg font-bold hover:underline">Login</Link>
          </div>
        </form>
      </div>
    )
  );
};

const Input = ({ label, value, onChange, type = 'text', error }) => (
  <div className="mb-4">
    <label className="block text-left text-gray-700 mb-1">{label}*</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggle, error }) => (
  <div className="mb-4 relative">
    <label className="block text-left text-gray-700 mb-1">{label}*</label>
    <input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button type="button" onClick={toggle} className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-500">
      {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
    </button>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AdminSignUp;
