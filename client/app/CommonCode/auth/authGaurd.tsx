"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AuthSwitcher from "./authSwitcher";
import { useGetUserDataQuery } from "@/app/RTK Query/userApi";
import { useCaptcha } from "./captchaHook";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  /* ============ INIT TOKEN FROM LOCALSTORAGE ============ */
  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  /* ---------------- CAPTCHA STATE ---------------- */
  const [captchaToken, setCaptchaToken] =
    useState<string | undefined>();
  const isBlocked = captchaToken === "__BLOCKED__";

  const { getCaptchaToken } = useCaptcha();

  /* ============ SKIP QUERY IF NO TOKEN ============ */
  const shouldSkip = !token || isBlocked || !isMounted;

  /* ---------------- USER DATA ---------------- */
  const {
    data,
    isFetching,
    isSuccess,
  } = useGetUserDataQuery(
    { captchaToken, token: token || undefined },
    { skip: shouldSkip }
  );

  const userCaptchaTriedRef = useRef(false);

  /* ---------------- CAPTCHA RETRY (ONCE) ---------------- */
  useEffect(() => {
    if (!data?.captcha_required) return;
    if (userCaptchaTriedRef.current) return;

    userCaptchaTriedRef.current = true;

    (async () => {
      const captchaTokenValue = await getCaptchaToken("auth-guard");
      if (!captchaTokenValue) {
        setCaptchaToken("__BLOCKED__");
        return;
      }
      setCaptchaToken(captchaTokenValue);
    })();
  }, [data, getCaptchaToken]);

  const isAuthenticated = Boolean(data?.user) && isSuccess;

  /* ============ LISTEN FOR TOKEN CHANGES ============ */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /* ---------------- INTERACTION ---------------- */
  const handleInteractionCapture = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  };

  return (
    <>
      {/* Protected content */}
      <div
        onClickCapture={handleInteractionCapture}
        className={
          !isAuthenticated && showAuth
            ? "pointer-events-none blur-sm"
            : ""
        }
      >
        {children}
      </div>

      {/* Auth Modal */}
      {!isAuthenticated &&
        showAuth &&
        !isFetching &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <AuthSwitcher />

              <button
                type="button"
                onClick={() => setShowAuth(false)}
                className="absolute font-extrabold top-3 right-3 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

