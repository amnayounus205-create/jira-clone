import BacklogIssue from "./BacklogIssue";

const BacklogList = ({
  issues,
  onSprintChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* ==========================
          Desktop Header
      ========================== */}
      <div
        className="
          hidden
          lg:grid
          grid-cols-[minmax(0,1fr)_110px_90px_120px_150px_40px_40px]
          gap-4
          items-center
          px-4
          py-3
          bg-slate-50
          dark:bg-slate-800/60
          border-b
          border-slate-200
          dark:border-slate-800
          text-[11px]
          font-bold
          uppercase
          tracking-wide
          text-slate-500
          dark:text-slate-400
        "
      >
        <span>Issue</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due Date</span>
        <span>Sprint</span>
        <span>Assignee</span>
        <span></span>
      </div>

      {/* ==========================
          Issues
      ========================== */}
      {issues.length > 0 ? (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {issues.map((issue) => (
            <BacklogIssue
              key={issue.id}
              issue={issue}
              onSprintChange={onSprintChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            —
          </div>

          <h3 className="font-semibold text-slate-700 dark:text-slate-200">
            No issues found
          </h3>

          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default BacklogList;