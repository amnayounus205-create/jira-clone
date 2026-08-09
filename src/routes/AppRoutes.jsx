import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

const Dashboard = lazy(
  () => import("../components/dashboard/Dashboard")
);

const KanbanBoard = lazy(
  () => import("../components/kanban/KanbanBoard")
);

const BacklogModule = lazy(
  () => import("../components/backlog/BacklogModule")
);

const SprintsModule = lazy(
  () => import("../components/sprints/SprintsModule")
);

const CalendarRoadmap = lazy(
  () => import("../components/calendar/CalendarRoadmap")
);

const RoadmapModule = lazy(
  () => import("../components/roadmap/RoadmapModule")
);

const ProjectsModule = lazy(
  () => import("../components/projects/ProjectsModule")
);

const ProjectDetails = lazy(
  () => import("../components/projects/ProjectDetails")
);

const OrganizationsModule = lazy(
  () => import("../components/organizations/OrganizationsModule")
);

const OrganizationDetails = lazy(
  () => import("../components/organizations/OrganizationDetails")
);

const ReportsModule = lazy(
  () => import("../components/reports/ReportsModule")
);

const TeamsModule = lazy(
  () => import("../components/teams/TeamsModule")
);

const SettingsModule = lazy(
  () => import("../components/settings/SettingsModule")
);

const WorkspaceModule = lazy(
  () => import("../components/workspaces/WorkspaceModule")
);

const WorkspaceDetails = lazy(
  () => import("../components/workspaces/WorkspaceDetails")
);

const LoginPage = lazy(
  () => import("../features/auth/pages/LoginPage")
);

const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage")
);

const LoadingScreen = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-500">
        Loading...
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="workspaces"
            element={<WorkspaceModule />}
          />

          <Route
            path="workspaces/:id"
            element={<WorkspaceDetails />}
          />

          <Route
            path="boards"
            element={<KanbanBoard />}
          />

          <Route
            path="backlog"
            element={<BacklogModule />}
          />

          <Route
            path="sprints"
            element={<SprintsModule />}
          />

          <Route
            path="calendar"
            element={<CalendarRoadmap />}
          />

          <Route
            path="roadmap"
            element={<RoadmapModule />}
          />

          <Route
            path="projects"
            element={<ProjectsModule />}
          />

          <Route
            path="projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="organizations"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Super Admin",
                  "Organization Admin",
                ]}
              >
                <OrganizationsModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="organizations/:id"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Super Admin",
                  "Organization Admin",
                ]}
              >
                <OrganizationDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Super Admin",
                  "Project Manager",
                  "Scrum Master",
                ]}
              >
                <ReportsModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="teams"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Super Admin",
                  "Organization Admin",
                  "Project Manager",
                ]}
              >
                <TeamsModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Super Admin",
                ]}
              >
                <SettingsModule />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;