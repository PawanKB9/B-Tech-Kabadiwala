// "use client"

// import { useState, useRef, useEffect } from 'react'
// import { Eye, EyeOff } from 'lucide-react'
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'
// import SearchAddress from '../HelperComp/SearchAddress'

// import { useRequestOtpMutation } from '@/app/RTK Query/appApi'
// import { useCreateUserMutation ,useLazyGetUserDataQuery } from '@/app/RTK Query/userApi'

// import OtpVerification from './OtpVerification'
// import { useCaptcha } from './captchaHook'

// export default function SignUpPage() {
//   const [name, setName] = useState<string>('')
//   const [street, setStreet] = useState<string>('')
//   const [houseNo, setHouseNo] = useState<string>("")
//   const [pincode, setPincode] = useState<string>("")
//   const [password, setPassword] = useState<string>('')
//   const [phone, setPhone] = useState<string>('')
//   const [showPassword, setShowPassword] = useState(false)

//   const [otpSessionId, setOtpSessionId] = useState<string | null>(null)
//   const [lockedPhone, setLockedPhone] = useState<string | null>(null)
//   const [otpToken, setOtpToken] = useState<string | null>(null)
//   const [isAutoCreatingUser, setIsAutoCreatingUser] = useState(false)

//   const [requestOtp, { isLoading: otpLoading }] = useRequestOtpMutation()
//   const [createUser, { isLoading: createLoading }] = useCreateUserMutation()
//   const [getUserData, { isFetching, error }] = useLazyGetUserDataQuery()

//   const { getCaptchaToken } = useCaptcha()

//   const [location, setLocation] = useState({
//     address: '',
//     latitude: null,
//     longitude: null,
//     pincode: null,
//     eLoc: '',
//   })

//   const latestLocationRef = useRef(location)

//   const handleLocationSelect = (geo: any) => {
//     if (!geo) return
//     setLocation(geo)
//     latestLocationRef.current = geo
//   }

//   // --------------------------- OTP REQUEST + CAPTCHA LOGIC ---------------------------
//   const handleSubmit = async (e: any) => {
//     e.preventDefault()

//     const loc = latestLocationRef.current
//     if (!loc?.address) {
//       alert("Select address before continuing")
//       return
//     }

//     const payload = {
//       name,
//       phone,
//       password,
//       address: loc.address,
//       latitude: loc.latitude,
//       longitude: loc.longitude,
//       pincode: loc.pincode,
//       eLoc: loc.eLoc,
//       street,
//       houseNo
//     }

//     try {
//       // First normal request
//       const res: any = await requestOtp({ payload }).unwrap()
//       console.log(res);

//       // -------- Medium Risk → Captcha Required --------
//       if (res?.captcha_required) {
//         const token = await getCaptchaToken("otp_request")
//         if (!token) {
//           alert("Captcha failed")
//           return
//         }

//         const retry: any = await requestOtp({
//           payload,
//           captchaToken: token
//         }).unwrap()

//         setOtpSessionId(retry?.otp_session_id)
//         setLockedPhone(retry?.phone)
//         return
//       }

//       // -------- Normal Flow --------
//       setOtpSessionId(res?.otp_session_id)
//       setLockedPhone(res?.phone)

//     } catch (err: any) {
//       if (err?.status === 403) {
//         alert("Blocked due to high risk")
//       } else {
//         alert("Failed to request OTP")
//       }
//     }
//   }

//   // --------------------------- FINAL CREATE USER ---------------------------
//   const handleCreateUser = async () => {
//     const loc = latestLocationRef.current;

//     if (!otpToken || !otpSessionId) {
//       alert("OTP not verified");
//       return;
//     }

//     if (
//       loc?.latitude == null ||
//       loc?.longitude == null
//     ) {
//       alert("Invalid location selected");
//       return;
//     }

//     const payload = {
//       name,
//       password,
//       phone: lockedPhone,
//       role: "customer",

//       location: {
//         type: "Point",
//         coordinates: [Number(loc.longitude), Number(loc.latitude)], // [lng, lat]
//         address: loc.address ?? undefined,
//         street: street || undefined,
//         pincode: loc.pincode ? Number(loc.pincode) : pincode ? pincode : undefined,
//         houseNo: houseNo ? Number(houseNo) : undefined,
//         eLoc: loc.eLoc || undefined,
//       },
//     };

//     try {
//       // Try to get captcha token, but don't fail if it errors
//       let captchaToken = undefined;
//       try {
//         captchaToken = await getCaptchaToken("user_create");
//       } catch (captchaErr: any) {
//         console.warn("⚠️ Captcha token error (continuing without it):", captchaErr?.message);
//         // Continue without captcha token
//       }

//       const res: any = await createUser({
//         payload,
//         otpToken,
//         otpSessionId,
//         captchaToken: captchaToken ?? undefined,
//       }).unwrap();

//       // Store token from response
//       let signupToken = res?.token
//       if (res?.token) {
//         localStorage.setItem('token', res.token)
//         console.log('✅ Token stored from signup:', res.token.substring(0, 20) + '...')
//       }

//       // ✅ SKIP getUserData for newly created users - they don't need immediate data fetch
//       // The user data will be fetched on the next page/navigation
      
//       alert("User created successfully!");
//       console.log("User Created:", res);
      
//       // Optionally redirect to dashboard or next page here
//       // For now, just clear the signup state
//       setIsAutoCreatingUser(false);
      
//     } catch (err: any) {
//       console.error("❌ createUser failed:", err?.status, err?.data, err);
//       const errorMsg = err?.data?.error || err?.data?.message || "Failed to create user";
//       alert(`Failed to create user: ${errorMsg}`);
//       setIsAutoCreatingUser(false);
//     }
//   };

//   // ======================== AUTO-CREATE USER AFTER OTP VERIFICATION ========================
//   useEffect(() => {
//     if (otpSessionId && lockedPhone && otpToken && !isAutoCreatingUser) {
//       setIsAutoCreatingUser(true)
//       handleCreateUser()
//     }
//   }, [otpToken, otpSessionId, lockedPhone, isAutoCreatingUser])

//   const isLocationSelected = Boolean(latestLocationRef.current?.address)

//   // --------------------------- OTP SCREEN ---------------------------
//   if (otpSessionId && lockedPhone && !otpToken) {
//     return (
//       <OtpVerification
//         mobile={lockedPhone}
//         sessionId={otpSessionId}
//         setToken={(token: string) => setOtpToken(token)}
//       />
//     )
//   }

//   // --------------------------- CREATING USER SCREEN (AFTER OTP VERIFIED) ---------------------------
//   if (otpSessionId && lockedPhone && otpToken && isAutoCreatingUser) {
//     return (
//       <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-3">OTP Verified ✅</h2>
//         <p className="mb-3">Creating your account...</p>

//         <div className="flex justify-center items-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     )
//   }

//   // --------------------------- MAIN SIGNUP FORM ---------------------------
//   return (
//     <form onSubmit={handleSubmit} className="w-full text-gray-800 max-w-md bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Create New Account</h2>

//       {/* Name */}
//       <div className="mb-4">
//         <label htmlFor='name' className="block text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
//         <input type="text" id='name' name='name' value={name} onChange={(e) => setName(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
//       </div>

//       {/* Phone */}
//       <div className="mb-4">
//         <label className="block text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
//         <PhoneInput
//           country="in"
//           value={phone}
//           onChange={(value) => setPhone(value)}
//           inputStyle={{
//             width: '100%',
//             padding: '22px 44px',
//             fontSize: '1rem',
//             borderRadius: '0.5rem',
//             border: '1px solid #d1d5db'
//           }}
//         />
//       </div>

//       {/* Address */}
//       <div className="mb-4">
//         <label className="block text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
//         <SearchAddress onSelect={handleLocationSelect} />
//       </div>

//       {/* House + Pincode */}
//       <div className="mb-3 flex justify-between gap-4">
//         <div>
//           <label htmlFor='houseNo' className="block text-gray-700 mb-1">House/Flat No.</label>
//           <input
//             type="text" id='houseNo' name='houseNo'
//             placeholder="Optional"
//             value={houseNo}
//             onChange={(e) => setHouseNo(e.target.value)}
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label htmlFor='pincode' className="block text-gray-700 mb-1">Pincode</label>
//           <input
//             type="number" id='pincode' name='pincode'
//             placeholder="Optional"
//             value={pincode}
//             onChange={(e) => setPincode(e.target.value)}
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Street */}
//       <div className="mb-3">
//         <label htmlFor='street' className="block text-gray-700 mb-1">Street</label>
//         <input
//           type="text" id='street' name='street'
//           placeholder="Optional"
//           value={street}
//           onChange={(e) => setStreet(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Password */}
//       <div className="mb-6 relative">
//         <label htmlFor='password' className="block text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
//         <input
//           type={showPassword ? 'text' : 'password'}
//           value={password} id='password' name='password'
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />
//         <button type="button"
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-500">
//           {showPassword ? <EyeOff /> : <Eye />}
//         </button>
//       </div>

//       <button
//         type="submit"
//         disabled={!isLocationSelected || otpLoading}
//         className={`w-full text-xl font-bold py-2 rounded transition 
//           ${isLocationSelected ? 'bg-blue-600 text-white hover:bg-blue-700'
//             : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
//         {otpLoading ? "Requesting OTP..." : "Verify Contact"}
//       </button>
//     </form>
//   )
// }


// "use client"

// import { useState, useRef, useEffect } from 'react'
// import { Eye, EyeOff } from 'lucide-react'
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'
// import SearchAddress from '../HelperComp/SearchAddress'

// import { useRequestOtpMutation } from '@/app/RTK Query/appApi'
// import { useCreateUserMutation ,useLazyGetUserDataQuery } from '@/app/RTK Query/userApi'

// import OtpVerification from './OtpVerification'
// import { useCaptcha } from './captchaHook'

// export default function SignUpPage() {
//   const [name, setName] = useState<string>('')
//   const [street, setStreet] = useState<string>('')
//   const [houseNo, setHouseNo] = useState<string>("")
//   const [pincode, setPincode] = useState<string>("")
//   const [password, setPassword] = useState<string>('')
//   const [phone, setPhone] = useState<string>('')
//   const [showPassword, setShowPassword] = useState(false)

//   const [otpSessionId, setOtpSessionId] = useState<string | null>(null)
//   const [lockedPhone, setLockedPhone] = useState<string | null>(null)
//   const [otpToken, setOtpToken] = useState<string | null>(null)
//   const [isAutoCreatingUser, setIsAutoCreatingUser] = useState(false)

//   const [requestOtp, { isLoading: otpLoading }] = useRequestOtpMutation()
//   const [createUser, { isLoading: createLoading }] = useCreateUserMutation()
//   const [getUserData, { isFetching, error }] = useLazyGetUserDataQuery()

//   const { getCaptchaToken } = useCaptcha()

//   const [location, setLocation] = useState({
//     address: '',
//     latitude: null,
//     longitude: null,
//     pincode: null,
//     eLoc: '',
//   })

//   const latestLocationRef = useRef(location)

//   const handleLocationSelect = (geo: any) => {
//     if (!geo) return
//     setLocation(geo)
//     latestLocationRef.current = geo
//   }

//   // --------------------------- OTP REQUEST + CAPTCHA LOGIC ---------------------------
//   const handleSubmit = async (e: any) => {
//     e.preventDefault()

//     const loc = latestLocationRef.current
//     if (!loc?.address) {
//       alert("Select address before continuing")
//       return
//     }

//     const payload = {
//       name,
//       phone,
//       password,
//       address: loc.address,
//       latitude: loc.latitude,
//       longitude: loc.longitude,
//       pincode: loc.pincode,
//       eLoc: loc.eLoc,
//       street,
//       houseNo
//     }

//     try {
//       // First normal request
//       const res: any = await requestOtp({ payload }).unwrap()
//       console.log(res);

//       // -------- Medium Risk → Captcha Required --------
//       if (res?.captcha_required) {
//         const token = await getCaptchaToken("otp_request")
//         if (!token) {
//           alert("Captcha failed")
//           return
//         }

//         const retry: any = await requestOtp({
//           payload,
//           captchaToken: token
//         }).unwrap()

//         setOtpSessionId(retry?.otp_session_id)
//         setLockedPhone(retry?.phone)
//         return
//       }

//       // -------- Normal Flow --------
//       setOtpSessionId(res?.otp_session_id)
//       setLockedPhone(res?.phone)

//     } catch (err: any) {
//       if (err?.status === 403) {
//         alert("Blocked due to high risk")
//       } else {
//         alert("Failed to request OTP")
//       }
//     }
//   }

//   // --------------------------- FINAL CREATE USER ---------------------------
//   const handleCreateUser = async () => {
//     const loc = latestLocationRef.current;

//     if (!otpToken || !otpSessionId) {
//       alert("OTP not verified");
//       return;
//     }

//     if (
//       loc?.latitude == null ||
//       loc?.longitude == null
//     ) {
//       alert("Invalid location selected");
//       return;
//     }

