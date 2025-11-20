import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, User2 } from "lucide-react";

const dummyOrders = [
  {
    id: 1,
    userId: "u1",
    userName: "Pawan Kumar Bind",
    contact: "9876543210",
    address: "Kamtaganj, Dostpur",
    status: "Pending",
    materials: [
      { name: "Iron", weight: "40 kg" },
      { name: "Plastic", weight: "20 kg" },
      { name: "Copper", weight: "25 kg" },
    ],
  },
  {
    id: 2,
    userId: "u2",
    userName: "Ravi Sharma",
    contact: "9876523456",
    address: "MG Road, Indore",
    status: "Sold",
    materials: [
      { name: "Aluminium", weight: "50 kg" },
      { name: "Tin", weight: "70 kg" },
    ],
  },
];

const statusOptions = ["Order Confirmed", "Out for Pickup", "Sold"];

const AdminOrderPanel = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [orders, setOrders] = useState(dummyOrders);
  const [showUser, setShowUser] = useState({});
  const navigate = useNavigate();

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const toggleUser = (id) => {
    setShowUser((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredOrders = orders.filter((order) =>
    activeTab === "Pending"
      ? order.status !== "Sold"
      : order.status === "Sold"
  );

  return (
    <div className="max-w-7xl pt-15 md:pt-2 mx-auto px-1 sm:px-6 py-6">
      <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">
        Admin Order Management
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["Pending", "Sold"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">
            No {activeTab} orders found.
          </p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow border border-orange-200 flex gap-4 justify-between"
            >
              {/* Left: Material Info */}
              <div className="flex-1 whitespace-nowrap space-x-2 space-y-1">
                <h3 className="text-orange-700 font-semibold">Materials:</h3>
                <div className="list-disc ml-1 space-y-1 text-sm text-gray-700">
                  {order.materials.map((mat, i) => (
                    <div key={i} className="">
                      <span className="font-medium text-orange-600">{mat.name}:</span>{" "}
                      {mat.weight}
                    </div>
                  ))}
                </div>
                
                
              </div>
                

              {/* Right: User Info */}
              <div className="w-full md:w-5/7 border-l border-orange-200 pl-4 space-y-2">
                <button
                  onClick={() => toggleUser(order.id)}
                  className="text-orange-600 font-medium text-sm flex items-center gap-2"
                >
                  <User2 size={18} />
                  {showUser[order.id] ? "Hide" : "Show"} User Info
                </button>

                {showUser[order.id] && (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="text-orange-700 hidden sm:inline font-semibold">Name:</span>{" "}
                      <span
                        onClick={() => navigate(`/user/${order.userId}`)}
                        className="hover:underline cursor-pointer"
                      >
                        {order.userName}
                      </span>
                    </p>
                    <p>
                      <span className="text-orange-700 hidden sm:inline font-semibold">Contact:</span>{" "}
                      {order.contact}
                    </p>
                    <p>
                      <span className="text-orange-700 hidden md:inline font-semibold">Address:</span>{" "}
                      {order.address}
                    </p>
                  </div>
                )}
                {activeTab === "Pending" && (
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="mt-2 h-10 border border-orange-400 text-orange-700 px-3 py-1 rounded-lg"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {activeTab === "Sold" && (
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="mt-2 flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} /> Delete Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrderPanel;
