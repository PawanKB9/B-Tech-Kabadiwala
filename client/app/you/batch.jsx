"use client";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

export default function BatchCard({ 
  img_url, 
  name,  
}) {

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-[156px] max-w-[180px] w-[40vw] sm:w-[200px] flex-shrink-0 hover:shadow-md transition-all duration-200">
      
      {/* Image */}
      <div className="relative flex justify-end items-end min-w-[145Px] max-w-[220px] w-full h-24 sm:h-32 bg-gray-50">
        <Image
          src={img_url}
          alt={name}
          fill
          // unoptimized // remove in production
          className="object-cover w-full h-24 sm:h-32"
          sizes="(max-width: 640px) 100vw, 180px"
        />
      </div>


      {/* Content */}
      <div className="p-2 flex flex-col gap-1.5">
          <h2 className="text-sm sm:text-base font-semibold text-green-600 line-clamp-1">{name}</h2>
      </div>
    </div>
  );
}
