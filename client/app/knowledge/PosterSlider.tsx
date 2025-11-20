"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
  const slides = [
    "/earth_plant.jpg",
    "/environment_recycle.jpg",
    "/gettyimages-1200963979-612x612.jpg",
    "/people_recycle.jpg"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-md">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="w-full h-[200px] sm:h-[300px] md:h-[400px]"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
