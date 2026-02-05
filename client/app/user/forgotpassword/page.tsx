"use client"

import React, { useState ,useEffect} from 'react';
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react';
// import { useForgotPasswordMutation } from '../RTK Query/UserApi.jsx';
import OtpVerification from '../../CommonCode/auth/OtpVerification';
import { toast } from 'react-hot-toast';


const ForgotPasswordForm = () => {

  const [errors, setErrors] = useState<Errors>({});
  const [showNewPassword ,setShowNewPassword] = useState(false);
  

  const [phone , setPhone] = useState('');
  const [password , setPassword] = useState('')
  const [verify , setVerify ] = useState(false);
  const [token ,setToken] = useState('');

//   const [forgotPassword] = useForgotPasswordMutation();
  const router = useRouter(); 
  const strength = getPasswordStrength(password);

  type Errors = {
    phone?:string;
    password?:string;
    general?:string;
  }
  const validate = () => {
   const newErrors: Errors = {};
   if (!phone) newErrors.phone = 'Phone is required';
   if (!password) newErrors.password = 'New password is required';
   return newErrors;
 };

 useEffect(()=>{
     if (!token?.length) return;
 
     ;(async () => {
       try {
        //  await forgotPassword({ phone, password ,token }).unwrap();
         toast.success('Password Reset Sucessfully!')
        //  console.log('Password Updated:');
         setPassword('');
         setPhone('');
         router.push('/');
       } catch (err:any) {
        setVerify(false);
        //  console.error('Failed Updation:', err);
         toast.error('Reset failed!');
         if (err.data && err.data.errors) {
           setErrors(err.data.errors);
         } else {
           setErrors({ general: 'An error occurred during sign up' });
         }
       }
     })();
   },[token])
 
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if(!phone || !password){
      setErrors(validationErrors);
      return;
    }
    setPhone('91' + phone)
    setVerify(true);

  }

  return (
    <>
    {verify ? <OtpVerification mobile={phone} setToken={setToken} /> : <div className="flex justify-center min-h-screen pt-24 pb-42 bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-1">Phone*</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* New Password */}
        <div className="mb-6 relative">
          <label className="block text-left text-gray-700 mb-1">New Password*</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            onChange={(e) => setPassword(e.target.value)} value={password}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-600"
          >
            {showNewPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>

          {/* Password Strength */}
          <div className="mb-4">
            {password && (
              <p className={`text-sm font-medium ${strength.color}`}>
                Strength: {strength.label}
              </p>
            )}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

        </div>

        <button
          type="submit"
          className="w-full text-xl font-bold bg-blue-600 text-white py-2 my-6 rounded hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </form>
    </div>}
    </>
    
  );
};

const getPasswordStrength = (password:string) => {
  if (password.length < 6) return { label: 'Too short', color: 'text-red-500' };
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
    return { label: 'Strong', color: 'text-green-600' };
  if (password.match(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/))
    return { label: 'Moderate', color: 'text-yellow-600' };
  return { label: 'Weak', color: 'text-red-500' };
};

export default ForgotPasswordForm;