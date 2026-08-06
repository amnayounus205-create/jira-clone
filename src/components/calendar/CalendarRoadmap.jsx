import React, { useState } from "react";
import { X, MessageSquare, Activity, Trash2, Send } from "lucide-react";

// Initial shared backlog/board issues mapped to August 2026 dates
const initialDynamicIssues = [
  { id: "ATL-117", title: "Cache workspace settings", status: "Testing", assignee: "SN", dueDate: "2026-08-01", description: "Cache settings for better performance." },
  { id: "ATL-104", title: "Add dark mode tokens", status: "Testing", assignee: "DN", dueDate: "2026-08-02", description: "Setup dark theme configuration variables." },
  { id: "ATL-105", title: "Improve dashboard load time", status: "Done", assignee: "ML", dueDate: "2026-08-03", description: "Optimize bundle sizes." },
  { id: "ATL-106", title: "Write E2E tests for checkout", status: "Backlog", assignee: "JW", dueDate: "2026-08-05", description: "Complete Cypress end-to-end tests." },
  { id: "ATL-108", title: "Add pagination to issue list", status: "To Do", assignee: "JW", dueDate: "2026-08-06", description: "Implement server-side pagination." },
  { id: "ATL-114", title: "Optimize burndown query", status: "In Progress", assignee: "PN", dueDate: "2026-08-06", description: "Optimize burndown query.\n\nAcceptance criteria:\n- Works on mobile and desktop\n- Covered by tests\n- Reviewed by QA", storyPoints: 8, originalEstimate: 12, loggedHours: 12 },
  { id: "ATL-122", title: "Improve error boundaries", status: "Testing", assignee: "SN", dueDate: "2026-08-06", description: "Handle UI rendering errors gracefully." },
  { id: "ATL-109", title: "Migrate legacy endpoints", status: "Review", assignee: "AK", dueDate: "2026-08-07", description: "Refactor old data fetching modules." },
  { id: "ATL-110", title: "Design empty states", status: "Backlog", assignee: "ML", dueDate: "2026-08-10", description: "Design placeholders for empty lists." },
  { id: "ATL-112", title: "Fix mobile nav overlap", status: "Backlog", assignee: "SN", dueDate: "2026-08-11", description: "Fix responsive layout clipping on mobile screens." },
  { id: "ATL-1", title: "Onboarding Experience", status: "To Do", assignee: "AK", dueDate: "2026-08-11", description: "Prioritise work and assign issues to sprints." },
  { id: "ATL-2", title: "Billing & Payments", status: "In Progress", assignee: "DR", dueDate: "2026-08-12", description: "Manage subscriptions and gateway integrations." },
  { id: "ATL-113", title: "Introduce audit log", status: "To Do", assignee: "OF", dueDate: "2026-08-17", description: "Track all admin level modifications." },
  { id: "ATL-120", title: "Track time on subtasks", status: "Backlog", assignee: "ML", dueDate: "2026-08-19", description: "Enable hourly logging on sub-tasks." },
  { id: "ATL-121", title: "Add release notes editor", status: "Review", assignee: "OF", dueDate: "2026-08-21", description: "Rich text editor for release logs." },
];

const sprintScheduleData = [
  { id: "ATL Sprint 13", dateRange: "09 Aug 2026 → 23 Aug 2026", status: "Done" },
  { id: "ATL Sprint 11", dateRange: "11 Jul 2026 → 24 Jul 2026", status: "Done" },
  { id: "ATL21", dateRange: "29 Jul 2026 → 11 Aug 2026", status: "In Progress" },
];

const statusColors = {
  "Backlog": "bg-slate-100 text-slate-700",
  "To Do": "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  "Review": "bg-indigo-50 text-indigo-700",
  "Testing": "bg-purple-50 text-purple-700",
  "Done": "bg-emerald-50 text-emerald-700",
};

