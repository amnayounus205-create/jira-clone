import { Bell, Search, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = ({ onLogout }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">
        Jira Clone
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        {/* Notification */}
        <Bell
          size={20}
          className="cursor-pointer text-gray-600"
        />

        {/* User */}
        <div className="text-right">
          <h3 className="font-semibold">
            {user?.name || "Admin"}
          </h3>

          <p className="text-sm text-gray-500">
            {user?.role || "Super Admin"}
          </p>
        </div>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;