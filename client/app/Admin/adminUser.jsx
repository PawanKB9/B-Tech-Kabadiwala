import { useNavigate } from "react-router-dom";
import { Mail, Phone, User, Lock, LogOut } from "lucide-react";

const AdminYouSection = ({ admin = {}, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Example fallback logout logic
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="max-w-4xl mt-16 md:mt-4 mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-300">
        <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">
          Admin Profile
        </h2>

        {/* Admin Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-orange-600" />
            <p className="text-gray-800 font-medium">{admin.name || "Admin User"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-orange-600" />
            <p className="text-gray-800">{admin.email || "admin@example.com"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-orange-600" />
            <p className="text-gray-800">{admin.contact || "9876543210"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/change_password")}
            className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            <Lock size={18} /> Change Password
          </button>

          <button
            onClick={() => navigate("/change_contact")}
            className="w-full py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            <Phone size={18} /> Change Contact
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminYouSection;
