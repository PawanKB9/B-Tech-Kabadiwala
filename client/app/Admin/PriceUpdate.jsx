import { useState } from "react";
import { Pencil, CheckCheck } from "lucide-react";

const AdminPriceTable = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [prices, setPrices] = useState([
    { material: "Iron", ratePerKg: 50 },
    { material: "Plastic", ratePerKg: 20 },
    { material: "Tin", ratePerKg: 30 },
    { material: "Zinc", ratePerKg: 40 },
  ]);

  const handleChange = (index, value) => {
    const updated = [...prices];
    updated[index].ratePerKg = Number(value);
    setPrices(updated);
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="bg-green-50 border border-green-100 mt-8 p-4 md:p-8 rounded shadow max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleEdit}
          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-semibold"
        >
          {isEditing ? <><CheckCheck size={16} /> Save</> : <><Pencil size={16} /> Edit</>}
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-semibold bg-gradient-to-r from-green-700 to-indigo-100 text-white rounded px-2 py-2 mb-2">
        <div>Material</div>
        <div>Price Per Kg</div>
      </div>

      {/* Table Body */}
      <div className="space-y-2">
        {prices.map((row, ind) => (
          <div
            key={ind}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center px-2 py-1 border-b border-green-300"
          >
            <div className="text-green-900">{row.material}</div>
            {isEditing ? (
              <input
                type="number"
                value={row.ratePerKg}
                onChange={(e) => handleChange(ind, e.target.value)}
                className="border border-green-400 rounded px-2 py-1 text-green-800 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            ) : (
              <div className="text-green-800 font-medium">₹{row.ratePerKg}</div>
            )}
          </div>
        ))}
      </div>

      <div className="h-8 md:hidden"></div>
    </div>
  );
};

export default AdminPriceTable;

