"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/app/CommonCode/UiCode/avatarImg";

export type FacultyCardProps = {
  name: string;
  designation: string;
  department: string;
  supportingRole: string;
  image?: string;
  isHighlighted?: boolean;
};

export default function FacultyCard({
  name,
  designation,
  department,
  supportingRole,
  image,
  isHighlighted = false,
}: FacultyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Glass Card */}
      <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:border-white/20">

        {/* Glowing Avatar Wrapper */}
        <div className="relative flex justify-center mb-6">
          
          {/* Glow Ring */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 blur-2xl opacity-40 group-hover:opacity-70 transition duration-500"></div>

          {/* Avatar Container */}
          <div className="relative w-40 h-40 rounded-full p-[3px] bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400">
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              <ImageWithFallback
                image={image}
                name={name}
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Dr. {name}
          </h3>

          <p className="mt-1 text-emerald-400 text-sm font-medium">
            {designation}
          </p>

          <p className="mt-1 text-gray-400 text-sm">
            {department}
          </p>

          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            {supportingRole}
          </p>
        </div>

        {/* Mentor Badge */}
        {isHighlighted && (
          <div className="absolute top-6 right-6 text-xs px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold shadow-lg">
            Mentor
          </div>
        )}
      </div>
    </motion.div>
  );
}

