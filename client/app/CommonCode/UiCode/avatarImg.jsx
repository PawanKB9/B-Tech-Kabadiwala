
import Image from "next/image";

export default function ImageWithFallback({
  image,
  name = "Scrap | Faculty",
  width = 100,
  height = 100,
  className = ""
}) {
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=10B981&color=fff&bold=true&size=300`;

  return (
    <>
      {image ? (
        <Image
          src={image}
          alt={name}
          width={width}
          height={height}
          className={className}
        />
      ) : (
        <img
          src={fallbackUrl}
          alt={`${name} Avatar`}
          width={width}
          height={height}
          className={className}
        />
      )}
    </>
  );
}
