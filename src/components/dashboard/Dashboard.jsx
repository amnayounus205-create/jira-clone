import DashboardCard from "./DashboardCard";
import BurndownChart from "./BurndownChart";
import ProductivityChart from "./ProductivityChart";

import {
  dashboardStats,
  activities,
  tasks,
  deadlines,
} from "./dashboardData";

const Dashboard = () => {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-[#172B4D]">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back! Here's your project overview.
        </p>
      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {dashboardStats.map((item) => (
          <DashboardCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      {/* Sprint + Burndown */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sprint Progress */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Sprint Progress
          </h2>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

            <div
              className="bg-[#0052CC] h-4 rounded-full"
              style={{ width: "68%" }}
            />

          </div>

          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>0%</span>
            <span>68% Completed</span>
            <span>100%</span>
          </div>

        </div>

        {/* Burndown Chart */}

        <BurndownChart />

      </div>

      {/* Activity Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-lg font-semibold mb-5">
            Recent Activities
          </h2>

          <div className="space-y-4">

            {activities.map((item) => (

              <div
                key={item.id}
                className="border-b pb-3"
              >
                <p className="font-medium">
                  {item.text}
                </p>

                <span className="text-xs text-gray-400">
                  {item.time}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Assigned Tasks */}

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-lg font-semibold mb-5">
            Assigned Tasks
          </h2>

          <div className="space-y-4">

            {tasks.map((task) => (

              <div
                key={task.id}
                className="bg-slate-50 rounded-lg p-4 border"
              >

                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <div className="flex justify-between mt-3">

                  <span className="text-blue-600 text-sm">
                    {task.status}
                  </span>

                  <span className="text-red-500 text-sm">
                    {task.priority}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Deadlines */}

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-lg font-semibold mb-5">
            Upcoming Deadlines
          </h2>

          <div className="space-y-4">

            {deadlines.map((item, index) => (

              <div
                key={index}
                className="border rounded-lg p-4"
              >

                <h3 className="font-medium">
                  {item.title}
                </h3>

                <p className="text-red-500 text-sm mt-2">
                  {item.date}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Productivity */}

      <ProductivityChart />

    </div>
  );
};

export default Dashboard;