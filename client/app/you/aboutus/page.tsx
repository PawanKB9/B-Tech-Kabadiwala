"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Linkedin } from "lucide-react";

export default function AboutUs() {
  const handleMailClick = () => {
    window.location.href = "mailto:220104041@hbtu.ac.in";
  };

  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/pawan-bind-27b126276/", "_blank");
  };

  return (
    <main className="h-[100vh] pb-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 sm:px-8 py-10 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-[1280px] mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 mb-4">
          About <span className="text-gray-900">B Tech Kabadiwala</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          We are on a mission to make recycling{" "}
          <span className="font-semibold text-green-700">
            simple, digital, and rewarding
          </span>
          . B Tech Kabadiwala empowers people to recycle smartly — turning
          household scrap into value, while helping protect our planet.
        </p>
      </section>

      {/* Founder Section */}
      <section className="w-full max-w-[1280px] bg-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:gap-20 gap-6 p-6 sm:p-8 mb-10">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
          <Image
            src="/currency_india.jpg" // Replace if you have an image
            alt="Founder Pawan Kumar Bind"
            fill
            className="object-cover"
          />
        </div>

        <div className="text-center sm:text-left flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-green-700">Pawan Kumar Bind</h2>
          <p className="text-gray-600">Founder, B Tech Kabadiwala</p>
          <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
            <MapPin className="w-4 h-4 text-green-600" /> Kanpur, Uttar Pradesh
          </p>

          <div className="flex gap-4 justify-center sm:justify-start mt-3">
            <button
              onClick={handleMailClick}
              className="flex items-center gap-2 text-green-700 hover:underline focus:outline-none"
            >
              <Mail className="w-4 h-4" /> Email
            </button>

            <button
              onClick={handleLinkedInClick}
              className="flex items-center gap-2 text-green-700 hover:underline focus:outline-none"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </button>
          </div>
        </div>
      </section>

      {/* Mission + Values Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[1280px]">
        <div className="bg-green-100 rounded-2xl p-5 sm:p-7 hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-green-800 mb-2">♻️ Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            To revolutionize India’s recycling ecosystem by integrating technology,
            sustainability, and convenience into one digital platform.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-5 sm:p-7 hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-green-800 mb-2">🚛 Smart Scrap Pickup</h3>
          <p className="text-gray-700 leading-relaxed">
            Schedule doorstep scrap collection easily — track your order, earn instantly,
            and help create a cleaner environment.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-5 sm:p-7 hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-green-800 mb-2">💚 Sustainability First</h3>
          <p className="text-gray-700 leading-relaxed">
            Every recycled item contributes to reducing landfill waste and conserving
            resources for future generations.
          </p>
        </div>

        <div className="bg-green-100 rounded-2xl p-5 sm:p-7 hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-green-800 mb-2">🤝 Community Impact</h3>
          <p className="text-gray-700 leading-relaxed">
            Empowering people to earn responsibly while taking part in a sustainable future
            — because every small action matters.
          </p>
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="mt-10 text-center pb-4 text-gray-600 text-sm border-t border-gray-200 pt-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-green-700">B Tech Kabadiwala</span>. All Rights
        Reserved.
      </footer>
    </main>
  );
}
