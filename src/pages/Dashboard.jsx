import React from "react";
import StatsGrid from "../components/dashboard/StatsGrid";
import BurndownChartWidget from "../components/dashboard/BurndownChartWidget";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back 👋 Here is an overview of your active sprints and projects.
        </p>
      </div>

      <StatsGrid />

      {/* Charts & Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <BurndownChartWidget />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;