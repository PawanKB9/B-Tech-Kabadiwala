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
    const storedToken = localStorage.getItem('token');
    console.log('🔍 AuthGuard: Token on mount:', storedToken ? '✅ Found' : '❌ Not found');
    setToken(storedToken);
  }, []);

  /* ---------------- CAPTCHA STATE ---------------- */
  const [captchaToken, setCaptchaToken] =
    useState<string | undefined>();
  const isBlocked = captchaToken === "__BLOCKED__";

  const { getCaptchaToken } = useCaptcha();

  /* ============ SKIP QUERY IF NO TOKEN ============ */
  const shouldSkip = !token || isBlocked || !isMounted;

  /* ============ FORCE REFETCH WHEN TOKEN CHANGES ============ */
  const refetchCounterRef = useRef(0);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (token && !shouldSkip) {
      console.log('🔄 AuthGuard: Token detected, triggering query...', token.substring(0, 20) + '...');
      // Force a new query by updating the refetch key
      setRefetchKey(prev => prev + 1);
    }
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
      console.log('✅ AuthGuard: User authenticated! Closing modal...');
      setShowAuth(false);
      // Invalidate any other queries that might depend on user state
      dispatch(api.util.invalidateTags(['Products', 'Cart', 'Orders', 'User', 'Activity']));
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

  /* ============ LISTEN FOR TOKEN CHANGES (other tabs + same tab) ============ */
  useEffect(() => {
    // Handle storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('💾 AuthGuard: Token changed in localStorage:', e.newValue ? '✅ Set' : '❌ Cleared');
        setToken(e.newValue);
        if (e.newValue) {
          // Force refetch immediately
          refetch();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // IMPORTANT: Also listen for token changes on the SAME tab
    // by monitoring localStorage periodically
    let lastToken = token;
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== lastToken) {
        console.log('💾 AuthGuard: Token changed (same tab):', currentToken ? '✅ Set' : '❌ Cleared');
        lastToken = currentToken;
        setToken(currentToken);
        if (currentToken) {
          setTimeout(() => refetch(), 100);
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [refetch, token]);

  /* ============ INTERACTION HANDLER ============ */
  const handleInteractionCapture = () => {
    if (!isAuthenticated) {
      console.log('🔐 AuthGuard: Opening auth modal...');
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

      {/* Auth Modal with smooth transitions */}
      {!isAuthenticated &&
        showAuth &&
        !isFetching &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl p-6 animate-slideUp">
              <AuthSwitcher />

              <button
                type="button"
                onClick={() => {
                  console.log('❌ AuthGuard: Closing modal');
                  setShowAuth(false);
                }}
                className="absolute font-extrabold top-3 right-3 text-gray-500 hover:text-black transition-colors"
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

