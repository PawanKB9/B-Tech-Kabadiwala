"use client";

import Image from "next/image";

export default function ScrapArticle({
  articleData,
}: {
  articleData: { title: string; content: Array<string> };
}) {
  return (
    <section className="relative  w-full max-w-3xl mx-auto mt-4 overflow-hidden">
      {/* Background Logo */}
      <div className="absolute inset-10 z-0 flex justify-center items-center pointer-events-none">
        <Image
          src="/17988265.png"
          alt="Background logo"
          fill
          className="object-contain opacity-40"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative backdrop-blur-[3px] rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 border border-gray-100">
        {articleData.title ? (
          <h1 className="text-lg sm:text-xl font-bold text-center text-green-700 mb-4 leading-snug drop-shadow-sm">
            {articleData.title}
          </h1>
        ) : null}

        {articleData.content.length > 0 ? (
          <div className="flex flex-col gap-4 text-gray-700  sm:text-lg leading-relaxed">
            {articleData.content.map((item, index) => (
              <p key={index} className="text-justify">
                &bull; {item}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center italic">
            No content available.
          </p>
        )}
      </div>
    </section>
  );
}