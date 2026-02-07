"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import ProductCard from "./card";
import { useGetProductsByCenterQuery } from "../RTK Query/appApi";
import { SampleProducts } from "../CommonCode/Data/SampleData";

/* ---------------- TYPES ---------------- */
type DailyProduct = {
  _id?: string;
  id?: string;
  imgUrl: string;
  scrapName: string;
  rate: number;
  category: string;
  isActive: boolean;
  minWeight: number;
};

export default function SearchScrap() {
  const centerId = process.env.NEXT_PUBLIC_CENTERID;

  const { data: apiData, isLoading, isError } =
    useGetProductsByCenterQuery({ centerId });

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<DailyProduct[]>([]);

  /* ---------------- INITIAL SAMPLE (SAFE DEFAULT) ---------------- */
  const initialSample = useMemo(
    () =>
      (SampleProducts["Daily Scraps"] ?? []).filter(
        (p: DailyProduct) => p.isActive
      ),
    []
  );

  const [products, setProducts] =
    useState<DailyProduct[]>(initialSample);

  /* ---------------- REPLACE WITH API DATA IF VALID ---------------- */
  useEffect(() => {
    const hasApiData =
      apiData && Object.keys(apiData).length > 0;

    if (hasApiData) {
      const apiProducts = (apiData["Daily Scraps"] ?? []).filter(
        (p: DailyProduct) => p.isActive
      );

      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      }
    }
    // if API fails → keep sample data silently
  }, [apiData]);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setFiltered([]);
      return;
    }

    const lower = value.toLowerCase();

    const results = products.filter((item) =>
      item.scrapName.toLowerCase().includes(lower)
    );

    setFiltered(results);
  };

  const clearSearch = () => {
    setQuery("");
    setFiltered([]);
  };

  /* ---------------- RENDER ---------------- */
  if (isLoading) return null;

  return (
    <div className="flex flex-col mt-3 px-4 sm:px-12 items-center">
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-3xl bg-green-100 border border-green-300 rounded-lg px-3 py-2 shadow-sm">
        <Search className="text-green-900 w-5 h-5 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search your scrap material"
          className="flex-1 bg-transparent outline-none text-green-900 placeholder-green-900/70 px-2"
        />
        {query && (
          <button onClick={clearSearch}>
            <X className="text-green-900 w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {query && (
        <section className="w-full px-3 py-3">
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            {query}
            {isError && (
              <span className="ml-2 text-sm text-red-500">
                (Showing sample items)
              </span>
            )}
          </h2>

          <div className="flex gap-4 sm:gap-6 justify-start overflow-x-auto scrollbar-hide">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const id = item._id ?? item.id!;
                return (
                  <div key={id} className="flex-shrink-0">
                    <ProductCard
                      scrapName={item.scrapName}
                      rate={item.rate}
                      imgUrl={item.imgUrl}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">
                No matching materials found.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}


// "use client";

// import { useState, useMemo } from "react";
// import { Search, X } from "lucide-react";
// import ProductCard from "./card";
// import { useGetProductsByCenterQuery } from "../RTK Query/appApi";
// import { SampleProducts } from "../CommonCode/Data/SampleData";

// /* ---------------- TYPES ---------------- */
// type DailyProduct = {
//   _id: string;
//   imgUrl: string;
//   scrapName: string;
//   rate: number;
//   category: string;
//   isActive: boolean;
//   minWeight: number;
// };

// export default function SearchScrap() {
//   const centerId = process.env.NEXT_PUBLIC_CENTERID

//   const { data, isLoading, isError } =
//     useGetProductsByCenterQuery({centerId});

//   const [query, setQuery] = useState("");
//   const [filtered, setFiltered] = useState<DailyProduct[]>([]);

//   /* ---------------- DAILY SCRAPS ONLY ---------------- */
//   const dailyScraps: DailyProduct[] = useMemo(() => {
//     if (!data) return [];
//     return (data["Daily Scraps"] ?? []).filter(
//       (p: DailyProduct) => p.isActive
//     );
//   }, [data]);

//   /* ---------------- SEARCH ---------------- */
//   const handleSearch = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     setQuery(value);

//     if (!value.trim()) {
//       setFiltered([]);
//       return;
//     }

//     const lower = value.toLowerCase();

//     const results = dailyScraps.filter((item) =>
//       item.scrapName.toLowerCase().includes(lower)
//     );

//     setFiltered(results);
//   };

//   const clearSearch = () => {
//     setQuery("");
//     setFiltered([]);
//   };

//   if (isLoading || isError) return null;

//   return (
//     <div className="flex flex-col px-4 sm:px-12 items-center">
//       {/* Search Bar */}
//       <div className="flex items-center w-full max-w-3xl bg-green-100 border border-green-300 rounded-lg px-3 py-2 shadow-sm">
//         <Search className="text-green-900 w-5 h-5 flex-shrink-0" />
//         <input
//           type="text"
//           value={query}
//           onChange={handleSearch}
//           placeholder="Search your scrap material"
//           className="flex-1 bg-transparent outline-none text-green-900 placeholder-green-900/70 px-2"
//         />
//         {query && (
//           <button onClick={clearSearch}>
//             <X className="text-green-900 w-5 h-5" />
//           </button>
//         )}
//       </div>

//       {/* Search Results */}
//       {query && (
//         <section className="w-full px-3 py-3">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">
//             {query}
//           </h2>

//           <div className="flex gap-4 sm:gap-6 justify-start overflow-x-auto scrollbar-hide transition-all duration-300">
//             {filtered.length > 0 ? (
//               filtered.map((item) => (
//                 <div key={item._id} className="flex-shrink-0">
//                   <ProductCard
//                     scrapName={item.scrapName}
//                     rate={item.rate}
//                     imgUrl={item.imgUrl}
//                   />
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 italic">
//                 No matching materials found.
//               </p>
//             )}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }
