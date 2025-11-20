"use client";

import { Shield, FileText, Lock, Scale, Users } from "lucide-react";

export default function PoliciesAgreement() {
  return (
    <main className="h-[100vh] pb-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 sm:px-8 py-10 flex flex-col items-center">
      
      {/* Header */}
      <section className="text-center max-w-[900px] mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 mb-4">
          Policies & Agreements
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Welcome to <span className="font-semibold text-green-700">B Tech Kabadiwala</span>.  
          We value your trust and transparency. Please read our policies carefully to understand how we protect your data, ensure fairness, and promote sustainability.
        </p>
      </section>

      {/* Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1280px] w-full">
        {/* Privacy Policy */}
        <div className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-6 h-6 text-green-700" />
            <h2 className="text-lg font-semibold text-green-800">Privacy Policy</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            We collect minimal personal data such as your name, contact details, and location 
            only for the purpose of scheduling pickups and improving our services.  
            Your data is stored securely and never shared with third parties without consent.
          </p>
        </div>

        {/* Terms of Use */}
        <div className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-green-700" />
            <h2 className="text-lg font-semibold text-green-800">Terms of Use</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            By using our platform, you agree to provide accurate information and comply 
            with our recycling policies. Misuse of the platform or fraudulent activities 
            may lead to account suspension or termination.
          </p>
        </div>

        {/* Fair Trade & Weight Agreement */}
        <div className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Scale className="w-6 h-6 text-green-700" />
            <h2 className="text-lg font-semibold text-green-800">Fair Weight & Pricing Policy</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            We ensure transparent weighing of your scrap materials in your presence.
            Pricing is based on real-time market rates and displayed before pickup confirmation.  
            Our team follows fair trade practices at every stage.
          </p>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-green-700" />
            <h2 className="text-lg font-semibold text-green-800">User Responsibilities</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Users must ensure that materials provided for pickup are safe, non-hazardous,
            and recyclable. Any violation of environmental or legal guidelines will not be tolerated.
          </p>
        </div>

        {/* Refund & Cancellation */}
        <div className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-green-700" />
            <h2 className="text-lg font-semibold text-green-800">Refund & Cancellation Policy</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            If you cancel your pickup before dispatch, there are no charges.  
            Once pickup has begun, refunds or changes are not allowed unless
            there is a verified service issue from our end.
          </p>
        </div>
      </section>

      {/* Agreement Section */}
      <section className="max-w-[900px] mt-12 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-3">
          User Agreement
        </h3>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
          By continuing to use <span className="font-semibold text-green-700">B Tech Kabadiwala</span>,  
          you confirm that you have read, understood, and agreed to all the above-mentioned 
          terms, conditions, and policies.
        </p>
        <button className="px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-all">
          I Agree
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm text-center border-t pb-4 border-gray-200 pt-4">
        © {new Date().getFullYear()} <span className="font-semibold text-green-700">B Tech Kabadiwala</span>.  
        All Rights Reserved.
      </footer>
    </main>
  );
}
