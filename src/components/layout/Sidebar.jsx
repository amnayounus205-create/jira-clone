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
  LayoutGrid,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

const menuConfig = {
  "Super Admin": [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Organizations",
      path: "/organizations",
      icon: Building,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Board",
      path: "/boards",
      icon: Kanban,
    },
    {
      name: "Backlog",
      path: "/backlog",
      icon: Layers,
    },
    {
      name: "Sprints",
      path: "/sprints",
      icon: Repeat,
    },
    {
      name: "Roadmap",
      path: "/roadmap",
      icon: MapPin,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: "Teams",
      path: "/teams",
      icon: Users,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ],

  "Organization Admin": [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Organizations",
      path: "/organizations",
      icon: Building,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Teams",
      path: "/teams",
      icon: Users,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ],

  "Project Manager": [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Board",
      path: "/boards",
      icon: Kanban,
    },
    {
      name: "Backlog",
      path: "/backlog",
      icon: Layers,
    },
    {
      name: "Sprints",
      path: "/sprints",
      icon: Repeat,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ],

  "Scrum Master": [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Board",
      path: "/boards",
      icon: Kanban,
    },
    {
      name: "Backlog",
      path: "/backlog",
      icon: Layers,
    },
    {
      name: "Sprints",
      path: "/sprints",
      icon: Repeat,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
  ],

  Developer: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Board",
      path: "/boards",
      icon: Kanban,
    },
    {
      name: "Backlog",
      path: "/backlog",
      icon: Layers,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
  ],

  "QA Tester": [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Board",
      path: "/boards",
      icon: Kanban,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ],

  Viewer: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: LayoutGrid,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ],
};

const Sidebar = () => {
  const { role } = useAuth();

  const menus = menuConfig[role] || menuConfig.Viewer;

  return (
    <aside
      className="
        sticky top-0
        flex h-screen w-64 shrink-0 flex-col
        overflow-hidden
        border-r border-slate-200
        bg-white
        text-slate-700
        transition-colors duration-200
        dark:border-slate-800
        dark:bg-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================
          Brand
      ========================= */}
      <div
        className="
          shrink-0
          border-b border-slate-200
          px-5 py-5
          dark:border-slate-800
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl
              bg-[#0052CC]
              text-white
              shadow-sm
            "
          >
            <LayoutGrid size={21} />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
              Jira Clone
            </h1>

            <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
              Project Management
            </p>
          </div>
        </div>

        {/* Role */}
        <div
          className="
            mt-4 rounded-lg
            border border-slate-200
            bg-slate-50
            px-3 py-2.5
            dark:border-slate-700
            dark:bg-slate-800
          "
        >
          <p className="text-[9px] uppercase tracking-widest text-slate-400">
            Current Role
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
            {role || "Viewer"}
          </p>
        </div>
      </div>

      {/* =========================
          Navigation
      ========================= */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-3 py-4
          space-y-1
          scrollbar-thin
        "
      >
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group flex items-center gap-3
                rounded-lg
                px-3 py-2.5
                text-sm font-medium
                transition-all duration-200

                ${
                  isActive
                    ? "bg-[#0052CC] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-white"
                    }
                  />

                  <span className="truncate">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* =========================
          Footer
      ========================= */}
      <div
        className="
          shrink-0
          border-t border-slate-200
          px-4 py-4
          dark:border-slate-800
        "
      >
        <div className="text-center">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Jira Clone
          </p>

          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
            Project Management System
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;