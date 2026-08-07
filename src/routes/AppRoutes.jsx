import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Dashboard
import Dashboard from "../components/dashboard/Dashboard";

// Modules
import KanbanBoard from "../components/kanban/KanbanBoard";
import BacklogModule from "../components/backlog/BacklogModule";
import SprintsModule from "../components/sprints/SprintsModule";
import CalendarRoadmap from "../components/calendar/CalendarRoadmap";
import RoadmapModule from "../components/roadmap/RoadmapModule";
import ProjectsModule from "../components/projects/ProjectsModule";
import ProjectDetails from "../components/projects/ProjectDetails";
import OrganizationsModule from "../components/organizations/OrganizationsModule";
import OrganizationDetails from "../components/organizations/OrganizationDetails"; // <-- 1. YE NAYA IMPORT
import ReportsModule from "../components/reports/ReportsModule";
import TeamsModule from "../components/teams/TeamsModule";
import SettingsModule from "../components/settings/SettingsModule";

// Auth
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= Public Routes ================= */}

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ================= Protected Routes ================= */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="boards" element={<KanbanBoard />} />
        <Route path="backlog" element={<BacklogModule />} />
        <Route path="sprints" element={<SprintsModule />} />
        <Route path="calendar" element={<CalendarRoadmap />} />
        <Route path="roadmap" element={<RoadmapModule />} />
        <Route path="projects" element={<ProjectsModule />} />

        {/* Project Details */}
        <Route path="projects/:id" element={<ProjectDetails />} />

        {/* Organization */}
        <Route
          path="organizations"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Organization Admin"]}>
              <OrganizationsModule />
            </ProtectedRoute>
          }
        />

        {/* Organization Details - YE NAYA ROUTE */}
        <Route
          path="organizations/:id"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Organization Admin"]}>
              <OrganizationDetails />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Project Manager", "Scrum Master"]}>
              <ReportsModule />
            </ProtectedRoute>
          }
        />

        {/* Teams */}
        <Route
          path="teams"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Organization Admin", "Project Manager"]}>
              <TeamsModule />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["Super Admin"]}>
              <SettingsModule />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;