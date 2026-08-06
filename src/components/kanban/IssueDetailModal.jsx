import React, { useState } from "react";
import { X, MessageSquare, Paperclip, Clock, CheckCircle2, Send, Tag, User, Flag } from "lucide-react";

export default function IssueDetailModal({ issue, onClose, onUpdateIssue }) {
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'comments' | 'history'
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "Alex", text: "Looking into this now. Will push a fix soon.", time: "2 hours ago" },
  ]);
  const [activities, setActivities] = useState([
    { id: 1, text: "Issue created by Admin", time: "5 hours ago" },
    { id: id_act = 2, text: "Status changed to In Progress", time: "3 hours ago" },
  ]);

  if (!issue) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "Admin",
      text: commentText,
      time: "Just now",
    };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-cardBg w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-md">
              {issue.id}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md">
              {issue.type || "Task"}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Details Panel */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{issue.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Created on August 6, 2026</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2 border-b-2 transition-colors ${activeTab === "details" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <MessageSquare size={16} /> Comments ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Clock size={16} /> Activity Timeline
              </button>
            </div>

            {/* Tab: Description */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="bg-mainBg p-4 rounded-lg border border-slate-200 text-sm text-slate-700 min-h-[140px]">
                  {issue.description || "No description provided for this issue. Click to add a detailed summary, acceptance criteria, or technical implementation notes."}
                </div>
              </div>
            )}

            {/* Tab: Comments */}
            {activeTab === "comments" && (
              <div className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-mainBg p-3.5 rounded-lg border border-slate-200 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800">{c.user}</span>
                        <span className="text-xs text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-slate-600">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment or mention @username..."
                    className="flex-1 px-4 py-2 bg-mainBg border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                    <Send size={16} /> Send
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Activity Timeline */}
            {activeTab === "history" && (
              <div className="space-y-3">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-sm py-2 border-b border-slate-100 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-800">{act.text}</p>
                      <p className="text-xs text-slate-400">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Meta Sidebar Panel */}
          <div className="bg-mainBg p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
              <select className="w-full bg-cardBg border border-slate-200 rounded-lg p-2 text-sm text-slate-700 font-medium focus:outline-none focus:border-primary">
                <option>Todo</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Done</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assignee</label>
              <div className="flex items-center gap-2 bg-cardBg p-2 rounded-lg border border-slate-200 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">A</div>
                <span className="text-slate-700 font-medium">Admin User</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
              <div className="flex items-center gap-2 bg-cardBg p-2 rounded-lg border border-slate-200 text-sm font-medium text-blocked">
                <Flag size={16} /> {issue.priority || "High"}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Estimate (Story Points)</label>
              <input type="number" defaultValue={5} className="w-full bg-cardBg border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-primary" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}