import React, { useState } from "react";
import { Plus, Search, X, CheckCircle2, Clock, AlertCircle, MoreHorizontal } from "lucide-react";

const initialBacklogItems = [
  { id: "ATL-1", title: "Onboarding Experience", status: "To Do", dueDate: "11 Aug 2026", sprint: "Backlog", assignee: "AK", type: "Task" },
  { id: "ATL-2", title: "Billing & Payments", status: "In Progress", dueDate: "12 Aug 2026", sprint: "Backlog", assignee: "DR", type: "Story" },
  { id: "ATL-100", title: "Implement OAuth sign-in", status: "To Do", dueDate: "29 Jul 2026", sprint: "Backlog", assignee: "ML", type: "Task" },
  { id: "ATL-101", title: "Fix cart total rounding", status: "To Do", dueDate: "30 Jul 2026", sprint: "Backlog", assignee: "OF", type: "Bug" },
  { id: "ATL-102", title: "Create onboarding checklist", status: "In Progress", dueDate: "11 Aug 2026", sprint: "Backlog", assignee: "SN", type: "Story" },
  { id: "ATL-103", title: "Add dark mode tokens", status: "Testing", dueDate: "02 Aug 2026", sprint: "Backlog", assignee: "PN", type: "Task" },
  { id: "ATL-105", title: "Improve dashboard load time", status: "Done", dueDate: "03 Aug 2026", sprint: "Backlog", assignee: "DN", type: "Task" },
  { id: "ATL-106", title: "Write E2E tests for checkout", status: "Backlog", dueDate: "04 Aug 2026", sprint: "Backlog", assignee: "JW", type: "Story" },
  { id: "ATL-108", title: "Add pagination to issue list", status: "To Do", dueDate: "06 Aug 2026", sprint: "Backlog", assignee: "JW", type: "Task" },
];

const statusStyles = {
  "To Do": "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  "Testing": "bg-purple-50 text-purple-700",
  "Done": "bg-emerald-50 text-emerald-700",
  "Backlog": "bg-slate-100 text-slate-700",
};

export default function BacklogModule() {
  const [backlogItems, setBacklogItems] = useState(initialBacklogItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Issue Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Task",
    priority: "Medium",
    status: "To Do",
    sprint: "Backlog",
    assignee: "Ayesha Khan",
  });

  const handleSprintChange = (id, newSprint) => {
    setBacklogItems(
      backlogItems.map((item) => (item.id === id ? { ...item, sprint: newSprint } : item))
    );
  };

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      id: `ATL-${backlogItems.length + 10}`,
      title: formData.title,
      status: formData.status,
      dueDate: "15 Aug 2026",
      sprint: formData.sprint,
      assignee: formData.assignee.split(" ").map(n => n[0]).join(""),
      type: formData.type,
    };

    setBacklogItems([newItem, ...backlogItems]);
    setIsCreateOpen(false);
    setFormData({ title: "", description: "", type: "Task", priority: "Medium", status: "To Do", sprint: "Backlog", assignee: "Ayesha Khan" });
  };

  const filteredItems = backlogItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Backlog</h1>
          <p className="text-sm text-slate-500 mt-0.5">Prioritise work and assign issues to sprints.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Plus size={18} /> Create issue
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search backlog..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Backlog List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors text-sm">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-purple-600 font-semibold text-xs flex items-center gap-1">
                  ⚡ {item.id}
                </span>
                <span className="font-medium text-slate-800 flex-1 truncate">{item.title}</span>
              </div>

              <div className="flex items-center gap-6">
                {/* Status Badge */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[item.status] || "bg-slate-100 text-slate-600"}`}>
                  {item.status}
                </span>

                {/* Due Date */}
                <span className="text-xs text-slate-500 w-24">{item.dueDate}</span>

                {/* Sprint Dropdown */}
                <select
                  value={item.sprint}
                  onChange={(e) => handleSprintChange(item.id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="ATL Sprint 13">ATL Sprint 13</option>
                  <option value="ATL Sprint 14">ATL Sprint 14</option>
                </select>

                {/* Assignee Avatar */}
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]" title={item.assignee}>
                  {item.assignee}
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">No backlog issues found.</div>
          )}
        </div>
      </div>

      {/* Create Issue Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Create issue</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Short summary (must be at least 3 characters)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add description..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    <option value="Task">Task</option>
                    <option value="Story">Story</option>
                    <option value="Bug">Bug</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Highest">Highest</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assignee</label>
                  <select value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    <option value="Ayesha Khan">Ayesha Khan</option>
                    <option value="Daniel Ross">Daniel Ross</option>
                    <option value="Mei Lin">Mei Lin</option>
                    <option value="Omar Farouk">Omar Farouk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Sprint</label>
                <select value={formData.sprint} onChange={(e) => setFormData({ ...formData, sprint: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  <option value="Backlog">Backlog</option>
                  <option value="ATL Sprint 13">ATL Sprint 13</option>
                  <option value="ATL Sprint 14">ATL Sprint 14</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer">Create Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}