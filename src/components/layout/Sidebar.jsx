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
import { ROLES } from "../../constants/roles";

// ======================================================
// MENU CONFIGURATION
// ======================================================

const menuConfig = {
  // ----------------------------------------------------
  // SUPER ADMIN
  // ----------------------------------------------------
  [ROLES.SUPER_ADMIN]: [
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

  // ----------------------------------------------------
  // ADMIN
  // ----------------------------------------------------
  [ROLES.ADMIN]: [
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
  ],

  // ----------------------------------------------------
  // PROJECT MANAGER
  // ----------------------------------------------------
  [ROLES.PROJECT_MANAGER]: [
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

  // ----------------------------------------------------
  // DEVELOPER
  // ----------------------------------------------------
  [ROLES.DEVELOPER]: [
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

  // ----------------------------------------------------
  // TESTER
  // ----------------------------------------------------
  [ROLES.TESTER]: [
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

  // ----------------------------------------------------
  // TEAM LEAD
  // ----------------------------------------------------
  [ROLES.TEAM_LEAD]: [
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

  // ----------------------------------------------------
  // VIEWER
  // ----------------------------------------------------
  [ROLES.VIEWER]: [
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

// ======================================================
// NORMALIZE ROLE
// ======================================================

const normalizeRole = (role) => {
  if (!role) {
    return ROLES.VIEWER;
  }

  return String(role)
    .trim()
    .replace(/\s+/g, " ");
};

// ======================================================
// SIDEBAR
// ======================================================

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const normalizedRole = normalizeRole(role);

  // IMPORTANT:
  // Agar role menuConfig mein nahi milta to
  // complete menuConfig object return nahi karna.
  // Viewer ka menu fallback use hoga.
  const menus =
    menuConfig[normalizedRole] || menuConfig[ROLES.VIEWER] || [];

  return (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-50
        flex
        w-64
        flex-col
        border-r
        border-slate-200
        bg-white
        shadow-sm
        transition-transform
        duration-300
        ease-in-out

        dark:border-slate-800
        dark:bg-slate-900

        lg:static
        lg:z-auto
        lg:translate-x-0

        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="shrink-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
              Jira Clone
            </h1>

            <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
              Project Management
            </p>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              p-1.5
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              dark:hover:bg-slate-800
              dark:hover:text-white
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* ==================================================
            CURRENT ROLE
        ================================================== */}

        <div
          className="
            mt-4
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-3
            py-2.5

            dark:border-slate-700
            dark:bg-slate-800
          "
        >
          <p className="text-[9px] uppercase tracking-widest text-slate-400">
            Current Role
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
            {normalizedRole}
          </p>
        </div>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                group
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-200

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
                        ? "shrink-0 text-white"
                        : "shrink-0 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-white"
                    }
                  />

                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="shrink-0 border-t border-slate-200 px-4 py-4 dark:border-slate-800">
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
