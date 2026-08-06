import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, Play, Calendar as CalendarIcon } from "lucide-react";

const initialSprints = [
  {
    id: "ATL Sprint 13",
    goal: "Billing polish",
    startDate: "09 Aug 2026",
    endDate: "23 Aug 2026",
    status: "Active",
    stats: "0/0 done",
  },
  {
    id: "ATL Sprint 11",
    goal: "Auth hardening",
    startDate: "11 Jul 2026",
    endDate: "24 Jul 2026",
    status: "Completed",
    stats: "0/0 done",
  },
];

export default function SprintsModule() {
  const [sprints, setSprints] = useState(initialSprints);
  const [sprintName, setSprintName] = useState("");
  const [sprintGoal, setSprintGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (!sprintName.trim()) return;

    const newSprint = {
      id: sprintName,
      goal: sprintGoal || "General sprint goals",
      startDate: startDate || "06 Aug 2026",
      endDate: endDate || "20 Aug 2026",
      status: "Planned",
      stats: "0/0 done",
    };

    setSprints([newSprint, ...sprints]);
    setSprintName("");
    setSprintGoal("");
    setStartDate("");
    setEndDate("");
    showToast("Sprint created");
  };

  const handleDelete = (id) => {
    setSprints(sprints.filter((s) => s.id !== id));
  };

  const handleToggleStatus = (id) => {
    setSprints(
      sprints.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "Active" ? "Completed" : "Active";
          showToast(nextStatus === "Completed" ? "Sprint completed" : "Sprint started");
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg transition-all animate-bounce">
          ✓ {toastMessage}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sprints</h1>
        <p className="text-sm text-slate-500 mt-0.5">Plan and run your iterations.</p>
      </div>

      {/* Create Sprint Inline Form */}
      <form onSubmit={handleCreateSprint} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        <input
          type="text"
          required
          value={sprintName}
          onChange={(e) => setSprintName(e.target.value)}
          placeholder="Sprint name"
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
        />
        <input
          type="text"
          value={sprintGoal}
          onChange={(e) => setSprintGoal(e.target.value)}
          placeholder="Sprint goal"
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 text-slate-600"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 text-slate-600"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus size={16} /> Create sprint
        </button>
      </form>

      {/* Sprints List */}
      <div className="space-y-3">
        {sprints.map((sprint) => (
          <div key={sprint.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-slate-900 text-sm">{sprint.id}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    sprint.status === "Active"
                      ? "bg-blue-100 text-blue-700"
                      : sprint.status === "Completed"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {sprint.status}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700">{sprint.goal}</p>
              <p className="text-[11px] text-slate-400">
                {sprint.startDate} – {sprint.endDate} · {sprint.stats}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {sprint.status !== "Completed" && (
                <button
                  onClick={() => handleToggleStatus(sprint.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors"
                >
                  {sprint.status === "Active" ? "Complete sprint" : "Start sprint"}
                </button>
              )}
              <button
                onClick={() => handleDelete(sprint.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}