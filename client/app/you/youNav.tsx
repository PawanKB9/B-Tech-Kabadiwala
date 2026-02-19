"use client";

import { useRouter } from "next/navigation";
import {
  MessageSquare,
  HelpCircle,
  Info,
  FileText,
  History,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  {
    label: "History",
    icon: History,
    path: "/you/history",
  },
  {
    label: "Feedback",
    icon: MessageSquare,
    path: "/you/appfeedback",
  },
  {
    label: "Help",
    icon: HelpCircle,
    path: "/you/help",
  },
  {
    label: "About Us",
    icon: Info,
    path: "/you/aboutus",
  },
  {
    label: "Guiding Mentors",
    icon: GraduationCap,
    path: "/you/Guiding-Mentors",
  },
  {
    label: "Policy & Agreement",
    icon: FileText,
    path: "/you/terms&policy",
  },
];

export default function YouNavigation() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
      {menuItems.map((item, i) => (
        <button
          key={i}
          onClick={() => router.push(item.path)}
          className="flex items-center justify-between w-full px-6 py-3 my-2 hover:bg-gray-50 active:bg-gray-100 transition rounded-xl sm:rounded-none"
        >
          <div className="flex items-center gap-10 lgPhone:gap-16">
            <item.icon className="w-5 h-5 text-green-600 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold text-green-600">
              {item.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}


// "use client";

// import { useRouter } from "next/navigation";
// import { MessageSquare, HelpCircle, Info, FileText, History } from "lucide-react";

// const menuItems = [
//   {
//     label: "History",
//     icon: History,
//     path: "/you/history",
//   },
//   {
//     label: "Feedback",
//     icon: MessageSquare,
//     path: "/you/appfeedback",
//   },
//   {
//     label: "Help",
//     icon: HelpCircle,
//     path: "/you/help",
//   },
//   {
//     label: "About Us",
//     icon: Info,
//     path: "/you/aboutus",
//   },
//   {
//     label: "Policy & Agreement",
//     icon: FileText,
//     path: "/you/terms&policy",
//   },
// ];

// export default function YouNavigation() {
//   const router = useRouter();

//   return (
//     <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
//       {menuItems.map((item, i) => (
//         <button
//           key={i}
//           onClick={() => router.push(item.path)}
//           className="flex items-center justify-between w-full px-6 py-3 my-2 hover:bg-gray-50 active:bg-gray-100 transition rounded-xl sm:rounded-none"
//         >
//           <div className="flex items-center gap-10 lgPhone:gap-16">
//             <item.icon className="w-5 h-5 text-green-600 sm:w-6 sm:h-6" />
//             <span className="text-base sm:text-lg font-semibold text-green-600">
//               {item.label}
//             </span>
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// }
