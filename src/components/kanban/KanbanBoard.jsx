import React, { useState } from "react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreHorizontal, X, MessageSquare, Clock, Send, Flag, Trash2, Edit3, Search } from "lucide-react";

const initialColumns = {
  backlog: {
    id: "backlog",
    title: "BACKLOG",
    color: "bg-slate-500",
    items: [
      { id: "ATL-1", title: "Onboarding Experience", priority: "High", type: "Task", labels: ["frontend"], assignee: "AK", sprint: "Backlog", status: "backlog", description: "Prioritise work and assign issues to sprints." },
      { id: "ATL-2", title: "Billing & Payments", priority: "Medium", type: "Story", labels: ["backend"], assignee: "DR", sprint: "Backlog", status: "backlog", description: "Manage subscriptions and gateway integrations." },
      { id: "ATL-100", title: "Implement OAuth sign-in", priority: "High", type: "Task", labels: ["frontend", "api"], assignee: "ML", sprint: "Backlog", status: "backlog", description: "Setup secure OAuth authentication flow." },
    ],
  },
  todo: {
    id: "todo",
    title: "TO DO",
    color: "bg-blue-500",
    items: [
      { id: "ATL-101", title: "Fix cart total rounding", priority: "Highest", type: "Bug", labels: ["backend", "urgent"], assignee: "OF", sprint: "Backlog", status: "todo", description: "Fix floating point precision bugs in checkout calculations." },
      { id: "ATL-108", title: "Add pagination to issue list", priority: "Medium", type: "Task", labels: ["backend"], assignee: "JW", sprint: "Backlog", status: "todo", description: "Implement server-side pagination." },
    ],
  },
  inprogress: {
    id: "inprogress",
    title: "IN PROGRESS",
    color: "bg-amber-500",
    items: [
      { id: "ATL-102", title: "Create onboarding checklist", priority: "High", type: "Story", labels: ["ux"], assignee: "SN", sprint: "Backlog", status: "inprogress", description: "Improve new user onboarding flow." },
    ],
  },
  review: {
    id: "review",
    title: "REVIEW",
    color: "bg-indigo-500",
    items: [
      { id: "ATL-109", title: "Migrate legacy endpoints", priority: "High", type: "Task", labels: ["backend", "api"], assignee: "AK", sprint: "Backlog", status: "review", description: "Move old REST APIs to new service." },
    ],
  },
  testing: {
    id: "testing",
    title: "TESTING",
    color: "bg-purple-500",
    items: [
      { id: "ATL-103", title: "Add dark mode tokens", priority: "Medium", type: "Story", labels: ["frontend"], assignee: "PN", sprint: "Backlog", status: "testing", description: "Configure Tailwind CSS dark theme tokens." },
    ],
  },
  done: {
    id: "done",
    title: "DONE",
    color: "bg-emerald-500",
    items: [
      { id: "ATL-105", title: "Improve dashboard load time", priority: "Low", type: "Task", labels: ["tech-debt"], assignee: "DN", sprint: "Backlog", status: "done", description: "Optimize bundle sizes and lazy-load components." },
    ],
  },
};

const labelColors = {
  frontend: "bg-blue-50 text-blue-700",
  backend: "bg-emerald-50 text-emerald-700",
  security: "bg-indigo-50 text-indigo-700",
  urgent: "bg-red-50 text-red-700 font-bold",
  "tech-debt": "bg-amber-50 text-amber-700",
  api: "bg-purple-50 text-purple-700",
  qa: "bg-teal-50 text-teal-700",
  ux: "bg-cyan-50 text-cyan-700",
};

