"use client";

import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";

// Extend window type for MSG91 SDK
declare global {
  interface Window {
    initSendOTP?: (config: any) => void;
    sendOtp?: (
      mobile: string,
      success: (data: any) => void,
      failure: (err: any) => void
    ) => void;
    resendOtp?: (
      mobile: string,
      success: (data: any) => void,
      failure: (err: any) => void
    ) => void;
    verifyOtp?: (
      otp: string,
      success: (data: any) => void,
      failure: (err: any) => void
    ) => void;
  }
}

interface OtpVerificationProps {
  mobile: string;
  setToken: (token: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ mobile, setToken }) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Load MSG91 SDK
  useEffect(() => {
    const configuration = {
      widgetId: process.env.NEXT_PUBLIC_MSG91WIDGETID,
      tokenAuth: process.env.NEXT_PUBLIC_MSG91TOKEN_AUTH,
      exposeMethods: true,
      identifier: "",
      success: () => {},
      failure: () => {},
    };

    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_MSG91_URL || "";
    script.async = true;
    script.onload = () => {
      if (window.initSendOTP) {
        window.initSendOTP(configuration);
        setSdkReady(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Auto send OTP
  useEffect(() => {
    if (sdkReady && !otpSent && window.sendOtp) {
      window.sendOtp(
        mobile,
        (data) => {
          setOtpSent(true);
          setResendCooldown(30);
        },
        (err) => {
          console.error("❌ Auto OTP send failed:", err);
        }
      );
    }
  }, [sdkReady, otpSent, mobile]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendOtp = () => {
    if (!window.resendOtp) return alert("SDK not ready");
    window.resendOtp(
      mobile,
      () => setResendCooldown(30),
      (err) => console.error("❌ Resend failed:", err)
    );
  };

  const handleVerifyOtp = () => {
    if (!window.verifyOtp) return alert("SDK not ready");
    window.verifyOtp(
      otp,
      (data) => {
        setToken(data.message);
      },
      (err) => console.error("❌ OTP verification failed:", err)
    );
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "monospace",
    margin: "4px",
    width: "3rem",
    borderRadius: "8px",
    fontSize: "20px",
    height: "3rem",
    paddingLeft: "7px",
    backgroundColor: "white",
    color: "#000",
    border: "1px solid #ccc",
  };

  return (
    <div className="mt-24 flex flex-col items-center justify-center px-4 py-10 w-[96vw] max-w-md mx-auto bg-white rounded-lg shadow-md border border-green-200">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Enter OTP</h2>

      <ReactCodeInput
        type="number"
        fields={4}
        onChange={(val) => setOtp(val)}
        inputStyle={inputStyle}
      />

      <button
        onClick={handleVerifyOtp}
        className="mt-6 px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300"
      >
        Verify OTP
      </button>

      <button
        onClick={handleResendOtp}
        className="mt-3 text-sm text-green-500 disabled:opacity-50"
        disabled={resendCooldown > 0}
      >
        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
      </button>
    </div>
  );
};

export default OtpVerification;
