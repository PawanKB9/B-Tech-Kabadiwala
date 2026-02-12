"use client";

import { useEffect, useState } from "react";
import { Shield, FileText, Lock, Scale, Users } from "lucide-react";

import { useGetAppDataQuery } from "@/app/RTK Query/appApi";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
import GlobalLoader from "@/app/CommonCode/UiCode/GlobalLoader";

export default function PoliciesAgreement() {
  const { getCaptchaToken } = useCaptcha();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { data, isLoading, error } = useGetAppDataQuery({ captchaToken });

  // ---- captcha retry (same pattern, no change) ----
  useEffect(() => {
    const runCaptcha = async () => {
      if (!error) return;

      const err: any = error;
      if (err?.status !== 403 || err?.data?.captcha_required !== true) return;

      const token = await getCaptchaToken("policy_access");
      if (!token) {
        setCaptchaToken("__BLOCKED__");
        return;
      }

      setCaptchaToken(token);
    };

    runCaptcha();
  }, [error, getCaptchaToken]);

  const { policyTerms, aboutUs } = data;
  
  if(isLoading || !data) {
    return <GlobalLoader isLoading={isLoading} />;
  }

  return (
    <main className="h-[100vh] pb-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 sm:px-8 py-10 flex flex-col items-center">
      {/* Header */}
      <section className="text-center max-w-[900px] mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 mb-4">
          Policies & Agreements
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-green-700">
            {aboutUs.info.company}
          </span>
          . {policyTerms.introduction}
        </p>
      </section>

      {/* Policy Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1280px] w-full">
        <PolicyCard
          icon={<Lock className="w-6 h-6 text-green-700" />}
          title="Privacy Policy"
          text={policyTerms.privacy}
        />

        <PolicyCard
          icon={<FileText className="w-6 h-6 text-green-700" />}
          title="Terms of Use"
          text={policyTerms.terms}
        />

        <PolicyCard
          icon={<Scale className="w-6 h-6 text-green-700" />}
          title="Fair Weight & Pricing Policy"
          text={policyTerms.fairWeight}
        />

        <PolicyCard
          icon={<Users className="w-6 h-6 text-green-700" />}
          title="User Responsibilities"
          text={policyTerms.userResponsibility}
        />

        <PolicyCard
          icon={<Shield className="w-6 h-6 text-green-700" />}
          title="Refund & Cancellation Policy"
          text={policyTerms.refund}
        />
      </section>

      {/* Agreement */}
      <section className="max-w-[900px] mt-12 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-3">
          User Agreement
        </h3>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
          {policyTerms.userAgreement}
        </p>
        <button className="px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-all">
          I Agree
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm text-center border-t pb-4 border-gray-200 pt-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-green-700">
          {aboutUs.info.company}
        </span>
        . All Rights Reserved.
      </footer>
    </main>
  );
}

/* ------------------ helpers ------------------ */

function PolicyCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition-all">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h2 className="text-lg font-semibold text-green-800">{title}</h2>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
