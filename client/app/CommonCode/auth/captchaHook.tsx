"use client"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export const useCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getCaptchaToken = async (action = "otp_request") => {
    if (!executeRecaptcha) return null
    return await executeRecaptcha(action)
  }

  return { getCaptchaToken }
}
