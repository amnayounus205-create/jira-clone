import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex bg-slate-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default MainLayout;