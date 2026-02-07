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
      /* ========== STEP 1: LOGIN ========== */
      const res: any = await loginUser({ payload }).unwrap()
      console.log('✅ Login response:', res)

      let loginToken = res?.token

      if (res?.captcha_required) {
        const captchaToken = await getCaptchaToken('login')
        if (!captchaToken) {
          alert('Captcha failed')
          return
        }

        const retryRes: any = await loginUser({ payload, captchaToken }).unwrap()
        console.log('✅ Login with captcha response:', retryRes)
        // Store token from retry response
        if (retryRes?.token) {
          loginToken = retryRes.token
          localStorage.setItem('token', retryRes.token)
          console.log('✅ Token stored from retry:', retryRes.token.substring(0, 20) + '...')
        }
      } else {
        // Store token from initial response
        if (res?.token) {
          localStorage.setItem('token', res.token)
          console.log('✅ Token stored:', res.token.substring(0, 20) + '...')
        }
      }

      /* ========== STEP 2: GET USER DATA ========== */
      console.log('🔄 Calling getUserData with explicit token...')
      
      // Reset the guard for captcha retry
      userCaptchaTriedRef.current = false
      
      try {
        // Pass token explicitly for first call
        const userData: any = await getUserData({ token: loginToken }).unwrap()
        console.log('✅ UserData response:', userData)

        // Handle captcha requirement for user-data endpoint
        if (userData?.captcha_required) {
          console.log('🔄 Captcha required for user-data, requesting...')
          const captchaToken = await getCaptchaToken('user-data')
          if (!captchaToken) {
            console.warn('⚠️  Captcha failed for user-data')
            alert('Captcha failed')
            return
          }
          // Retry with captcha token
          const retryUserData: any = await getUserData({ captchaToken, token: loginToken }).unwrap()
          console.log('✅ UserData with captcha response:', retryUserData)
        }
      } catch (userDataErr: any) {
        console.error('❌ getUserData error:', userDataErr?.status, userDataErr?.data)
        // If it's 401/403, try one more time after a delay
        if (userDataErr?.status === 401 || userDataErr?.status === 403) {
          console.log('🔄 Retrying getUserData after 500ms...')
          await new Promise(resolve => setTimeout(resolve, 500))
          try {
            const retryUserData: any = await getUserData({ token: loginToken }).unwrap()
            console.log('✅ Retry getUserData succeeded:', retryUserData)
          } catch (retryErr: any) {
            console.error('❌ Retry getUserData also failed:', retryErr?.status)
            // Proceed anyway - user data will load on next action
          }
        } else {
          console.warn('⚠️  Could not fetch user data immediately, will load on next action')
        }
      }

      console.log('✅ Login successful, redirecting...')
      router.push("/")
    } catch (err: any) {
      console.error('❌ Login error:', err?.status, err?.data)
      if (err?.status === 403) {
        alert('Blocked due to high risk')
      } else {
        console.error(err)
        alert('Login failed: ' + (err?.data?.error || err?.message || 'Unknown error'))
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
