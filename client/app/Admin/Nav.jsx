import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  BarChart3,
  UserCog,
  PlusSquare,
} from "lucide-react";

const VerticalNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      label: "Add Order",
      icon: PlusSquare,
      path: "/admin/add-order",
    },
    {
      label: "App Data",
      icon: BarChart3,
      path: "/admin/app-data",
    },
    {
      label: "Admin User",
      icon: UserCog,
      path: "/admin/admin-user",
    },
  ];

  return (
    <div className="bg-white w-full md:space-y-8 fixed left-0 top-0 z-50 md:w-20 shadow-sm py-3 md:py-4 px-1 md:px-0 flex md:flex-col justify-between items-center gap-2 md:gap-6 ">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex md:flex-col md:space-y-2 items-center md:justify-center gap-2 px-2 md:px-0 py-2 rounded-md transition ${
              isActive
                ? "bg-sky-50 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <div className="text-sm ">{item.label}</div>
          </button>
        );
      })}
    </div>
  );
};

export default VerticalNavBar;