// Sortable Jira Card Component
function SortableIssueCard({ issue, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityIcons = {
    Highest: <span className="text-red-600 font-bold text-xs">↑↑</span>,
    High: <span className="text-red-500 font-bold text-xs">↑</span>,
    Medium: <span className="text-amber-500 font-bold text-xs">=</span>,
    Low: <span className="text-blue-500 font-bold text-xs">↓</span>,
  };

  const initials = issue.assignee || "AK";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer mb-3 group"
    >
      <p className="text-xs font-semibold text-slate-800 leading-snug mb-3">{issue.title}</p>
      
      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {issue.labels.map((lbl, idx) => (
            <span key={idx} className={`text-[10px] font-medium px-2 py-0.5 rounded ${labelColors[lbl] || "bg-slate-100 text-slate-600"}`}>
              {lbl}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="text-blue-600 font-bold text-[10px] bg-blue-50 px-1.5 py-0.5 rounded">{issue.id}</span>
          <span title={issue.priority}>{priorityIcons[issue.priority]}</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]" title={issue.assignee}>
          {initials}
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({ issueTitle, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-red-600">Delete Issue</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Are you sure you want to delete <span className="font-semibold text-slate-800">"{issueTitle}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

// Create Issue Modal Component
function CreateIssueModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    type: "Task",
    status: "todo",
    assignee: "AK",
    sprint: "Backlog",
    labels: "frontend",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const newIssue = {
      id: `ATL-${Math.floor(110 + Math.random() * 900)}`,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      assignee: formData.assignee,
      sprint: formData.sprint,
      labels: formData.labels.split(",").map(l => l.trim()).filter(Boolean),
    };

    onCreate(newIssue, formData.status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">Create issue</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Short summary"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add detailed description..."
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
                <option value="Highest">Highest</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status Column</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="review">Review</option>
                <option value="testing">Testing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assignee</label>
              <select value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                <option value="AK">AK</option>
                <option value="DR">DR</option>
                <option value="ML">ML</option>
                <option value="OF">OF</option>
                <option value="SN">SN</option>
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
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer">Create issue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Issue Detail Modal Component
function IssueDetailModal({ issue, onClose, onUpdate, onDeleteRequest }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(issue.title);
  const [editDesc, setEditDesc] = useState(issue.description || "");
  const [editStatus, setEditStatus] = useState(issue.status || "todo");
  const [editAssignee, setEditAssignee] = useState(issue.assignee || "AK");

  if (!issue) return null;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdate({
      ...issue,
      title: editTitle,
      description: editDesc,
      status: editStatus,
      assignee: editAssignee,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md">{issue.id}</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md">{issue.type || "Task"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onDeleteRequest(issue)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer" title="Delete Issue"><Trash2 size={18} /></button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-lg font-bold text-slate-800" />
                <textarea rows={3} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-slate-700" />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{issue.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Sprint: {issue.sprint || "Backlog"}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-semibold cursor-pointer"><Edit3 size={14} /> Edit</button>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 min-h-[140px]">
              {issue.description || "No description provided for this issue."}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 font-medium">
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="review">Review</option>
                <option value="testing">Testing</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assignee</label>
              <select value={editAssignee} onChange={(e) => setEditAssignee(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 font-medium">
                <option value="AK">AK</option>
                <option value="DR">DR</option>
                <option value="ML">ML</option>
                <option value="OF">OF</option>
                <option value="SN">SN</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-sm font-medium text-red-500">
                <Flag size={16} /> {issue.priority || "High"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Board Component
export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sprintFilter, setSprintFilter] = useState("All");

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleCreateIssue = (newIssue, targetCol) => {
    setColumns((prev) => ({
      ...prev,
      [targetCol]: {
        ...prev[targetCol],
        items: [newIssue, ...prev[targetCol].items],
      },
    }));
  };

  const handleUpdateIssue = (updatedIssue) => {
    setColumns((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k].items = next[k].items.filter((i) => i.id !== updatedIssue.id);
      });
      const col = updatedIssue.status || "todo";
      if (next[col]) next[col].items.push(updatedIssue);
      return next;
    });
    setSelectedIssue(null);
  };

  const handleDeleteConfirm = () => {
    if (!issueToDelete) return;
    setColumns((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k].items = next[k].items.filter((i) => i.id !== issueToDelete.id);
      });
      return next;
    });
    setIssueToDelete(null);
    setSelectedIssue(null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeCol = Object.keys(columns).find((k) => columns[k].items.some((i) => i.id === activeId));
    let overCol = Object.keys(columns).find((k) => columns[k].items.some((i) => i.id === overId));
    if (!overCol && columns[overId]) overCol = overId;

    if (!activeCol || !overCol || activeCol === overCol) return;

    setColumns((prev) => {
      const activeItems = [...prev[activeCol].items];
      const overItems = [...prev[overCol].items];
      const index = activeItems.findIndex((i) => i.id === activeId);
      const [moved] = activeItems.splice(index, 1);
      moved.status = overCol;
      overItems.push(moved);

      return {
        ...prev,
        [activeCol]: { ...prev[activeCol], items: activeItems },
        [overCol]: { ...prev[overCol], items: overItems },
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeCol = Object.keys(columns).find((k) => columns[k].items.some((i) => i.id === activeId));
    const overCol = Object.keys(columns).find((k) => columns[k].items.some((i) => i.id === overId));

    if (!activeCol || !overCol || activeCol !== overCol) return;

    const items = columns[activeCol].items;
    const oldIndex = items.findIndex((i) => i.id === activeId);
    const newIndex = items.findIndex((i) => i.id === overId);

    if (oldIndex !== newIndex) {
      setColumns((prev) => ({
        ...prev,
        [activeCol]: {
          ...prev[activeCol],
          items: arrayMove(items, oldIndex, newIndex),
        },
      }));
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Board</h1>
          <p className="text-sm text-slate-500 mt-0.5">Drag issues between columns to update their status.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Create issue
        </button>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Search size={16} /></span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search board..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <option value="All">All assignees</option>
          <option value="AK">AK</option>
          <option value="DR">DR</option>
          <option value="ML">ML</option>
          <option value="OF">OF</option>
          <option value="SN">SN</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <option value="All">All priorities</option>
          <option value="Highest">Highest</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={sprintFilter}
          onChange={(e) => setSprintFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <option value="All">All sprints</option>
          <option value="Backlog">Backlog</option>
          <option value="ATL Sprint 13">ATL Sprint 13</option>
          <option value="ATL Sprint 14">ATL Sprint 14</option>
        </select>
      </div>

      {/* Kanban Columns Grid with Equal Distribution */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 pb-6 w-full items-start">
          {Object.values(columns).map((col) => {
            const filteredItems = col.items.filter((item) => {
              const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesAssignee = assigneeFilter === "All" || item.assignee === assigneeFilter;
              const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
              const matchesSprint = sprintFilter === "All" || item.sprint === sprintFilter;
              return matchesSearch && matchesAssignee && matchesPriority && matchesSprint;
            });

            return (
              <div key={col.id} className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 flex flex-col w-full min-w-[200px]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                    <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">{col.title}</h3>
                    <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                      {filteredItems.length}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 cursor-pointer"><MoreHorizontal size={16} /></button>
                </div>

                <div className="flex-1 min-h-[480px]">
                  <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    {filteredItems.map((issue) => (
                      <SortableIssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                    ))}
                  </SortableContext>
                  {filteredItems.length === 0 && (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                      No issues
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Modals */}
      {isCreateOpen && <CreateIssueModal onClose={() => setIsCreateOpen(false)} onCreate={handleCreateIssue} />}
      {selectedIssue && <IssueDetailModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} onUpdate={handleUpdateIssue} onDeleteRequest={(i) => setIssueToDelete(i)} />}
      {issueToDelete && <DeleteConfirmModal issueTitle={issueToDelete.title} onConfirm={handleDeleteConfirm} onClose={() => setIssueToDelete(null)} />}
    </div>
  );
}