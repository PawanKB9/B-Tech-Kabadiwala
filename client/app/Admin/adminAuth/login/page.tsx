'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useCaptcha } from '@/app/CommonCode/auth/captchaHook'
import {
  useLoginUserMutation,
} from '@/app/RTK Query/userApi'

type Errors = {
  phone?: string
  email?: string
  password?: string
}

const LoginForm = () => {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const { getCaptchaToken } = useCaptcha()
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const router = useRouter()

  // ---------------- Validation ----------------
  const validate = (): Errors => {
    const newErrors: Errors = {}
    if (!phone) newErrors.phone = 'Phone is required'
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      phone: `91${phone}`,
      email,
      password,
    }

    try {
      // -------- FIRST LOGIN ATTEMPT --------
      const res: any = await loginUser({ payload }).unwrap()

      // -------- CAPTCHA FLOW (ONCE) --------
      if (res?.captcha_required) {
        const captchaToken = await getCaptchaToken('login')
        if (!captchaToken) return

        await loginUser({
          payload,
          captchaToken,
        }).unwrap()
      }

      // ✅ NO USER-DATA CALL HERE
      // Dashboard will hydrate safely

      router.push("/Admin/adminAuth/user")

    } catch (err: any) {
      if (err?.status === 403) {
        alert('Blocked due to high risk')
      } else {
        console.error(err)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center text-gray-800 bg-zinc-50 p-6 px-[10%]"
    >
      <div className="w-full bg-zinc-50 p-2 py-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h2>

        {/* Phone */}
        <div className="mb-4">
          <label className="block mb-1">
            Phone<span className="text-red-500">*</span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block mb-1">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  )
}

export default LoginForm



// 'use client'

// import { useState } from 'react'
// // import Link from 'next/link'
// import { Eye, EyeOff } from 'lucide-react'
// import { useRouter } from "next/navigation";
// import { useCaptcha } from '@/app/CommonCode/auth/captchaHook'
// import {
//   useLazyGetUserDataQuery,
//   useLoginUserMutation,
// } from '@/app/RTK Query/userApi'


// type Errors = {
//   phone?: string
//   email?: string
//   password?: string
// }

// const LoginForm = () => {
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState<Errors>({})
//   const { getCaptchaToken } = useCaptcha()

//   const [loginUser, { isLoading }] = useLoginUserMutation()
//   const [getUserData] = useLazyGetUserDataQuery()

//   const router = useRouter();

//   // ---------------- Validation ----------------
//   const validate = (): Errors => {
//     const newErrors: Errors = {}

//     if (!phone) newErrors.phone = 'Phone is required'
//     if (!password) newErrors.password = 'Password is required'

//     if (!email) {
//       newErrors.email = 'Email is required'
//     }

//     return newErrors
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const validationErrors = validate()
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors)
//       return;
//     }

//     // ---------------- Payload (same API, same route) ----------------
//     const payload: any = {
//       phone: `91${phone}`,
//       password,
//     }
//     payload.email = email

//     try {
//       // ---------------- First Login Attempt ----------------
//       const res: any = await loginUser({ payload }).unwrap()
//       console.log(res);

//       // ---------------- Captcha Flow ----------------
//       if (res?.captcha_required) {
//         const captchaToken = await getCaptchaToken('login')

//         if (!captchaToken) {
//           alert('Captcha failed')
//           return
//         }

//         await loginUser({
//           payload,
//           captchaToken,
//         }).unwrap()
//       }

//       // ---------------- Hydrate Auth ----------------
//       await getUserData(undefined).unwrap()

//       console.log(`$} login successful`)
//       router.push("/Admin/adminAuth/user");
//     } catch (err: any) {
//       if (err?.status === 403) {
//         alert('Blocked due to high risk')
//       } else {
//         console.error(err)
//       }
//     }
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className=" flex items-center justify-center text-gray-800 bg-zinc-50 p-6 px-[10%]"
//     >
//       <div className="w-full text-gray-800 bg-zinc-50 p-2 py-10 rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-6 text-center">
//         Admin Login
//       </h2>

//       {/* Phone */}
//       <div className="mb-4">
//         <label className="block mb-1">
//           Phone<span className="text-red-500">*</span>
//         </label>
//         <input
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//         {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
//       </div>

//       {/* Email (Admin Only) */}
//         <div className="mb-4">
//           <label className="block mb-1">
//             Email<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email}</p>
//           )}
//         </div>

//       {/* Password */}
//       <div className="mb-6 relative">
//         <label className="block mb-1">
//           Password<span className="text-red-500">*</span>
//         </label>
//         <input
//           type={showPassword ? 'text' : 'password'}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-[38px]"
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//         {errors.password && (
//           <p className="text-red-500 text-sm">{errors.password}</p>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
//       >
//         {isLoading ? 'Logging in...' : 'Login'}
//       </button>
//       </div>
//     </form>
//   )
// }

// export default LoginForm
