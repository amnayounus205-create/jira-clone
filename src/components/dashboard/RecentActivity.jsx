import React from "react";
import { CheckCircle2, Clock, PlusCircle, UserPlus } from "lucide-react";

const activities = [
  { id: 1, text: "Alex completed issue JIRA-104", time: "10 mins ago", icon: <CheckCircle2 size={16} className="text-done" /> },
  { id: 2, text: "Sarah created a new Epic: User Authentication", time: "1 hour ago", icon: <PlusCircle size={16} className="text-primary" /> },
  { id: 3, text: "Michael assigned 3 tasks to David", time: "3 hours ago", icon: <UserPlus size={16} className="text-inprogress" /> },
  { id: 4, text: "Sprint 4 started successfully", time: "5 hours ago", icon: <Clock size={16} className="text-review" /> },
];

export default function RecentActivity() {
  return (
    <div className="bg-cardBg p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-80">
      <h3 className="font-bold text-slate-800 text-base mb-4">Recent Activities</h3>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div className="p-2 bg-mainBg rounded-lg mt-0.5 border border-slate-100">
              {act.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{act.text}</p>
              <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}