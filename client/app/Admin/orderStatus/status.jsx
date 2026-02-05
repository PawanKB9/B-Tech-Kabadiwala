
const transitions = {
  Confirmed: ["Out for Pickup", "Cancelled"],
  "Out for Pickup": ["Arrived", "Cancelled"],
  Arrived: ["Picked", "Cancelled"],
  Picked: ["Sold"],
  Sold: ["Recycled"],
  Recycled: [],
  Cancelled: []
};

export default function StatusDropdown({ currentStatus, onSelect }) {
  const allowed = transitions[currentStatus] || [];

  if (!allowed.length) {
    return (
      <select disabled className="border px-3 py-1 rounded text-sm bg-gray-100">
        <option>{currentStatus}</option>
      </select>
    );
  }

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value;
        if (!val) return;
        onSelect(val);
      }}
      className="border px-3 py-1 rounded text-sm bg-white"
    >
      <option value="" disabled>Change status</option>
      {allowed.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}