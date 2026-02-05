"use client";

interface SlidingInfoBarProps {
  message?: string;
  speedSeconds?: number;
  onClick?: () => void;
  backgroundClass?: string;
  textClass?: string;
}

export default function SlidingInfoBar({
  message,
  speedSeconds = 18,
  onClick,
  backgroundClass = "bg-red-900",
  textClass = "text-white",
}: SlidingInfoBarProps) {
  const phoneNumber = process.env.NEXT_PUBLIC_HELP_PHONE;

  const finalMessage =
    message ??
    `Call or WhatsApp: +91 ${phoneNumber} for booking, help and support ${phoneNumber}`;

  if (!phoneNumber && !message) return null;

  return (
    <div
      className={`group w-full overflow-hidden ${backgroundClass} ${textClass}`}
    >
      <div
        className="marquee flex cursor-pointer"
        style={{ animationDuration: `${speedSeconds}s` }}
        onClick={onClick}
      >
        <span className="px-6 sm:px-36 py-2 whitespace-nowrap">
          {finalMessage}
        </span>
        <span className="px-6 sm:px-36 py-2 whitespace-nowrap">
          {finalMessage}
        </span>
      </div>

      <style jsx>{`
        .marquee {
          width: fit-content;
          white-space: nowrap;
          animation: marquee linear infinite;
        }

        .group:hover .marquee {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

