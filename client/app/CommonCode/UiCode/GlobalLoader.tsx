"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GlobalLoader({ isLoading }: { isLoading: boolean }) {
  const [visible, setVisible] = useState(false);

  const phoneNumber = process.env.NEXT_PUBLIC_HELP_PHONE || "8005000270";
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-40 h-40"> {/* animate-pulse */}
          <Image
            src="/icon.png"
            alt="B Tech Kabadiwala"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div onClick={handleWhatsApp} className="text-lg font-bold flex gap-2 cursor-pointer text-gray-800">
          <p onClick={handleCall}>Call +</p>
          <p> WhatsApp:</p>
          <p>8005000270</p>
        </div>

        {/* Light modern progress bar */}
        <div className="mt-6 w-48 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 animate-loading-bar" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-loading-bar {
          animation: loadingBar 1.4s linear infinite;
        }
      `}</style>
    </div>
  );
}
