"use client";

import { Mail, Phone, User, MapPin } from "lucide-react";

export default function AdminUserDetails({ admin }) {
  return (
    <div className=" md:mt-4 mx-auto py-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-300">
        <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">
          {admin.role || "Admin User"}
        </h2>

        <div className="space-y-4">
          <DetailRow icon={<User className="text-orange-600" />} label={admin.name} />
          <DetailRow icon={<Mail className="text-orange-600" />} label={admin.email} />
          <DetailRow icon={<Phone className="text-orange-600" />} label={admin.phone} />
          <DetailRow icon={<Phone className="text-orange-600" />} label={admin.altPhone} />
        </div>

        {admin.location && (
          <div className="mt-6 p-4 border rounded-lg bg-orange-50">
            <h3 className="font-semibold mb-2 text-orange-700">Location</h3>
            <p className="text-gray-700">{admin.location.address || "No address"}</p>
            <p className="text-gray-700">Pincode: {admin.location.pincode || "N/A"}</p>
            <p className="text-gray-700">ELoc: {admin.location.eLoc || "N/A"}</p>
            <p className="text-gray-700 mt-1">
              Coordinates: {admin.location.coordinates?.join(", ") || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <p className="text-gray-800 font-medium">{label || "N/A"}</p>
    </div>
  );
}