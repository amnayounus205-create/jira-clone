import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "Day 1", ideal: 50, actual: 50 },
  { day: "Day 3", ideal: 40, actual: 45 },
  { day: "Day 5", ideal: 30, actual: 35 },
  { day: "Day 7", ideal: 20, actual: 28 },
  { day: "Day 9", ideal: 10, actual: 15 },
  { day: "Day 11", ideal: 0, actual: 5 },
];

export default function BurndownChartWidget() {
  return (
    <div className="bg-cardBg p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-base">Sprint Burndown Chart</h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">Sprint 4</span>
      </div>
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="ideal" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" name="Ideal Scope" />
            <Line type="monotone" dataKey="actual" stroke="#0052CC" strokeWidth={2} name="Actual Scope" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}