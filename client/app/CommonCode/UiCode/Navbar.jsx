"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  User,
  ShoppingCart,
  // History,
  Lightbulb,
} from "lucide-react";
// import Link from "next/link";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Knowledge", href: "/knowledge", icon: Lightbulb },
  // { name: "Records", href: "/record", icon: History },
  { name: "You", href: "/you", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [history, setHistory] = useState([]);

  // Track navigation history
  useEffect(() => {
    if (pathname === "/") {
      // Visiting home resets the navigation history
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, pathname]);
    }
  }, [pathname]);

  // Handle back button click
  useEffect(() => {
    const handlePopState = () => {
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory.pop();
        return newHistory;
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavClick = (href) => {
    router.push(href);
  };

  return (
      <nav
        className="
          fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 isolate
          backdrop-blur-none filter-none lg:static lg:z-50 lg:border-none lg:shadow-none lg:mt-0 lg:flex lg:justify-center">

      <ul className="flex justify-around items-center lg:justify-center lg:space-x-16 py-2 lg:py-4">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li
              key={name}
              onClick={() => handleNavClick(href)}
              className={`flex flex-col items-center cursor-pointer transition lg:flex-row lg:space-x-2 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <Icon className={`w-6 h-6 lg:hidden`} />
              <span
                className={`text-xs lg:text-base font-medium ${
                  isActive
                    ? "lg:border-b-2 lg:border-green-600"
                    : "lg:border-b-2 lg:border-transparent"
                }`}
              >
                {name}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
