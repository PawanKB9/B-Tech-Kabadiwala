import Image from "next/image";

interface ScrapItemProps {
  id: string;
  scrapName: string;
  imgUrl: string;
  weight: number;
}

export default function ScrapItem({
  id,
  scrapName,
  imgUrl,
  weight = 15.39,
}: ScrapItemProps) {
  return (
    <div className="flex mx-w-xl items-center justify-between border rounded-2xl p-2 mb-2 bg-white shadow-sm">
      {/* Image container must be relative when using fill */}
      <div className="flex gap-3 sm:gap-10">

      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={imgUrl}
          alt={scrapName}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain rounded-lg"
        />

      </div>
        <h3 className="self-center text-sm font-semibold text-gray-800">{scrapName}</h3>
      </div>


      {/* Weight Display */}
      <div className="min-w-[100px] whitespace-nowrap text-center py-3 rounded-lg bg-green-800 text-orange-300 text-lg font-medium">
        {weight} kg
      </div>
    </div>
  );
}