//     const payload = {
//       name,
//       password,
//       phone: lockedPhone,
//       role: "customer",

//       location: {
//         type: "Point",
//         coordinates: [Number(loc.longitude), Number(loc.latitude)], // [lng, lat]
//         address: loc.address ?? undefined,
//         street: street || undefined,
//         pincode: loc.pincode ? Number(loc.pincode) : pincode ? pincode : undefined,
//         houseNo: houseNo ? Number(houseNo) : undefined,
//         eLoc: loc.eLoc || undefined,
//       },
//     };

//     try {
//       const captcha = await getCaptchaToken("user_create");

//       const res: any = await createUser({
//         payload,
//         otpToken,
//         otpSessionId,
//         captchaToken: captcha ?? undefined,
//       }).unwrap();

//       // Store token from response
//       let signupToken = res?.token
//       if (res?.token) {
//         localStorage.setItem('token', res.token)
//         console.log(' Token stored from signup:', res.token.substring(0, 20) + '...')
//       }

//       // Fetch user data with explicit token
//       try {
//         console.log(' Calling getUserData with explicit token...')
//         const userData: any = await getUserData({ token: signupToken }).unwrap()

//         // Handle captcha requirement for user-data endpoint
//         if (userData?.captcha_required) {
//           console.log('Captcha required for user-data, requesting...')
//           const userDataCaptcha = await getCaptchaToken("user-data");
//           if (userDataCaptcha) {
//             await getUserData({ captchaToken: userDataCaptcha, token: signupToken }).unwrap()
//           }
//         }
//       } catch (userDataErr: any) {
//         console.error(" getUserData error:", userDataErr?.status, userDataErr?.data);
//         // Proceed anyway - user data will load on next action
//       }
      
//       alert("User created successfully!");
//       console.log("User Created:", res);
//     } catch (err: any) {
//       console.error(" createUser failed:", err?.status, err?.data, err);
//       const errorMsg = err?.data?.error || err?.data?.message || "Failed to create user";
//       alert(`Failed to create user: ${errorMsg}`);
//       setIsAutoCreatingUser(false);
//     }
//   };

//   // ======================== AUTO-CREATE USER AFTER OTP VERIFICATION ========================
//   useEffect(() => {
//     if (otpSessionId && lockedPhone && otpToken && !isAutoCreatingUser) {
//       setIsAutoCreatingUser(true)
//       handleCreateUser()
//     }
//   }, [otpToken, otpSessionId, lockedPhone, isAutoCreatingUser])

//   const isLocationSelected = Boolean(latestLocationRef.current?.address)

//   // --------------------------- OTP SCREEN ---------------------------
//   if (otpSessionId && lockedPhone && !otpToken) {
//     return (
//       <OtpVerification
//         mobile={lockedPhone}
//         sessionId={otpSessionId}
//         setToken={(token: string) => setOtpToken(token)}
//       />
//     )
//   }

//   // --------------------------- CREATING USER SCREEN (AFTER OTP VERIFIED) ---------------------------
//   if (otpSessionId && lockedPhone && otpToken && isAutoCreatingUser) {
//     return (
//       <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-3">OTP Verified</h2>
//         <p className="mb-3">Creating your account...</p>

//         <div className="flex justify-center items-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     )
//   }

//   // --------------------------- MAIN SIGNUP FORM ---------------------------
//   return (
//     <form onSubmit={handleSubmit} className="w-full text-gray-800 max-w-md bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Create New Account</h2>

//       {/* Name */}
//       <div className="mb-4">
//         <label htmlFor='name' className="block text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
//         <input type="text" id='name' name='name' value={name} onChange={(e) => setName(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
//       </div>

//       {/* Phone */}
//       <div className="mb-4">
//         <label className="block text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
//         <PhoneInput
//           country="in"
//           value={phone}
//           onChange={(value) => setPhone(value)}
//           inputStyle={{
//             width: '100%',
//             padding: '22px 44px',
//             fontSize: '1rem',
//             borderRadius: '0.5rem',
//             border: '1px solid #d1d5db'
//           }}
//         />
//       </div>

//       {/* Address */}
//       <div className="mb-4">
//         <label className="block text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
//         <SearchAddress onSelect={handleLocationSelect} />
//       </div>

//       {/* House + Pincode */}
//       <div className="mb-3 flex justify-between gap-4">
//         <div>
//           <label htmlFor='houseNo' className="block text-gray-700 mb-1">House/Flat No.</label>
//           <input
//             type="text" id='houseNo' name='houseNo'
//             placeholder="Optional"
//             value={houseNo}
//             onChange={(e) => setHouseNo(e.target.value)}
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label htmlFor='pincode' className="block text-gray-700 mb-1">Pincode</label>
//           <input
//             type="number" id='pincode' name='pincode'
//             placeholder="Optional"
//             value={pincode}
//             onChange={(e) => setPincode(e.target.value)}
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Street */}
//       <div className="mb-3">
//         <label htmlFor='street' className="block text-gray-700 mb-1">Street</label>
//         <input
//           type="text" id='street' name='street'
//           placeholder="Optional"
//           value={street}
//           onChange={(e) => setStreet(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Password */}
//       <div className="mb-6 relative">
//         <label htmlFor='password' className="block text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
//         <input
//           type={showPassword ? 'text' : 'password'}
//           value={password} id='password' name='password'
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />
//         <button type="button"
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-500">
//           {showPassword ? <EyeOff /> : <Eye />}
//         </button>
//       </div>

//       <button
//         type="submit"
//         disabled={!isLocationSelected || otpLoading}
//         className={`w-full text-xl font-bold py-2 rounded transition 
//           ${isLocationSelected ? 'bg-blue-600 text-white hover:bg-blue-700'
//             : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
//         {otpLoading ? "Requesting OTP..." : "Verify Contact"}
//       </button>
//     </form>
//   )
// }



"use client"

