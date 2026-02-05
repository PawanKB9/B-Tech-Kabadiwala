"use client";
// import React from "react";

/**
 * OrderTracker
 * Props:
 *  - status: string key of current status (e.g. "confirmed", "pickup", "arrived", "sold")
 *  - steps: optional array of step objects { key, title, description } (if omitted default steps used)
 *
 * Notes:
 *  - The container has a responsive min-height so spacing remains pleasant on phones and scales up on larger screens.
 *  - The green progress bar height is computed from the active index and fills the connecting line up to that step.
 */
export default function OrderTracker({ status = "confirmed", steps: customSteps }) {
  // console.log(status)
  const defaultSteps = [
    {
      key: "confirmed",
      title: "Order Confirmed",
      description: "Ordered at : 10 AM 9 Oct 2025",
    },
    {
      key: "Out for Pickup",
      title: "Out For Pickup",
      description: "Pickup Person: Name of Person\nContact: Person’s contact",
    },
    {
      key: "Arrived",
      title: "Arrived",
      description: "",
    },
    {
      key: "Sold",
      title: "Sold",
      description: "",
    },
  ];

  let finalStatus = status;
  if(status === "Picked") {
    finalStatus = "Sold";
  }

  const steps = customSteps ?? defaultSteps;
  const activeIndex = Math.max(0, steps.findIndex((s) => s.key === finalStatus));
  const lastIndex = steps.length - 1;
  // If active not found, treat as 0 (none active) — but activeIndex already bounded above
  // progressPercent: fraction from 0% up to 100% when last step reached
  const progressPercent =
    lastIndex > 0 ? (Math.min(activeIndex, lastIndex) / lastIndex) * 100 : 0;

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md sm:p-6 border py-3 border-gray-200">
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Track Your Order
      </h2>

      {/* Timeline area: mobile-first min height; increases on larger screens */}
      <div className="relative flex pl-[4%] ">
        {/* Vertical base line (gray) */}
        <div className="left-[4%] ml-3.5 absolute top-4 bottom-4 w-[2px] bg-gray-300 rounded" />
        
        {/* Progress overlay: green bar whose height is % of the total vertical line */}
        {/* top offset matches the base line top (top-4) */}
        <div
          className=" absolute left-[4%] ml-3.5 top-4 w-[2px] bg-green-600 rounded origin-top"
          style={{ height: `${progressPercent}%` }}
        />

        {/* Steps container: distribute steps evenly with justify-between */}
        <div className="flex flex-col justify-between h-[260px] sm:h-[340px] md:h-[420px] relative z-10">
          {steps.map((step, i) => {
            const isCompleted = i <= activeIndex;
            const isCurrent = i === activeIndex;

            return (
              <div key={step.key} className=" flex items-center">
                {/* Circle */}
                <div className=" flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ring-2 ${
                      isCompleted
                        ? "bg-green-600 ring-green-600"
                        : "bg-white ring-gray-300"
                    }`}
                  >
                    {/* optional check icon for completed steps */}
                    {isCompleted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className={`w-4 h-4 ${isCurrent ? "scale-110" : ""}`}
                      >
                        <path d="M9.00039 16.2L4.80039 12.0L3.40039 13.4L9.00039 19.0L21.0004 7.00001L19.6004 5.60001L9.00039 16.2Z" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                  </div>
                </div>

                {/* Text */}
                <div className="ml-4">
                  <h3
                    className={`font-semibold text-base sm:text-lg ${
                      isCompleted ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p
                      className={`text-sm sm:text-base whitespace-pre-line mt-1 ${
                        isCompleted ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
