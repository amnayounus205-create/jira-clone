import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  Settings,
  Kanban,
  Layers,
  Repeat,
  MapPin,
  BarChart3,
  Building,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#172B4D] text-white min-h-screen flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        Jira Clone
      </div>

      <nav className="space-y-1 p-4 flex-1 overflow-y-auto text-sm font-medium">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/boards"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <Kanban size={18} />
          Board
        </NavLink>

        <NavLink
          to="/backlog"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <Layers size={18} />
          Backlog
        </NavLink>

        <NavLink
          to="/sprints"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <Repeat size={18} />
          Sprints
        </NavLink>

        <NavLink
          to="/roadmap"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <MapPin size={18} />
          Roadmap
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <FolderKanban size={18} />
          Projects
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <Calendar size={18} />
          Calendar
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <Users size={18} />
          Teams
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? "bg-[#0052CC] text-white" : "hover:bg-slate-700 text-slate-300"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;