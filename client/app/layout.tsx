import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { UserProvider } from "./Contexts/UserContext";
import Navbar from "./CommonCode/UiCode/Navbar";
import Providers from "./provider";
import CaptchaProvider from "./CommonCode/auth/captchaProvider";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import ToastProvider from "./CommonCode/HelperComp/toastProvider";

import Script from "next/script"

<Script
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  strategy="afterInteractive"
/>


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  metadataBase: new URL("https://btechkabadiwala.in"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "B Tech Kabadiwala | Scrap Pickup Service in Kanpur",
    template: "%s | B Tech Kabadiwala",
  },
  description:
    "B Tech Kabadiwala provides doorstep scrap pickup in Kanpur. Sell paper, iron, plastic, e-waste at best prices. Call or WhatsApp 7518315870.",
  keywords: [
    "kabadiwala in kanpur",
    "scrap pickup kanpur",
    "sell scrap online",
    "e-waste recycling kanpur",
    "b tech kabadiwala",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-zinc-100 text-gray-800"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CaptchaProvider>
          <LocalBusinessSchema />

            {/* NAVBAR — NEVER BLURS */}
            <div className="relative z-50 isolate">
              <Navbar />
            </div>

            {/* APPLICATION CONTENT */}
            <div className="relative z-10">
              <UserProvider>
                {children}
                <ToastProvider/>
              </UserProvider>
            </div>

          </CaptchaProvider>
        </Providers>
      </body>
    </html>
  );
}
