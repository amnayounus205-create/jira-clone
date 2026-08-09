import {
  useCallback,
} from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import {
  logout,
} from "../features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar onLogout={handleLogout} />

        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
