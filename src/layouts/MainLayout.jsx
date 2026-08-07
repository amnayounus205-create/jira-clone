import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import { logout } from "../features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;