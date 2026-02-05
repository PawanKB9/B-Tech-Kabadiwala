"use client";

import Image from "next/image";

type ScrapArticleProps = {
  articleData: {
    title?: string;
    content?: string[];
  };
};

export default function ScrapArticle({ articleData }: ScrapArticleProps) {
  const content = Array.isArray(articleData.content)
    ? articleData.content
    : [];

  return (
    <section className="relative w-full max-w-3xl mx-auto mt-4 overflow-hidden">
      {/* Background Logo */}
      <div className="absolute inset-10 z-0 flex justify-center items-center pointer-events-none">
        <Image
          src="/17988265.png"
          alt="Background logo"
          fill
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 300px"
          className="object-contain opacity-40"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative backdrop-blur-[3px] rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 border border-gray-100">
        {articleData.title && (
          <h2 className="text-lg sm:text-xl font-bold text-center text-green-700 mb-4 leading-snug drop-shadow-sm">
            {articleData.title}
          </h2>
        )}

        {content.length > 0 ? (
          <ul className="flex flex-col gap-3 text-gray-700 sm:text-lg leading-relaxed list-disc pl-5">
            {content.map((item, index) => (
              <li key={index} className="text-justify">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center italic">
            No content available.
          </p>
        )}
      </div>
    </section>
  );
}