export default function CalendarRoadmap() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [issues, setIssues] = useState(initialDynamicIssues);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [timeInput, setTimeInput] = useState("");
  const [loggedTotal, setLoggedTotal] = useState(12);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Dynamically generate days for the active month view
  const totalDays = new Date(year, month + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const mStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `${year}-${mStr}-${dStr}`;
    return { dayNum, dateStr };
  });

  const handlePreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date(2026, 7, 1));

  const handleUpdateIssue = (updated) => {
    setIssues(issues.map(i => i.id === updated.id ? updated : i));
    setSelectedIssue(null);
  };

  const handleDeleteIssue = (id) => {
    setIssues(issues.filter(i => i.id !== id));
    setSelectedIssue(null);
  };

  const handleLogWork = (e) => {
    e.preventDefault();
    if (!timeInput) return;
    setLoggedTotal(prev => prev + Number(timeInput));
    setTimeInput("");
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, { id: Date.now(), text: commentText, time: "Just now" }]);
    setCommentText("");
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">{monthNames[month]} {year} schedule and issue timelines.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePreviousMonth} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer">Previous</button>
          <button onClick={handleToday} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-slate-100 cursor-pointer">Today</button>
          <button onClick={handleNextMonth} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer">Next</button>
        </div>
      </div>

      {/* Dynamic Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-500 py-3 uppercase tracking-wider">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>

        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[500px]">
          {daysInMonth.map(({ dayNum, dateStr }) => {
            // Filter issues dynamically matching this calendar date
            const dayIssues = issues.filter(issue => issue.dueDate === dateStr);
            return (
              <div key={dateStr} className="min-h-[110px] p-2.5 flex flex-col hover:bg-slate-50/50 transition-colors">
                <span className="text-xs font-semibold text-slate-500 mb-1.5">{dayNum}</span>
                <div className="space-y-1.5 flex-1">
                  {dayIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className="bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 p-1.5 rounded-lg text-xs cursor-pointer transition-all shadow-2xs flex items-center justify-between group"
                    >
                      <span className="font-semibold text-blue-900 truncate">{issue.id}</span>
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">{issue.assignee}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sprint Schedule Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900">Sprint schedule</h2>
        <div className="space-y-3">
          {sprintScheduleData.map((sprint, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="font-bold text-slate-900 text-sm">{sprint.id}</span>
                <span className="text-xs text-slate-500">{sprint.dateRange}</span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${sprint.status === "Done" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sprint.status === "Done" ? "bg-emerald-500" : "bg-blue-500"}`}></span>
                {sprint.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Flyout Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">{selectedIssue.id}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-700 rounded">Sub-task</span>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedIssue.title}</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[selectedIssue.status] || "bg-slate-100 text-slate-600"}`}>
                    {selectedIssue.status}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">frontend</span>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">api</span>
                </div>
              </div>

              <div className="flex border-b border-slate-200 space-x-6 text-sm font-medium">
                <button onClick={() => setActiveTab("details")} className={`pb-2 border-b-2 cursor-pointer ${activeTab === "details" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}>Details</button>
                <button onClick={() => setActiveTab("comments")} className={`pb-2 border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === "comments" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}><MessageSquare size={16} /> Comments ({comments.length})</button>
                <button onClick={() => setActiveTab("activity")} className={`pb-2 border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === "activity" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}><Activity size={16} /> Activity</button>
              </div>

              {activeTab === "details" && (
                <div className="space-y-6 text-xs">
                  <div>
                    <h3 className="font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-line">
                      {selectedIssue.description || "No description provided."}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="block text-slate-400 uppercase tracking-wider mb-1 font-semibold">Story Points</span>
                      <span className="text-lg font-bold text-slate-800">{selectedIssue.storyPoints || 8}</span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="block text-slate-400 uppercase tracking-wider mb-1 font-semibold">Original Estimate (H)</span>
                      <span className="text-lg font-bold text-slate-800">{selectedIssue.originalEstimate || 12}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="font-semibold text-slate-400 uppercase tracking-wider">Time Tracking</h3>
                    <p className="text-slate-600">{loggedTotal}h logged</p>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all" style={{ width: `${(loggedTotal / 12) * 100}%` }}></div>
                    </div>
                    <form onSubmit={handleLogWork} className="flex gap-2 pt-2">
                      <input
                        type="number"
                        value={timeInput}
                        onChange={(e) => setTimeInput(e.target.value)}
                        placeholder="Hours"
                        className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold shadow-xs cursor-pointer">Log work</button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span className="font-semibold text-slate-700">Ayesha Khan</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-slate-600">{c.text}</p>
                      </div>
                    ))}
                    {comments.length === 0 && <p className="text-slate-400 text-center py-4">No comments yet.</p>}
                  </div>
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"><Send size={14} /> Send</button>
                  </form>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-200 text-xs">
                <div>
                  <label className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                  <select 
                    value={selectedIssue.status} 
                    onChange={(e) => setSelectedIssue({ ...selectedIssue, status: e.target.value })} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Testing">Testing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Due Date</label>
                  <input 
                    type="date"
                    value={selectedIssue.dueDate}
                    onChange={(e) => setSelectedIssue({ ...selectedIssue, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button onClick={() => handleUpdateIssue(selectedIssue)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-blue-700 cursor-pointer">Save Changes</button>
              <button onClick={() => handleDeleteIssue(selectedIssue.id)} className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer">
                <Trash2 size={16} /> Delete issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}