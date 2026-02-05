'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useCaptcha } from './captchaHook'
import {
  useLazyGetUserDataQuery,
  useLoginUserMutation,
} from '@/app/RTK Query/userApi'
import { useRouter } from "next/navigation";


type Errors = {
  phone?: string
  password?: string
}

const LoginForm = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const router = useRouter()

  const { getCaptchaToken } = useCaptcha()

  /* ---------------- CAPTCHA STATE ---------------- */
  const [userCaptchaToken, setUserCaptchaToken] =
    useState<string | undefined>()

  /* ---------------- API ---------------- */
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const [
    getUserData,
    { data: userRes, isFetching, error },
  ] = useLazyGetUserDataQuery()

  /* ---------------- GUARD ---------------- */
  const userCaptchaTriedRef = useRef(false)

  const validate = (): Errors => {
    const newErrors: Errors = {}
    if (!phone) newErrors.phone = 'Phone is required'
    if (!password) newErrors.password = 'Password is required'
    return newErrors
  }

  /* ---------------- USER DATA → CAPTCHA RETRY ---------------- */
  useEffect(() => {
    if (!userRes?.captcha_required) return
    if (userCaptchaTriedRef.current) return

    userCaptchaTriedRef.current = true

    ;(async () => {
      const captchaToken = await getCaptchaToken('user-data')
      if (!captchaToken) return

      // changing arg triggers refetch (correct RTK pattern)
      setUserCaptchaToken(captchaToken)
      getUserData({ captchaToken })
    })()
  }, [userRes, getCaptchaToken, getUserData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      phone: `91${phone}`,
      password,
    }

    try {
      /* ---------------- LOGIN ---------------- */
      const res: any = await loginUser({ payload }).unwrap()

      if (res?.captcha_required) {
        const captchaToken = await getCaptchaToken('login')
        if (!captchaToken) {
          alert('Captcha failed')
          return
        }

        await loginUser({ payload, captchaToken }).unwrap()
      }

      /* ---------------- USER DATA FETCH ---------------- */
      await getUserData({
        captchaToken: userCaptchaToken,
      }).unwrap()

      console.log('Login successful')
      router.push("/")
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
      className="w-full max-w-md text-gray-800 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Login to your account
      </h2>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-1">
          Phone<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-6 relative">
        <label className="block text-gray-700 mb-1">
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
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="text-right mb-6">
        <Link href="/user/forgotpassword" className="text-sm text-blue-600">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm
