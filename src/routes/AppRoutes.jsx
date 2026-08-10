import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import { ROLES } from "../constants/roles";

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

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Loading...
      </p>
    </div>
  );
};

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
                  ROLES.SUPER_ADMIN,
                  ROLES.ORG_ADMIN,
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
                  ROLES.SUPER_ADMIN,
                  ROLES.ORG_ADMIN,
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
                  ROLES.SUPER_ADMIN,
                  ROLES.ORG_ADMIN,
                  ROLES.PROJECT_MANAGER,
                  ROLES.SCRUM_MASTER,
                  ROLES.QA_TESTER,
                  ROLES.VIEWER,
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
                  ROLES.SUPER_ADMIN,
                  ROLES.ORG_ADMIN,
                  ROLES.PROJECT_MANAGER,
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
                  ROLES.SUPER_ADMIN,
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
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