import { useState, useRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import SearchAddress from '../HelperComp/SearchAddress'

import { useRequestOtpMutation } from '@/app/RTK Query/appApi'
import { useCreateUserMutation ,useLazyGetUserDataQuery } from '@/app/RTK Query/userApi'

import OtpVerification from './OtpVerification'
import { useCaptcha } from './captchaHook'

export default function SignUpPage() {
  const [name, setName] = useState<string>('')
  const [street, setStreet] = useState<string>('')
  const [houseNo, setHouseNo] = useState<string>("")
  const [pincode, setPincode] = useState<string>("")
  const [password, setPassword] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)

  const [otpSessionId, setOtpSessionId] = useState<string | null>(null)
  const [lockedPhone, setLockedPhone] = useState<string | null>(null)
  const [otpToken, setOtpToken] = useState<string | null>(null)

  const [requestOtp, { isLoading: otpLoading }] = useRequestOtpMutation()
  const [createUser, { isLoading: createLoading }] = useCreateUserMutation()
  const [getUserData, { isFetching, error }] = useLazyGetUserDataQuery()

  const { getCaptchaToken } = useCaptcha()

  const [location, setLocation] = useState({
    address: '',
    latitude: null,
    longitude: null,
    pincode: null,
    eLoc: '',
  })

  const latestLocationRef = useRef(location)

  const handleLocationSelect = (geo: any) => {
    if (!geo) return
    setLocation(geo)
    latestLocationRef.current = geo
  }

  // --------------------------- OTP REQUEST + CAPTCHA LOGIC ---------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const loc = latestLocationRef.current
    if (!loc?.address) {
      alert("Select address before continuing")
      return
    }

    const payload = {
      name,
      phone,
      password,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      pincode: loc.pincode,
      eLoc: loc.eLoc,
      street,
      houseNo
    }

    try {
      // First normal request
      const res: any = await requestOtp({ payload }).unwrap()
      console.log(res);

      // -------- Medium Risk → Captcha Required --------
      if (res?.captcha_required) {
        const token = await getCaptchaToken("otp_request")
        if (!token) {
          alert("Captcha failed")
          return
        }

        const retry: any = await requestOtp({
          payload,
          captchaToken: token
        }).unwrap()

        setOtpSessionId(retry?.otp_session_id)
        setLockedPhone(retry?.phone)
        return
      }

      // -------- Normal Flow --------
      setOtpSessionId(res?.otp_session_id)
      setLockedPhone(res?.phone)

    } catch (err: any) {
      if (err?.status === 403) {
        alert("Blocked due to high risk")
      } else {
        alert("Failed to request OTP")
      }
    }
  }

  // --------------------------- FINAL CREATE USER ---------------------------
 const handleCreateUser = async () => {
    const loc = latestLocationRef.current;

    if (!otpToken || !otpSessionId) {
      alert("OTP not verified");
      return;
    }

    if (
      loc?.latitude == null ||
      loc?.longitude == null
    ) {
      alert("Invalid location selected");
      return;
    }

    const payload = {
      name,
      password,
      phone: lockedPhone,
      role: "customer",

      location: {
        type: "Point",
        coordinates: [Number(loc.longitude), Number(loc.latitude)], // [lng, lat]
        address: loc.address ?? undefined,
        street: street || undefined,
        pincode: loc.pincode ? Number(loc.pincode) : pincode ? pincode : undefined,
        houseNo: houseNo ? Number(houseNo) : undefined,
        eLoc: loc.eLoc || undefined,
      },
    };

    try {
      const captcha = await getCaptchaToken("user_create");

      const res: any = await createUser({
        payload,
        otpToken,
        otpSessionId,
        captchaToken: captcha ?? undefined,
      }).unwrap();

      // Store token from response
      let signupToken = res?.token
      if (res?.token) {
        localStorage.setItem('token', res.token)
        console.log('Token stored from signup:', res.token.substring(0, 20) + '...')
      }

      // Fetch user data with explicit token
      try {
        console.log(' Calling getUserData with explicit token...')
        const userData: any = await getUserData({ token: signupToken }).unwrap()

        // Handle captcha requirement for user-data endpoint
        if (userData?.captcha_required) {
          console.log(' Captcha required for user-data, requesting...')
          const userDataCaptcha = await getCaptchaToken("user-data");
          if (userDataCaptcha) {
            await getUserData({ captchaToken: userDataCaptcha, token: signupToken }).unwrap()
          }
        }
      } catch (userDataErr: any) {
        console.error("getUserData error:", userDataErr?.status, userDataErr?.data);
        // Proceed anyway - user data will load on next action
      }
      
      alert("User created successfully!");
      console.log("User Created:", res);
    } catch (err: any) {
      console.error(" createUser failed:", err?.status, err?.data, err);
      const errorMsg = err?.data?.error || err?.data?.message || "Failed to create user";
      alert(`Failed to create user: ${errorMsg}`);
    }
  };

  const isLocationSelected = Boolean(latestLocationRef.current?.address)

  // --------------------------- OTP SCREEN ---------------------------
  if (otpSessionId && lockedPhone && !otpToken) {
    return (
      <OtpVerification
        mobile={lockedPhone}
        sessionId={otpSessionId}
        setToken={(token: string) => setOtpToken(token)}
      />
    )
  }

  // --------------------------- FINAL SUBMIT SCREEN (AFTER OTP VERIFIED) ---------------------------
  if (otpSessionId && lockedPhone && otpToken) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">OTP Verified</h2>
        <p className="mb-3">Click below to create your account.</p>

        <button
          onClick={handleCreateUser}
          disabled={createLoading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {createLoading ? "Creating User..." : "Create Account"}
        </button>
      </div>
    )
  }

  // --------------------------- MAIN SIGNUP FORM ---------------------------
  return (
    <form onSubmit={handleSubmit} className="w-full text-gray-800 max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create New Account</h2>

      {/* Name */}
      <div className="mb-4">
        <label htmlFor='name' className="block text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
        <input type="text" id='name' name='name' value={name} onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
        <PhoneInput
          country="in"
          value={phone}
          onChange={(value) => setPhone(value)}
          inputStyle={{
            width: '100%',
            padding: '22px 44px',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db'
          }}
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
        <SearchAddress onSelect={handleLocationSelect} />
      </div>

      {/* House + Pincode */}
      <div className="mb-3 flex justify-between gap-4">
        <div>
          <label htmlFor='houseNo' className="block text-gray-700 mb-1">House/Flat No.</label>
          <input
            type="text" id='houseNo' name='houseNo'
            placeholder="Optional"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
          <div>
          <label htmlFor='pincode' className="block text-gray-700 mb-1">Pincode</label>
          <input
            type="number" id='pincode' name='pincode'
            placeholder="Optional"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Street */}
      <div className="mb-3">
        <label htmlFor='street' className="block text-gray-700 mb-1">Street</label>
        <input
          type="text" id='street' name='street'
          placeholder="Optional"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div className="mb-6 relative">
        <label htmlFor='password' className="block text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password} id='password' name='password'
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-500">
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <button
        type="submit"
        disabled={!isLocationSelected || otpLoading}
        className={`w-full text-xl font-bold py-2 rounded transition 
          ${isLocationSelected ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
        {otpLoading ? "Requesting OTP..." : "Verify Contact"}
      </button>
    </form>
  )
}
