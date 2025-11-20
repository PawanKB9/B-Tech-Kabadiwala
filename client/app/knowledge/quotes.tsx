import Image from "next/image";

interface PromoCardProps {
  l1: string;
  l2: string;
  image: string;
  index: number; // used to alternate layout
}

export default function PromoCard({ l1, l2, image, index }: PromoCardProps) {
  const isReversed = index % 2 !== 0; // alternate layout

  return (
    <div
      className={`flex w-full lg:px-12 ${
        !isReversed ? "flex-row-reverse" : ""
      } items-center justify-between gap-3 p-2 sm:p-4 bg-white rounded-2xl shadow-sm`}
    >
      {/* Image */}
      <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0">
        <Image
          src={image}
          alt={l2}
          fill
          className="object-contain rounded-lg"
        />
      </div>

      {/* Text */}
      <div
        className={`text-left text-lg phone:text-xl lg:text-2xl text-nowrap font-bold text-green-700 ${
          isReversed ? "text-right" : ""
        }`}
      >
        <p>{l1}</p>
        <p>{l2}</p>
      </div>
    </div>
  );
}
