"use client";

import Image from "next/image";

type ScrapArticleProps = {
  articleData: {
    title?: string;
    content?: string[];
  };
};

export default function ScrapArticle({ articleData }: ScrapArticleProps) {
  const coinUrl =
    "https://res.cloudinary.com/dtviazgmp/image/upload/v1764601938/17988265_ktg1kp.png";

  const content = Array.isArray(articleData.content)
    ? articleData.content
    : [];

  return (
    <section className="w-full pb-8 max-w-3xl mx-auto mt-4">
      {/* Content Wrapper */}
      <div className="relative rounded-2xl shadow-md p-6 border border-gray-100 bg-white">
        
        {/* 🔥 WATERMARK IMAGE (FRONT OF TEXT) */}
        <Image
          src={coinUrl}
          alt="Coin watermark"
          width={260}
          height={260}
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            opacity-20
            pointer-events-none
            select-none
            z-10
          "
        />

        {/* TEXT CONTENT */}
        <div className="relative z-20">
          {articleData.title && (
            <h2 className="text-lg sm:text-xl font-bold text-center text-green-700 mb-4">
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
      </div>
    </section>
  );
}



// "use client";

// import Image from "next/image";

// type ScrapArticleProps = {
//   articleData: {
//     title?: string;
//     content?: string[];
//   };
// };



// export default function ScrapArticle({ articleData }: ScrapArticleProps) {

//   const coinUrl = "https://res.cloudinary.com/dtviazgmp/image/upload/v1764601938/17988265_ktg1kp.png"
//   const content = Array.isArray(articleData.content)
//     ? articleData.content
//     : [];

//   return (
//     <section className="relative w-full max-w-3xl mx-auto mt-4 overflow-hidden">
//       {/* Background Logo with Blur */}
//       <div className="absolute inset-10 z-0 pointer-events-none">
//       <div className="relative w-full h-full">
//         <Image
//           src={coinUrl}
//           alt="Background logo"
//           fill
//           className="object-contain opacity-30 blur-sm"
//         />
//       </div>  
//     </div>

//       {/* Content Wrapper - No blur here */}
//       <div className="relative rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 border border-gray-100 bg-white bg-opacity-95">
//         {articleData.title && (
//           <h2 className="text-lg sm:text-xl font-bold text-center text-green-700 mb-4 leading-snug drop-shadow-sm">
//             {articleData.title}
//           </h2>
//         )}

//         {content.length > 0 ? (
//           <ul className="flex flex-col gap-3 text-gray-700 sm:text-lg leading-relaxed list-disc pl-5">
//             {content.map((item, index) => (
//               <li key={index} className="text-justify">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500 text-center italic">
//             No content available.
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }
