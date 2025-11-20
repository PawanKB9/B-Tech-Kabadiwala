import { useState } from "react";
import { Pencil } from "lucide-react";

const WeightTable = () => {
  const [weights, setWeights] = useState([
    { material: "Iron", totalWeight: "120" },
    { material: "Plastic", totalWeight: "85" },
    { material: "Tin", totalWeight: "40" },
    { material: "Zinc", totalWeight: "62" },
  ]);

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e, index) => {
    const newWeight = e.target.value;
    setWeights((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, totalWeight: newWeight } : item
      )
    );
  };

  const toggleEdit = (index) => {
    if (editIndex === index) {
      setEditIndex(null); // Save and close edit
    } else {
      setEditIndex(index); // Enable edit
    }
  };

  return (
    <div className="bg-orange-50 mt-18 md:mt-4 p-4 md:p-8 rounded shadow max-w-3xl mx-auto border border-orange-200">
      <h2 className="text-amber-700 font-medium mb-4 text-sm md:text-base">
        Below is the total weight purchased for each material.
      </h2>

      {/* Table Header */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 font-semibold text-white bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 rounded px-2 py-2 mb-2">
        <div>Material</div>
        <div>Total Weight (kg)</div>
        <div className="hidden md:block"></div>
      </div>

      {/* Table Body */}
      <div className="space-y-2">
        {weights.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 md:grid-cols-4 gap-4 items-center px-2 py-2 bg-white rounded border border-orange-200 hover:bg-orange-50"
          >
            <div className="text-red-700 font-medium">{item.material}</div>

            {editIndex === index ? (
              <input
                type="number"
                value={item.totalWeight}
                onChange={(e) => handleChange(e, index)}
                className="border rounded px-2 py-1 text-amber-700 focus:outline-orange-400"
              />
            ) : (
              <div className="text-amber-600">{item.totalWeight} kg</div>
            )}

            <button
              onClick={() => toggleEdit(index)}
              className="text-orange-600 text-sm border border-orange-300 px-3 py-1 rounded hover:bg-orange-100 transition flex items-center gap-1 justify-center"
            >
              <Pencil size={14} />
              {editIndex === index ? "Update" : "Edit"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeightTable;
