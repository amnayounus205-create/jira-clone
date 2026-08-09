
import {
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

const typeStyles = {
  Epic: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  Story: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Task: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  Bug: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  Improvement:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  "Sub-task":
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const priorityStyles = {
  Highest: "text-red-600 dark:text-red-400",
  High: "text-orange-600 dark:text-orange-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  Low: "text-blue-600 dark:text-blue-400",
  Lowest: "text-slate-400 dark:text-slate-500",
};

const statusStyles = {
  Backlog:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "To Do":
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "In Progress":
    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  Review:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  Testing:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  Done:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Blocked:
    "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

const BacklogIssue = ({
  issue,
  onSprintChange,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {/* =====================================================
          MOBILE / TABLET CARD
      ===================================================== */}

      <div className="lg:hidden p-4 sm:p-5 bg-white dark:bg-slate-900">
        {/* Top Row */}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {/* Type */}

            <span
              className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${
                typeStyles[issue.type] ||
                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {issue.type}
            </span>

            {/* Issue Info */}

            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0052CC]">
                {issue.id}
              </p>

              <h3 className="mt-0.5 break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
                {issue.title}
              </h3>
            </div>
          </div>

          {/* Actions */}

          <div className="relative shrink-0">
            <details className="relative">
              <summary
                className="
                  list-none
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-slate-200
                  transition
                "
                title="Issue actions"
              >
                <MoreHorizontal size={18} />
              </summary>

              <div
                className="
                  absolute
                  right-0
                  top-9
                  z-30
                  w-36
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  shadow-xl
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <button
                  type="button"
                  onClick={() => onEdit(issue)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-slate-700
                    hover:bg-slate-50
                    dark:text-slate-200
                    dark:hover:bg-slate-800
                    transition
                  "
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(issue)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-red-600
                    hover:bg-red-50
                    dark:hover:bg-red-950/30
                    transition
                  "
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* Description */}

        {issue.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {issue.description}
          </p>
        )}

        {/* Labels */}

        {issue.labels?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {issue.labels.map((label) => (
              <span
                key={label}
                className="
                  rounded
                  bg-slate-100
                  px-2
                  py-1
                  text-[10px]
                  text-slate-500
                  dark:bg-slate-800
                  dark:text-slate-400
                "
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Mobile Details */}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Status */}

          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <span
              className={`inline-flex max-w-full rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                statusStyles[issue.status] ||
                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <span className="truncate">
                {issue.status}
              </span>
            </span>
          </div>

          {/* Priority */}

          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Priority
            </p>

            <p
              className={`text-xs font-semibold ${
                priorityStyles[issue.priority] ||
                "text-slate-400"
              }`}
            >
              {issue.priority}
            </p>
          </div>

          {/* Due Date */}

          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Due Date
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <CalendarDays size={13} />

              <span className="truncate">
                {issue.dueDate || "—"}
              </span>
            </div>
          </div>

          {/* Assignee */}

          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Assignee
            </p>

            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#172B4D]
                  text-[9px]
                  font-bold
                  text-white
                "
                title={
                  issue.assignee?.name ||
                  "Unassigned"
                }
              >
                {issue.assignee?.initials || "?"}
              </div>

              <span className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                {issue.assignee?.name ||
                  "Unassigned"}
              </span>
            </div>
          </div>
        </div>

        {/* Sprint */}

        <div className="mt-4">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Sprint
          </p>

          <div className="relative w-full">
            <select
              value={issue.sprint}
              onChange={(e) =>
                onSprintChange(
                  issue.id,
                  e.target.value
                )
              }
              className="
                w-full
                appearance-none
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-3
                pr-9
                text-xs
                font-medium
                text-slate-700
                outline-none
                focus:border-[#0052CC]
                focus:ring-2
                focus:ring-blue-100
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-200
                dark:focus:ring-blue-950
              "
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
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />
          </div>
        </div>

        {/* Story Points */}

        {issue.storyPoints !== null &&
          issue.storyPoints !== undefined && (
            <p className="mt-3 text-[10px] text-slate-400">
              {issue.storyPoints} story points
            </p>
          )}
      </div>

      {/* =====================================================
          DESKTOP ROW
      ===================================================== */}

      <div
        className="
          hidden
          lg:grid
          grid-cols-[minmax(0,1fr)_110px_90px_120px_150px_40px_40px]
          gap-4
          items-center
          px-4
          py-4
          bg-white
          dark:bg-slate-900
          hover:bg-slate-50
          dark:hover:bg-slate-800/50
          transition-colors
        "
      >
        {/* Issue */}

        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-bold ${
              typeStyles[issue.type] ||
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {issue.type}
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-xs font-semibold text-[#0052CC]">
                {issue.id}
              </span>

              <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {issue.title}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {issue.labels?.map((label) => (
                <span
                  key={label}
                  className="
                    rounded
                    bg-slate-100
                    px-2
                    py-0.5
                    text-[10px]
                    text-slate-500
                    dark:bg-slate-800
                    dark:text-slate-400
                  "
                >
                  {label}
                </span>
              ))}

              {issue.storyPoints !== null &&
                issue.storyPoints !== undefined && (
                  <span className="text-[10px] text-slate-400">
                    {issue.storyPoints} pts
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Status */}

        <span
          className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusStyles[issue.status] ||
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {issue.status}
        </span>

        {/* Priority */}

        <span
          className={`text-xs font-semibold ${
            priorityStyles[issue.priority] ||
            "text-slate-400"
          }`}
        >
          {issue.priority}
        </span>

        {/* Due Date */}

        <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <CalendarDays
            size={14}
            className="shrink-0"
          />

          <span className="truncate">
            {issue.dueDate || "—"}
          </span>
        </div>

        {/* Sprint */}

        <div className="relative min-w-0">
          <select
            value={issue.sprint}
            onChange={(e) =>
              onSprintChange(
                issue.id,
                e.target.value
              )
            }
            className="
              w-full
              appearance-none
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              py-2
              pl-3
              pr-8
              text-xs
              font-medium
              text-slate-700
              outline-none
              focus:border-[#0052CC]
              focus:ring-2
              focus:ring-blue-100
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-200
              dark:focus:ring-blue-950
            "
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
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />
        </div>

        {/* Assignee */}

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#172B4D]
            text-[10px]
            font-bold
            text-white
          "
          title={
            issue.assignee?.name ||
            "Unassigned"
          }
        >
          {issue.assignee?.initials || "?"}
        </div>

        {/* Actions */}

        <div className="relative">
          <details className="relative">
            <summary
              className="
                list-none
                flex
                h-8
                w-8
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                text-slate-400
                hover:bg-slate-100
                hover:text-slate-700
                dark:hover:bg-slate-800
                dark:hover:text-slate-200
                transition
              "
              title="Issue actions"
            >
              <MoreHorizontal size={18} />
            </summary>

            <div
              className="
                absolute
                right-0
                top-9
                z-30
                w-36
                overflow-hidden
                rounded-lg
                border
                border-slate-200
                bg-white
                shadow-xl
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <button
                type="button"
                onClick={() => onEdit(issue)}
                className="
                  flex
                  w-full
                  items-center
                  gap-2
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-slate-700
                  hover:bg-slate-50
                  dark:text-slate-200
                  dark:hover:bg-slate-800
                  transition
                "
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(issue)}
                className="
                  flex
                  w-full
                  items-center
                  gap-2
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-red-600
                  hover:bg-red-50
                  dark:hover:bg-red-950/30
                  transition
                "
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </details>
        </div>
      </div>
    </>
  );
};

export default BacklogIssue;
