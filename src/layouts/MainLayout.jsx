import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { logout } from "../features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  }, [dispatch, navigate]);

  // ======================================================
  // CLOSE SIDEBAR
  // ======================================================

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // ======================================================
  // TOGGLE SIDEBAR
  // ======================================================

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={handleCloseSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[1px]
            lg:hidden
          "
        />
      )}

      {/* ==================================================
          MAIN CONTENT AREA
      ================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ==================================================
            HEADER
        ================================================== */}

        <header
          className="
            flex
            h-16
            shrink-0
            items-center
            border-b
            border-slate-200
            bg-white
            px-3

            dark:border-slate-800
            dark:bg-slate-900

            sm:px-4
            lg:px-6
          "
        >
          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleToggleSidebar}
            className="
              mr-3
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition

              hover:bg-slate-100

              dark:text-slate-300
              dark:hover:bg-slate-800

              lg:hidden
            "
            aria-label={
              sidebarOpen
                ? "Close sidebar"
                : "Open sidebar"
            }
          >
            {sidebarOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          {/* ==================================================
              NAVBAR
          ================================================== */}

          <div className="min-w-0 flex-1">
            <Navbar onLogout={handleLogout} />
          </div>
        </header>

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main
          className="
            min-h-0
            flex-1
            overflow-y-auto
            bg-slate-50
            dark:bg-slate-950
          "
        >
          <div
            className="
              min-h-full
              min-w-0
              bg-slate-50
              p-3
              dark:bg-slate-950

              sm:p-4
              md:p-5
              lg:p-6
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;