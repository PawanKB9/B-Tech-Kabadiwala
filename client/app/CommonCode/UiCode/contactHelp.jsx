"use client";

import Image from "next/image";
import { PhoneCall } from "lucide-react";

const whatsappIcon =
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

export default function ContactHelp() {
  const phoneNumber = process.env.NEXT_PUBLIC_HELP_PHONE;

  // Safety guard (in case env is missing)
  if (!phoneNumber) {
    if (process.env.NODE_ENV === "development") {
      console.warn("NEXT_PUBLIC_HELP_PHONE is not defined");
    }
    return null;
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div className="flex justify-between w-full items-center gap-4 text-green-600 bg-gray-50 px-4 py-2 my-0.5 rounded-xl shadow-md">
      {/* Phone Call */}
      <button
        onClick={handleCall}
        className="hover:scale-110 transition-transform focus:outline-none"
        aria-label="Call"
      >
        <PhoneCall size={24} />
      </button>

      <p>+91 {phoneNumber}</p>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        className="hover:scale-110 transition-transform focus:outline-none"
        aria-label="Open WhatsApp"
      >
        <Image
          src={whatsappIcon}
          alt="WhatsApp"
          width={32}
          height={32}
          className="rounded-md"
        />
      </button>
    </div>
  );
}

