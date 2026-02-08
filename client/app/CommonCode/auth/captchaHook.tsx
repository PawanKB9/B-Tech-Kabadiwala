"use client"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export const useCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getCaptchaToken = async (action = "otp_request") => {
    if (!executeRecaptcha) return null
    try {
      return await executeRecaptcha(action)
    } catch (err: any) {
      console.error("reCAPTCHA execution failed:", err?.message || err)
      return null
    }
  }

  return { getCaptchaToken }
}
