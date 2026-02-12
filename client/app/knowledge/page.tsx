"use client";

import { useEffect, useState } from "react";

// import Offers from "../CommonCode/UiCode/offers";
import ScrapArticle from "./Article";
import HeroSlider from "./PosterSlider";
import PromoCard from "./quotes";

import { useCaptcha } from "../CommonCode/auth/captchaHook";
import SlidingInfoBar from "../CommonCode/UiCode/helpBar";
import { useGetAppDataQuery } from "@/app/RTK Query/appApi";
import GlobalLoader from "../CommonCode/UiCode/GlobalLoader";

export default function KnowledgeBase() {
  const { getCaptchaToken } = useCaptcha();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { data, isLoading, error } = useGetAppDataQuery({ captchaToken });

  // ---- captcha retry (same global pattern) ----
  useEffect(() => {
    const handleCaptcha = async () => {
      if (!error) return;

      const err: any = error;
      if (err?.status !== 403 || err?.data?.captcha_required !== true) return;

      const token = await getCaptchaToken("knowledge_base_access");
      if (!token) {
        setCaptchaToken("__BLOCKED__");
        return;
      }

      setCaptchaToken(token);
    };

    handleCaptcha();
  }, [error, getCaptchaToken]);

  if (isLoading || !data) {
    return <GlobalLoader isLoading={isLoading} />;
  }
  
  const {
    offer,
    posters,
    autoplayBanner,
    articles,
  } = data;

  return (
    <main className="w-full z-0 pb-6 bg-zinc-100 h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide mx-auto p-1">
      {/* Offer */}
      {/* <Offers offerMsg={offer} /> */}
      <SlidingInfoBar />

      {/* Hero Slider (autoplay banners) */}
      <div className="my-3">
        <HeroSlider images={autoplayBanner} />
      </div>

      {/* Promo Posters */}
      <div className="flex flex-col sm:flex-row-reverse sm:justify-between lg:gap-[10%] gap-4 mt-4">
        {posters.map(
          (
            item: { imgUrl: string },
            index: number
          ) => (
            <PromoCard
              key={index}
              l1="Promote Recycling"
              l2="Protect Earth"
              image={item.imgUrl}
              index={index}
            />
          )
        )}
      </div>

      {/* Knowledge Articles */}
      <div className="bento-grid">
        {articles.map(
          (
            article: {
              title: string;
              content: string[];
            },
            index: number
          ) => (
            <div
              key={index}
              className={
                index === 0
                  ? "bento-a"
                  : index === 1
                  ? "bento-b"
                  : "bento-c"
              }
            >
              <ScrapArticle articleData={article} />
            </div>
          )
        )}
      </div>
    </main>
  );
}
