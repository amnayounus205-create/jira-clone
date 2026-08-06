import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import KanbanBoard from "../components/kanban/KanbanBoard";
import BacklogModule from "../components/backlog/BacklogModule";
import SprintsModule from "../components/sprints/SprintsModule";
import CalendarRoadmap from "../components/calendar/CalendarRoadmap";
import ProjectsModule from "../components/projects/ProjectsModule";
import TeamsModule from "../components/teams/TeamsModule";
import SettingsModule from "../components/settings/SettingsModule";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
        <Route path="projects" element={<ProjectsModule />} />
        <Route path="teams" element={<TeamsModule />} />
        <Route path="settings" element={<SettingsModule />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;