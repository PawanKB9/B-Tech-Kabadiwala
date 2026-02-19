"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "How does B Tech Kabadiwala work?",
    answer:
      "We collect scrap directly from your doorstep. Just schedule a pickup through our app or website. Our verified agent visits, weighs your scrap transparently, and you receive instant payment — digitally or in cash.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Absolutely! We use secure encryption and never share your information with any third party. Your data is only used for pickup scheduling and service updates.",
  },
  {
    question: "How can I cancel or reschedule a pickup?",
    answer:
      "You can cancel or reschedule your pickup anytime before the agent is dispatched — directly from the 'My Orders' section of your app.",
  },
  {
    question: "What type of scrap do you accept?",
    answer:
      "We accept household and commercial recyclables — including paper, metal, iron, e-waste, and plastic. However, hazardous waste like batteries or chemicals are not accepted.",
  },
  {
    question: "How can I track my order or payment?",
    answer:
      "Once your scrap is picked up, you can track its progress and payment confirmation through your order history page in the app.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // NEXT_PUBLIC_HELP_PHONE=8005000270
// NEXT_PUBLIC_HELP_MAIL=BTECHKABADIWALA@ZOHOMAIL.IN

const helpPhone = process.env.NEXT_PUBLIC_HELP_PHONE || "8005000270";
const helpMail = process.env.NEXT_PUBLIC_HELP_MAIL || "BTECHKABADIWALA@ZOHOMAIL.IN";

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="h-[100vh] pb-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 sm:px-8 py-10 flex flex-col items-center">
      
      {/* Header */}
      <section className="text-center max-w-[900px] mb-10">
        <h1 className="text-5xl sm:text-5xl font-extrabold text-green-700">
            B Tech Kabadiwala
        </h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <HelpCircle className="w-7 h-7 text-green-700" />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700">
            Help Center
          </h1>
        </div>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Got questions? We’re here to help.  
          Explore our FAQs or contact us directly for personalized assistance.
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="w-full max-w-[900px] bg-white rounded-2xl shadow-md p-4 sm:p-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 last:border-none">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
            >
              <h3 className="text-base sm:text-lg font-medium text-gray-800">
                {faq.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-green-600 transition-transform" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 transition-transform" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-700 text-sm sm:text-base pb-4 pl-1 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Contact Section */}
      <section className="text-center max-w-[700px] mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-3">
          Still need help?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-5">
          Our support team is available 9 AM – 8 PM to assist you with any issues or questions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          
          {/* Email */}
          <button
            type="button"
            onClick={() => (window.location.href = "mailto:" + helpMail)}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-all shadow-sm"
          >
            <Mail className="w-4 h-4" /> Email Support {helpMail}
          </button>

          {/* Phone */}
          <button
            type="button"
            onClick={() => (window.location.href = 'tel:' + helpPhone)}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full hover:bg-green-200 transition-all shadow-sm"
          >
            <Phone className="w-4 h-4" /> +91 {helpPhone}
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={() =>
              window.open("https://wa.me/" + helpPhone + "?text=Hello%20B%20Tech%20Kabadiwala%20Team!", "_blank")
            }
            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Chat +91 {helpPhone}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pb-4 text-gray-600 text-sm text-center border-t border-gray-200 pt-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-green-700">B Tech Kabadiwala</span>.  
        All Rights Reserved.
      </footer>
    </main>
  );
}
