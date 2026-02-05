"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    initSendOTP?: (config: any) => void;
    sendOtp?: (
      identifier: string,
      success?: (data?: any) => void,
      failure?: (err?: any) => void
    ) => void;
    retryOtp?: (
      channel: string | null,
      success?: (data?: any) => void,
      failure?: (err?: any) => void,
      reqId?: string
    ) => void;
    verifyOtp?: (
      otp: string,
      success?: (data?: any) => void,
      failure?: (err?: any) => void,
      reqId?: string
    ) => void;
    isCaptchaVerified?: () => boolean;
    getWidgetData?: () => any;
  }
}

interface Props {
  mobile: string; // must include country code (e.g. "919999999999")
  sessionId: string | null; // backend returned otp_session_id (optional)
  setToken: (token: string) => void;
}

const COOLDOWN = 30;
const MSG91_SCRIPT_SRC = "https://verify.msg91.com/otp-provider.js";

function loadScriptOnce(src: string): Promise<Event> {
  // if script already present and loaded, resolve immediately
  const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
  if (existing) {
    if (existing.getAttribute("data-loaded") === "true") {
      return Promise.resolve(new Event("load"));
    }
    // if script present but not loaded, attach to its load/error events
    return new Promise((res, rej) => {
      existing.addEventListener("load", (e) => res(e));
      existing.addEventListener("error", (e) => rej(e));
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.addEventListener("load", (e) => {
      s.setAttribute("data-loaded", "true");
      resolve(e);
    });
    s.addEventListener("error", (e) => reject(e));
    document.body.appendChild(s);
  });
}

export default function OtpVerification({ mobile, sessionId, setToken }: Props) {
  const [otp, setOtp] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [reqId, setReqId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const initCalled = useRef(false);

  // load msg91 script once on mount
  useEffect(() => {
    let cancelled = false;
    loadScriptOnce(MSG91_SCRIPT_SRC)
      .then(() => {
        if (!cancelled) {
          console.log("msg91 script loaded");
          setSdkReady(true); // script loaded; methods may be exposed after initSendOTP call
        }
      })
      .catch((err) => {
        console.error("Failed to load msg91 script", err);
        setError("OTP provider failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // initialize widget after script loaded and when we have mobile/sessionId (sessionId optional)
  useEffect(() => {
    if (!sdkReady) return;
    if (!window.initSendOTP) {
      console.warn("initSendOTP not exposed by msg91 script yet");
      return;
    }
    if (initCalled.current) return; // init only once per mount (or you can re-init intentionally)
    // If your flow requires using backend otp_session_id for any server-side verification, you can keep it.
    // Msg91 config per docs:
    const config: any = {
      widgetId: process.env.NEXT_PUBLIC_MSG91WIDGETID ?? "35666f654a37313832343932",
      tokenAuth: process.env.NEXT_PUBLIC_MSG91TOKEN_AUTH ?? "456212TkWOS2Ga7mce684e56c1P1",
      identifier: mobile, // optional - but sending here helps the widget tie to identifier
      exposeMethods: true,
      captchaRenderId: "msg91-captcha",
      success: (d: any) => console.log("msg91 global success:", d),
      failure: (e: any) => console.warn("msg91 global failure:", e),
    };

    // Call initSendOTP only after we have the msg91 SDK loaded
    try {
      console.log("calling initSendOTP with config", { ...config, tokenAuth: config.tokenAuth ? "[REDACTED]" : "" });
      window.initSendOTP?.(config);
      initCalled.current = true;
      // At this point the widget should expose sendOtp/retryOtp/verifyOtp on window
    } catch (err) {
      console.error("initSendOTP threw:", err);
      setError("Failed to initialize OTP provider");
    }
  }, [sdkReady, mobile]);

  // auto-send OTP after init and when sessionId arrives (if you want to wait for backend session)
  useEffect(() => {
    // Wait until init was called and sendOtp exists and we haven't already sent
    if (!initCalled.current) return;
    if (!window.sendOtp) {
      console.warn("window.sendOtp not ready yet");
      return;
    }
    if (otpSent) return;
    // If captcha is required, wait
    if (window.isCaptchaVerified && !window.isCaptchaVerified()) {
      setInfo("Please complete captcha to receive OTP");
      return;
    }

    // send using mobile (Msg91 requires identifier argument)
    triggerSendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCalled.current, window.sendOtp, sessionId]);

  const triggerSendOtp = () => {
    if (!window.sendOtp) {
      setError("OTP SDK not ready");
      return;
    }
    setError(null);
    setInfo("Sending OTP...");

    // Msg91 docs: first arg is identifier string (mobile with country code; no +)
    try {
      window.sendOtp(
        mobile,
        (data: any) => {
          console.log("sendOtp success", data);
          setOtpSent(true);
          setCooldown(COOLDOWN);
          // SDK success usually returns reqId or request_id — save what you get
          setReqId(data?.reqId || data?.request_id || null);
          setInfo("OTP sent successfully");
        },
        (err: any) => {
          console.error("sendOtp failure", err);
          setError("Failed to send OTP");
          setInfo(null);
        }
      );
    } catch (e) {
      console.error("sendOtp threw", e);
      setError("Failed to send OTP");
    }
  };

  const resendOtp = () => {
    if (!window.retryOtp) {
      setError("OTP SDK not ready");
      return;
    }
    setInfo("Resending OTP...");
    window.retryOtp(
      "11",
      (data: any) => {
        console.log("retryOtp success", data);
        setCooldown(COOLDOWN);
        setInfo("OTP resent");
        if (data?.reqId) setReqId(data.reqId);
      },
      (err: any) => {
        console.error("retryOtp failure", err);
        setError("Failed to resend OTP");
        setInfo(null);
      },
      reqId || undefined
    );
  };

  const verifyOtp = () => {
    if (!window.verifyOtp) {
      setError("OTP SDK not ready");
      return;
    }
    if (!otp) {
      setError("Enter OTP");
      return;
    }
    setInfo("Verifying OTP...");
    window.verifyOtp(
      otp,
      (data: any) => {
        console.log("verifyOtp success", data);
        const token = data?.message || data?.data?.message;
        const success = data?.type || data?.data?.type;
        if (!token || success != "success") {
          // If verify returns a success response that does not include a token,
          // you may need to call your backend to exchange the session/reqId for a token.
          setError("OTP verified but token missing");
          setInfo(null);
          return;
        }
        setToken(token);
        setInfo("OTP verified");
      },
      (err: any) => {
        console.error("verifyOtp failure", err);
        setError("Invalid OTP");
        setInfo(null);
      },
      reqId || undefined
    );
  };

  // cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  return (
    <div className="mt-6 w-[100%] h-[100%] bg-white text-gray-800 rounded shadow max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-2">Enter OTP sent to {mobile}</h3>

      <div id="msg91-captcha" className="mb-3" />

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {info && <p className="text-green-600 mb-2">{info}</p>}

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        className="border px-3 py-2 rounded text-center tracking-widest"
      />

      <div className="mt-4 flex gap-3">
        <button onClick={verifyOtp} className="px-4 py-2 bg-green-600 text-white rounded">
          Verify
        </button>

        <button onClick={resendOtp} disabled={cooldown > 0} className="px-3 py-2 border rounded disabled:opacity-50">
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      </div>
    </div>
  );
}