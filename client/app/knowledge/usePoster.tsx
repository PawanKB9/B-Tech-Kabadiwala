"use client";

import { useEffect, useState } from "react";
import GlobalLoader from "../CommonCode/UiCode/GlobalLoader";
import { useGetAppDataQuery } from "../RTK Query/appApi";
import { useCaptcha } from "../CommonCode/auth/captchaHook";
import HeroSlider from "./PosterSlider";


export default function UsePoster() {
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
          autoplayBanner,
        } = data;

        return(
            <HeroSlider images={autoplayBanner} />
        )

}