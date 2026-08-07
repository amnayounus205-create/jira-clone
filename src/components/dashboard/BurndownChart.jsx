import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { burndownData } from "./dashboardData";

const BurndownChart = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h2 className="text-lg font-bold mb-5">
        Burndown Chart
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={burndownData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            dataKey="planned"
            stroke="#0052CC"
            strokeWidth={3}
          />

          <Line
            dataKey="actual"
            stroke="#EF4444"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default BurndownChart;