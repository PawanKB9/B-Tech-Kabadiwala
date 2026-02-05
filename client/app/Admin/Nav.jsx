"use client";

import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, BarChart3, UserCog, PlusSquare } from "lucide-react";

export default function VerticalNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Orders", icon: ShoppingCart, path: "/Admin/orderStatus" },
    { label: "Add Order", icon: PlusSquare, path: "/Admin/adminPlaceOrder" },
    { label: "App Data", icon: BarChart3, path: "/Admin/appData" },
    { label: "Admin User", icon: UserCog, path: "/Admin/adminAuth/user" },
  ];

  return (
    <div className="bg-white fixed left-0 top-0 shadow-sm laptop:w-20 w-full py-4 px-2 flex laptop:flex-col items-center gap-6">
      {navItems.map((item, i) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;

        return (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition ${
              isActive ? "bg-sky-50 text-red-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
