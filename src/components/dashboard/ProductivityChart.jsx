import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

import { productivityData } from "./dashboardData";

const ProductivityChart = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h2 className="text-lg font-bold mb-5">
        Team Productivity
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={productivityData}
        >

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="tasks"
            fill="#0052CC"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ProductivityChart;