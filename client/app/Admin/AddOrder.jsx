import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "../Contexts/UserContext.jsx";
import SearchAddress from "../Forms/Address.jsx";
import {useAdminEditOrderMutation,  useAdminOrderMutation} from '../RTK Query/AdminApi.jsx'
const materialOptions = [
  "Raddi (Old news paper)",
  "Plastic",
  "Tin",
  "Iron",
  "Glass",
  "Copper",
];

const AddOrder = () => {
  const [name ,setName] = useState('')
  const [phone ,setPhone] = useState('')
  const { location, setLocation } = useUser();
  const [items, setItems] = useState([{ material: "", weight: "" }]);

  const [bookOrder] = useAdminOrderMutation();

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    const allFilled = updatedItems[index].material && updatedItems[index].weight;
    if (index === items.length - 1 && allFilled) {
      setItems([...updatedItems, { material: "", weight: "" }]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedItems = items
      .filter((item) => item.material.trim() && item.weight.trim())
      .map((item) => ({
        material: item.material.trim(),
        weight: Number(item.weight.trim()),
      }));

    if (trimmedItems.length === 0) {
      toast.error("Please add at least one valid item");
      return;
    }

    if (!name || !phone || !location) {
      toast.error("Please fill all user info fields");
      return;
    }
    const userInfo = {
        name,
        phone,
        location
    }
    try {
      const response = await bookOrder({ items: trimmedItems, userInfo }).unwrap();

      // console.log("Ordered Successfully:", response);
      setItems([{ material: "", weight: "" }]);
      setName('');
      setPhone('');
      setLocation({});
      toast.success("Ordered!");
    } catch (err) {
      // console.error(err);
      toast.error("Failed to submit order");
    }
  };

  const selectedMaterials = items.map((r) => r.material).filter(Boolean);

  return (
    <div className="px-2 py-3 md:mt-4 mt-16  sm:p-6 md:p-8 bg-cover  bg-gradient-to-b from-indigo-100 to-neutral-50">

      <form onSubmit={handleSubmit} className="border border-green-500 rounded-md px-1 sm:p-4 py-4 space-y-6 transition">

        {/* User Info */}
        <div className="space-y-3 text-green-800">
          <h3 className="text-green-700 font-semibold text-base">User Information:</h3>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-green-400 rounded p-2"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-green-400 rounded p-2"
          />

          <div>
            {/* address */}
            <SearchAddress />
          </div>
        </div>

        {/* Material Header */}
        <div className="text-lg sm:text-xl sm:font-bold grid grid-cols-2 gap-4 bg-green-600 text-white px-1 sm:px-2 py-2 rounded">
          <div>Material</div>
          <div>Approx Weight</div>
        </div>

        {/* Items */}
        {items.map((row, idx) => {
          const availableOptions = materialOptions.filter(
            (mat) => !selectedMaterials.includes(mat) || row.material === mat
          );

          return (
            <div key={idx} className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-16 items-center px-1">
              <select
                value={row.material || ""}
                onChange={(e) => handleChange(idx, "material", e.target.value)}
                className="w-full sm:text-lg border border-green-400 rounded p-2 text-green-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option value="">Select Material</option>
                {availableOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={row.weight || ""}
                min={0}
                onChange={(e) => handleChange(idx, "weight", e.target.value)}
                placeholder="Weight in kg"
                className="w-full sm:text-lg border border-green-400 rounded p-2 text-green-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
          );
        })}

        {/* Submit */}
        <div className="text-right pt-4">
          <button
            type="submit"
            className="bg-green-600 text-lg font-semibold hover:bg-emerald-700 text-white sm:font-bold px-8 py-2 rounded transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
