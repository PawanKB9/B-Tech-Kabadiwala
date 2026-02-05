
// Removed Card component dependency
import { MapPin, Phone, Users, Clock } from "lucide-react";

// Types (Optional: You can remove if types are already defined elsewhere)
export default function CenterDetails({ center }) {
  if (!center) return <p>No center details available.</p>;

  return (
    <div className="p-6 w-full mx-auto rounded-2xl text-gray-800 shadow-md border bg-white">
      <h2 className="text-2xl font-semibold mb-4">Center Details</h2>

      <div className="space-y-4">
        {/* IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <DetailItem label="Center ID" value={center.id} /> */}
          <DetailItem label="Manager ID" value={center.managerId} />
          {/* <DetailItem label="Store ID" value={center.storeId || "N/A"} /> */}
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            label="Delivery Boys"
            value={center.deliveryBoys?.length ? center.deliveryBoys.join(", ") : "None"}
            icon={<Users />}
          />
          <DetailItem
            label="Helpers"
            value={center.helperIds?.length ? center.helperIds.join(", ") : "None"}
            icon={<Users />}
          />
        </div>

        {/* Location */}
        <div className="border-2 p-2 rounded-lg ">
          <p>{center.location.address}</p>
          <p>{center.location.pincode}</p>
          <DetailItem
            label="Location (Coordinates)"
            value={center.location ? `${center.location.coordinates[1]}, ${center.location.coordinates[0]}` : "N/A"}
            icon={<MapPin />}
          />
        </div>
        {/* HelpLine */}
        {center.helpLine && (
          <div className="p-4 bg-gray-50 rounded-xl border">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5" /> Helpline
            </h3>
            <div className="space-y-1">
              <DetailItem label="Phone" value={center.helpLine.phone} />
              <DetailItem label="Email" value={center.helpLine.email} />
              <DetailItem label="WhatsApp" value={center.helpLine.whatsapp} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="flex gap-4 p-3 border rounded-xl bg-gray-50">
      <span className="font-medium text-gray-600 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span className="text-gray-900 break-words">{value}</span>
    </div>
  );
}
