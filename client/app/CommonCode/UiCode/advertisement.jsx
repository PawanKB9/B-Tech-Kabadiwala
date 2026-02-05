"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Recycle, MessageCircle } from "lucide-react"; // lucide icons

export default function AdSidebar() {
  return (
    <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-b from-green-600 to-green-800 text-white h-screen fixed right-0 top-0 p-6 shadow-2xl rounded-l-3xl z-40">
      {/* Logo and Tagline */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Recycle className="w-8 h-8 text-yellow-300" />
          <h1 className="text-2xl font-bold">B Tech Kabadiwala</h1>
        </motion.div>
        <p className="mt-2 text-sm text-green-100">
          Turning Scrap into Smart Savings 💰♻️
        </p>
      </div>

      {/* Promotional Card */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-6"
      >
        <Image
          src="https://images.unsplash.com/photo-1615397349754-2b0a8e6eae45"
          alt="Scrap Collection"
          width={240}
          height={160}
          unoptimized
          className="rounded-xl mb-3 object-cover"
        />
        <h2 className="text-lg font-semibold">Sell Scrap Online Instantly</h2>
        <p className="text-sm text-green-100 mt-1">
          Book a doorstep pickup for your old electronics, plastic, and metal waste.
        </p>
        <button
          className="mt-4 w-full bg-yellow-400 text-green-900 font-semibold py-2 rounded-lg hover:bg-yellow-300 transition-all"
        >
          Book Pickup
        </button>
      </motion.div>

      {/* Offers / Contact */}
      <div className="mt-6">
        <div className="bg-green-700 p-4 rounded-2xl mb-4">
          <h3 className="font-semibold text-yellow-300 mb-2">This Week’s Offer</h3>
          <ul className="text-sm space-y-1 text-green-100">
            <li>• ₹10/kg bonus on aluminum scrap</li>
            <li>• ₹50 cashback on your first pickup</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-green-100">Need Help?</p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 text-yellow-300 hover:text-yellow-200"
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-center text-green-200 mt-6">
        © 2025 B Tech Kabadiwala. All rights reserved.
      </p>
    </aside>
  );
}
