"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AuthSwitcher from "./authSwitcher";
import { useGetUserDataQuery } from "@/app/RTK Query/userApi";
import { useCaptcha } from "./captchaHook";
import { useDispatch } from "react-redux";
import { api } from "@/app/RTK Query/appApi";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();

  /* ============ INIT TOKEN FROM LOCALSTORAGE ============ */
  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  /* ---------------- CAPTCHA STATE ---------------- */
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const isBlocked = captchaToken === "__BLOCKED__";
  const { getCaptchaToken } = useCaptcha();

  /* ============ SKIP QUERY IF NO TOKEN ============ */
  const shouldSkip = !token || isBlocked || !isMounted;

  /* ============ FORCE REFETCH WHEN TOKEN CHANGES ============ */
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    // Debounce refetch on token change to avoid transient unauthenticated
    // states (login sets localStorage and several listeners may fire).
    if (!token || shouldSkip) return;

    const t = setTimeout(() => {
      setRefetchKey((prev) => prev + 1);
    }, 150);

    return () => clearTimeout(t);
  }, [token, shouldSkip]);

  /* ---------------- USER DATA ---------------- */
  const {
    data,
    isFetching,
    isSuccess,
    refetch,
  } = useGetUserDataQuery(
    { captchaToken, token: token || undefined, refetchKey },
    { skip: shouldSkip, refetchOnMountOrArgChange: true }
  );

  const userCaptchaTriedRef = useRef(false);

  /* ============ AUTO-CLOSE MODAL WHEN AUTHENTICATED ============ */
  useEffect(() => {
    const isAuthenticated = Boolean(data?.user) && isSuccess;

    if (isAuthenticated) {
      setShowAuth(false);
      dispatch(
        api.util.invalidateTags([
          "Products",
          "Cart",
          "Orders",
          "User",
          "Activity",
        ])
      );
    }
  }, [data, isSuccess, dispatch]);

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

  /* ============ LISTEN FOR TOKEN CHANGES (ALL TABS) ============ */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        setToken(e.newValue);
        if (e.newValue) refetch();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    let lastToken = token;
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== lastToken) {
        lastToken = currentToken;
        setToken(currentToken);
        if (currentToken) setTimeout(refetch, 100);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [refetch, token]);

  /* ============ INTERACTION HANDLER ============ */
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
            ? "pointer-events-none blur-sm transition-all duration-300"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 animate-slideUp">
              <AuthSwitcher
                allowSkip
                onSkip={() => {
                  setShowAuth(false);
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
