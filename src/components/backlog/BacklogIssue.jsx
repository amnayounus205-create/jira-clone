import {
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

const typeStyles = {
  Epic: "bg-violet-50 text-violet-700",
  Story: "bg-emerald-50 text-emerald-700",
  Task: "bg-blue-50 text-blue-700",
  Bug: "bg-red-50 text-red-700",
  Improvement: "bg-amber-50 text-amber-700",
  "Sub-task": "bg-slate-100 text-slate-700",
};

const priorityStyles = {
  Highest: "text-red-600",
  High: "text-orange-600",
  Medium: "text-yellow-600",
  Low: "text-blue-600",
  Lowest: "text-slate-400",
};

const statusStyles = {
  Backlog: "bg-slate-100 text-slate-700",
  "To Do": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Review: "bg-amber-50 text-amber-700",
  Testing: "bg-purple-50 text-purple-700",
  Done: "bg-emerald-50 text-emerald-700",
  Blocked: "bg-red-50 text-red-700",
};

const BacklogIssue = ({
  issue,
  onSprintChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group relative flex items-center gap-4 px-4 py-4 border-b border-slate-100 hover:bg-slate-50/70 transition">

      {/* ==========================
          Issue
      ========================== */}

      <div className="flex items-center gap-3 min-w-0 flex-1">

        <span
          className={`shrink-0 px-2 py-1 rounded-md text-[11px] font-bold ${
            typeStyles[issue.type] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          {issue.type}
        </span>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span className="text-xs font-semibold text-[#0052CC]">
              {issue.id}
            </span>

            <span className="font-medium text-slate-800 truncate">
              {issue.title}
            </span>

          </div>

          {/* Labels + Story Points */}

          <div className="flex flex-wrap items-center gap-2 mt-1.5">

            {issue.labels?.map(
              (label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]"
                >
                  {label}
                </span>
              )
            )}

            {issue.storyPoints !==
              null &&
              issue.storyPoints !==
                undefined && (
                <span className="text-[10px] text-slate-400">
                  {issue.storyPoints} pts
                </span>
              )}

          </div>
        </div>
      </div>

      {/* ==========================
          Status
      ========================== */}

      <span
        className={`w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
          statusStyles[
            issue.status
          ] ||
          "bg-slate-100 text-slate-700"
        }`}
      >
        {issue.status}
      </span>

      {/* ==========================
          Priority
      ========================== */}

      <span
        className={`text-xs font-semibold lg:w-20 ${
          priorityStyles[
            issue.priority
          ] || "text-slate-400"
        }`}
      >
        {issue.priority}
      </span>

      {/* ==========================
          Due Date
      ========================== */}

      <div className="flex items-center gap-1.5 text-xs text-slate-500 lg:w-28">

        <CalendarDays size={14} />

        <span>
          {issue.dueDate || "—"}
        </span>

      </div>

      {/* ==========================
          Sprint
      ========================== */}

      <div className="relative">

        <select
          value={issue.sprint}
          onChange={(e) =>
            onSprintChange(
              issue.id,
              e.target.value
            )
          }
          className="appearance-none pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
        >
          <option value="Backlog">
            Backlog
          </option>

          <option value="ATL Sprint 13">
            ATL Sprint 13
          </option>

          <option value="ATL Sprint 14">
            ATL Sprint 14
          </option>
        </select>

        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
        />

      </div>

      {/* ==========================
          Assignee
      ========================== */}

      <div
        className="w-8 h-8 shrink-0 rounded-full bg-[#172B4D] text-white flex items-center justify-center text-[10px] font-bold"
        title={
          issue.assignee?.name ||
          "Unassigned"
        }
      >
        {issue.assignee?.initials ||
          "?"}
      </div>

      {/* ==========================
          Actions
      ========================== */}

      <div className="relative">

        <details className="relative">

          <summary
            className="list-none w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
            title="Issue actions"
          >
            <MoreHorizontal size={18} />
          </summary>

          <div className="absolute right-0 top-9 z-30 w-36 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">

            {/* Edit */}

            <button
              type="button"
              onClick={() =>
                onEdit(issue)
              }
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <Pencil size={15} />

              Edit
            </button>

            {/* Delete */}

            <button
              type="button"
              onClick={() =>
                onDelete(issue)
              }
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 size={15} />

              Delete
            </button>

          </div>

        </details>

      </div>

    </div>
  );
};

export default BacklogIssue;
