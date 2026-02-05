"use client";

import Image from "next/image";

interface PromoCardProps {
  l1: string;
  l2: string;
  image?: string;
  index: number;
}

export default function PromoCard({
  l1,
  l2,
  image,
  index,
}: PromoCardProps) {
  const isReversed = index % 2 !== 0;

  return (
    <div
      className={`flex w-full lg:px-12 ${
        !isReversed ? "flex-row-reverse" : ""
      } items-center justify-between gap-3 p-2 sm:p-4 bg-white rounded-2xl shadow-sm`}
    >
      {/* Image */}
      <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0">
        {image && (
          <Image
            src={image}
            alt={`${l1} ${l2}`}
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 300px"
            className="object-contain rounded-lg"
          />
        )}
      </div>

      {/* Text */}
      <div
        className={`text-lg phone:text-xl lg:text-2xl font-bold text-green-700 ${
          isReversed ? "text-right" : "text-left"
        }`}
      >
        <p>{l1}</p>
        <p>{l2}</p>
      </div>
    </div>
  );
}
