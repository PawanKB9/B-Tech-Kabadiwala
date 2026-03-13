"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import SearchAddress from "../HelperComp/SearchAddress"

import { useRequestOtpMutation } from "@/app/RTK Query/appApi"
import { useCreateUserMutation } from "@/app/RTK Query/userApi"
import OtpVerification from "./OtpVerification"
import { useCaptcha } from "./captchaHook"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [houseNo, setHouseNo] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState<any>({})

  const [otpSessionId, setOtpSessionId] = useState<string | null>(null)
  const [lockedPhone, setLockedPhone] = useState<string | null>(null)
  const [otpToken, setOtpToken] = useState<string | null>(null)

  const hasTriggeredCreateRef = useRef(false)

  const [requestOtp, { isLoading: otpLoading }] = useRequestOtpMutation()
  const [createUser] = useCreateUserMutation()

  const { getCaptchaToken } = useCaptcha()

  const [location, setLocation] = useState({
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
    pincode: null as number | null,
    eLoc: "",
    street: "",
  })

  const handleLocationSelect = (geo: any) => {
    if (!geo) return

    setLocation({
      address: geo.address || "",
      latitude: geo.latitude || null,
      longitude: geo.longitude || null,
      pincode: geo.pincode || null,
      eLoc: geo.eLoc || "",
      street: geo.street || "",
    })
  }

  // ---------------- VALIDATION ----------------

  const validate = () => {
    const newErrors: any = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!phone || phone.length < 10) newErrors.phone = "Valid phone required"
    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters"
    if (!location.address) newErrors.address = "Select address"
    if (!location.street.trim()) newErrors.street = "Street is required"
    if (!location.pincode || String(location.pincode).length !== 6)
      newErrors.pincode = "Valid 6 digit pincode required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ---------------- SUBMIT ----------------

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!validate()) return

    const payload = {
      name,
      phone,
      password,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      pincode: location.pincode,
      eLoc: location.eLoc,
      street: location.street,
      houseNo,
    }

    try {
      const res: any = await requestOtp({ payload }).unwrap()

      if (res?.captcha_required) {
        const token = await getCaptchaToken("otp_request")
        if (!token) return alert("Captcha failed")

        const retry: any = await requestOtp({
          payload,
          captchaToken: token,
        }).unwrap()

        setOtpSessionId(retry?.otp_session_id)
        setLockedPhone(retry?.phone)
        return
      }

      setOtpSessionId(res?.otp_session_id)
      setLockedPhone(res?.phone)
    } catch {
      setErrors({ api: "Failed to request OTP" })
    }
  }

  const handleCreateUser = async () => {
    if (!otpToken || !otpSessionId) return

    const payload = {
      name,
      password,
      phone: lockedPhone,
      role: "customer",
      location: {
        type: "Point",
        coordinates: [
          Number(location.longitude),
          Number(location.latitude),
        ],
        address: location.address,
        street: location.street,
        pincode: location.pincode,
        houseNo: houseNo ? Number(houseNo) : undefined,
        eLoc: location.eLoc || undefined,
      },
    }

    let captchaToken
    try {
      captchaToken = await getCaptchaToken("user_create")
    } catch {}

    const res: any = await createUser({
      payload,
      otpToken,
      otpSessionId,
      captchaToken,
    }).unwrap()

    if (res?.token) localStorage.setItem("token", res.token)

    alert("User created successfully!")
  }

  useEffect(() => {
    if (!otpToken || !otpSessionId || !lockedPhone) return
    if (hasTriggeredCreateRef.current) return

    hasTriggeredCreateRef.current = true
    handleCreateUser()
  }, [otpToken])

  if (otpSessionId && lockedPhone && !otpToken) {
    return (
      <OtpVerification
        mobile={lockedPhone}
        sessionId={otpSessionId}
        setToken={(token: string) => setOtpToken(token)}
      />
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full text-gray-800 max-w-md bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Create New Account
      </h2>

      {errors.api && (
        <p className="text-red-500 text-sm mb-3">{errors.api}</p>
      )}

      <div className="mb-4">
        <label>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label>Phone *</label>
        <PhoneInput country="in" value={phone} onChange={setPhone}           inputStyle={{
            width: "100%",
            padding: "20px 40px",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
          }} />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
      </div>

      <div className="mb-4">
        <label>Address *</label>
        <SearchAddress onSelect={handleLocationSelect} />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
      </div>

      <div className="mb-3 flex gap-4">
        <input
          type="text"
          placeholder="House No"
          value={houseNo}
          onChange={(e) => setHouseNo(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Pincode"
          value={location.pincode ?? ""}
          onChange={(e) =>
            setLocation((prev) => ({
              ...prev,
              pincode: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {errors.pincode && (
        <p className="text-red-500 text-sm">{errors.pincode}</p>
      )}

      <div className="mb-3">
        <input
          type="text"
          placeholder="Street"
          value={location.street}
          onChange={(e) =>
            setLocation((prev) => ({ ...prev, street: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
        />
        {errors.street && (
          <p className="text-red-500 text-sm">{errors.street}</p>
        )}
      </div>

      <div className="mb-6 relative">
        <label>Password *</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px]"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <button
        type="submit"
        disabled={otpLoading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {otpLoading ? "Requesting OTP..." : "Verify Contact"}
      </button>
    </form>
  )
}



// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Eye, EyeOff } from "lucide-react"
// import PhoneInput from "react-phone-input-2"
// import "react-phone-input-2/lib/style.css"
// import SearchAddress from "../HelperComp/SearchAddress"

// import { useRequestOtpMutation } from "@/app/RTK Query/appApi"
// import { useCreateUserMutation } from "@/app/RTK Query/userApi"
// import OtpVerification from "./OtpVerification"
// import { useCaptcha } from "./captchaHook"

// export default function SignUpPage() {
//   const [name, setName] = useState("")
//   const [houseNo, setHouseNo] = useState("")
//   const [street, setStreet] = useState("")
//   const [pincode, setPincode] = useState("")
//   const [password, setPassword] = useState("")
//   const [phone, setPhone] = useState("")
//   const [showPassword, setShowPassword] = useState(false)

//   const [otpSessionId, setOtpSessionId] = useState<string | null>(null)
//   const [lockedPhone, setLockedPhone] = useState<string | null>(null)
//   const [otpToken, setOtpToken] = useState<string | null>(null)

//   const hasTriggeredCreateRef = useRef(false)

//   const [requestOtp, { isLoading: otpLoading }] = useRequestOtpMutation()
//   const [createUser] = useCreateUserMutation()

//   const { getCaptchaToken } = useCaptcha()

//   const [location, setLocation] = useState({
//     address: "",
//     latitude: null,
//     longitude: null,
//     pincode: null,
//     eLoc: "",
//   })

//   const latestLocationRef = useRef(location)

//   const handleLocationSelect = (geo: any) => {
//     if (!geo) return
//     setLocation(geo)
//     latestLocationRef.current = geo
//   }

//   const handleSubmit = async (e: any) => {
//     e.preventDefault()

//     const loc = latestLocationRef.current
//     if (!loc?.address) return alert("Select address before continuing")

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
//       houseNo,
//     }

//     try {
//       const res: any = await requestOtp({ payload }).unwrap()

//       if (res?.captcha_required) {
//         const token = await getCaptchaToken("otp_request")
//         if (!token) return alert("Captcha failed")

//         const retry: any = await requestOtp({
//           payload,
//           captchaToken: token,
//         }).unwrap()

//         setOtpSessionId(retry?.otp_session_id)
//         setLockedPhone(retry?.phone)
//         return
//       }

//       setOtpSessionId(res?.otp_session_id)
//       setLockedPhone(res?.phone)
//     } catch (err: any) {
//       if (err?.status === 403) alert("Blocked due to high risk")
//       else alert("Failed to request OTP")
//     }
//   }

//   const handleCreateUser = async () => {
//     const loc = latestLocationRef.current
//     if (!otpToken || !otpSessionId) throw new Error("OTP not verified")

//     const payload = {
//       name,
//       password,
//       phone: lockedPhone,
//       role: "customer",
//       location: {
//         type: "Point",
//         coordinates: [Number(loc.longitude), Number(loc.latitude)],
//         address: loc.address ?? undefined,
//         street: street || undefined,
//         pincode: loc.pincode
//           ? Number(loc.pincode)
//           : pincode
//           ? pincode
//           : undefined,
//         houseNo: houseNo ? Number(houseNo) : undefined,
//         eLoc: loc.eLoc || undefined,
//       },
//     }

//     let captchaToken
//     try {
//       captchaToken = await getCaptchaToken("user_create")
//     } catch {}

//     const res: any = await createUser({
//       payload,
//       otpToken,
//       otpSessionId,
//       captchaToken: captchaToken ?? undefined,
//     }).unwrap()

//     if (res?.token) localStorage.setItem("token", res.token)

//     alert("User created successfully!")
//   }

//   useEffect(() => {
//     if (!otpToken || !otpSessionId || !lockedPhone) return
//     if (hasTriggeredCreateRef.current) return

//     hasTriggeredCreateRef.current = true

//     const create = async () => {
//       try {
//         await handleCreateUser()
//       } catch {
//         hasTriggeredCreateRef.current = false
//       }
//     }

//     create()
//   }, [otpToken])

//   const isLocationSelected = Boolean(latestLocationRef.current?.address)

//   if (otpSessionId && lockedPhone && !otpToken) {
//     return (
//       <OtpVerification
//         mobile={lockedPhone}
//         sessionId={otpSessionId}
//         setToken={(token: string) => setOtpToken(token)}
//       />
//     )
//   }

//   if (otpSessionId && lockedPhone && otpToken) {
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

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="w-full text-gray-800 max-w-md bg-white p-6 rounded-lg shadow-md"
//     >
//       <h2 className="text-2xl font-semibold mb-6 text-center">
//         Create New Account
//       </h2>

//       <div className="mb-4">
//         <label className="block mb-1">Name *</label>
//         <input
//           type="text"
//           value={name}
//           required
//           onChange={(e) => setName(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1">Phone *</label>
//         <PhoneInput
//           country="in"
//           value={phone}
//           onChange={(value) => setPhone(value)}
          // inputStyle={{
          //   width: "100%",
          //   padding: "22px 44px",
          //   fontSize: "1rem",
          //   borderRadius: "0.5rem",
          //   border: "1px solid #d1d5db",
          // }}
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1">Address *</label>
//         <SearchAddress onSelect={handleLocationSelect} />
//       </div>

//       <div className="mb-3 flex gap-4">
//         <input
//           type="text"
//           placeholder="House No"
//           value={houseNo}
//           onChange={(e) => setHouseNo(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//         <input
//           type="number"
//           placeholder="Pincode"
//           value={pincode}
//           required
//           onChange={(e) => setPincode(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>

//       <div className="mb-3">
//         <input
//           type="text"
//           placeholder="Street"
//           value={street}
//           required
//           onChange={(e) => setStreet(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>

//       <div className="mb-6 relative">
//         <label className="block mb-1">Password *</label>
//         <input
//           type={showPassword ? "text" : "password"}
//           value={password}
//           required
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-[38px]"
//         >
//           {showPassword ? <EyeOff /> : <Eye />}
//         </button>
//       </div>

//       <button
//         type="submit"
//         disabled={!isLocationSelected || otpLoading}
//         className="w-full bg-blue-600 text-white py-2 rounded"
//       >
//         {otpLoading ? "Requesting OTP..." : "Verify Contact"}
//       </button>
//     </form>
//   )
// }
