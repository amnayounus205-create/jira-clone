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
import useAuth from "../../features/auth/hooks/useAuth";
import { ROLES } from "../../constants/roles";

const menuConfig = {
  [ROLES.SUPER_ADMIN]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Organizations", path: "/organizations", icon: Building },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Board", path: "/boards", icon: Kanban },
    { name: "Backlog", path: "/backlog", icon: Layers },
    { name: "Sprints", path: "/sprints", icon: Repeat },
    { name: "Roadmap", path: "/roadmap", icon: MapPin },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Teams", path: "/teams", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ],

  [ROLES.ORGANIZATION_ADMIN]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Organizations", path: "/organizations", icon: Building },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Teams", path: "/teams", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ],

  [ROLES.PROJECT_MANAGER]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Board", path: "/boards", icon: Kanban },
    { name: "Backlog", path: "/backlog", icon: Layers },
    { name: "Sprints", path: "/sprints", icon: Repeat },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ],

  [ROLES.SCRUM_MASTER]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Board", path: "/boards", icon: Kanban },
    { name: "Backlog", path: "/backlog", icon: Layers },
    { name: "Sprints", path: "/sprints", icon: Repeat },
    { name: "Calendar", path: "/calendar", icon: Calendar },
  ],

  [ROLES.DEVELOPER]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Board", path: "/boards", icon: Kanban },
    { name: "Backlog", path: "/backlog", icon: Layers },
    { name: "Calendar", path: "/calendar", icon: Calendar },
  ],

  [ROLES.QA_TESTER]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Board", path: "/boards", icon: Kanban },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ],

  [ROLES.VIEWER]: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ],
};

const Sidebar = () => {
  const { role } = useAuth();

  const menus = menuConfig[role] || [];

  return (
    <aside className="w-64 min-h-screen bg-[#172B4D] text-white flex flex-col">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          Jira Clone
        </h1>

        <p className="text-xs text-slate-300 mt-1">
          {role}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-[#0052CC] text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`
              }
            >
              <Icon size={18} />

              {item.name}
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
};

export default Sidebar;