"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Linkedin } from "lucide-react";

import { useGetAppDataQuery } from "@/app/RTK Query/appApi";
import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";

export default function AboutUs() {
  const { getCaptchaToken } = useCaptcha();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    data: appData,
    isLoading,
    isError,
    error,
  } = useGetAppDataQuery(
    { captchaToken },
    {
      skip: captchaToken === "__BLOCKED__",
    }
  );

  useEffect(() => {
    const maybeRequestCaptcha = async () => {
      if (!error) return;

      const err: any = error;

      const captchaRequired =
        err?.status === 403 &&
        err?.data?.captcha_required === true;

      if (!captchaRequired) return;

      const token = await getCaptchaToken("fetch_app_data");

      if (!token) {
        
        setCaptchaToken("__BLOCKED__");
        return;
      }

      setCaptchaToken(token);
    };

    maybeRequestCaptcha();
  }, [error, getCaptchaToken]);

  if (isLoading || !appData) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const { aboutUs } = appData;

  return (
    <main className="h-[100vh] pb-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 sm:px-8 py-10 flex flex-col items-center">
      {/* Hero */}
      <section className="text-center max-w-[1280px] mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 mb-4">
          About <span className="text-gray-900">{aboutUs.info.company}</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {aboutUs.introduction}
        </p>
      </section>

      {/* Founder */}
      <section className="w-full max-w-[1280px] bg-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:gap-20 gap-6 p-6 sm:p-8 mb-10">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <Image
            src={aboutUs.info.url}
            alt={aboutUs.info.name}
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 300px"
            className="object-cover"
            priority
          />
        </div>

        <div className="text-center sm:text-left flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-green-700">
            {aboutUs.info.name}
          </h2>
          <p className="text-gray-600">
            Founder, {aboutUs.info.company}
          </p>

          <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            {aboutUs.info.address}
          </p>

          <div className="flex gap-4 justify-center sm:justify-start mt-3">
            <a
              href={`mailto:${aboutUs.info.email}`}
              className="flex items-center gap-2 text-green-700 hover:underline"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>

            <a
              href={aboutUs.info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-700 hover:underline"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[1280px]">
        <Value title="♻️ Our Vision" text={aboutUs.ourVision} />
        <Value title="🚛 Smart Scrap Pickup" text={aboutUs.smartPickup} />
        <Value title="💚 Sustainability First" text={aboutUs.sustainability} />
        <Value title="🤝 Community Impact" text={aboutUs.communityImpact} />
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center pb-4 text-gray-600 text-sm border-t border-gray-200 pt-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-green-700">
          {aboutUs.info.company}
        </span>
        . All Rights Reserved.
      </footer>
    </main>
  );
}

function Value({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-green-50 rounded-2xl p-5 sm:p-7 hover:shadow-lg transition-all">
      <h3 className="text-xl font-semibold text-green-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
