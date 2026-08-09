import BacklogIssue from "./BacklogIssue";

const BacklogList = ({
  issues,
  onSprintChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="hidden lg:grid grid-cols-[1fr_110px_90px_120px_150px_40px] gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-slate-500">

        <span>Issue</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due Date</span>
        <span>Sprint</span>
        <span>Assignee</span>

      </div>

      {/* Issues */}
      {issues.length > 0 ? (
        issues.map((issue) => (
          <BacklogIssue
            key={issue.id}
            issue={issue}
            onSprintChange={onSprintChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="py-16 text-center">

          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            —
          </div>

          <h3 className="font-semibold text-slate-700">
            No issues found
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Try changing your search or filters.
          </p>

        </div>
      )}
    </div>
  );
};

export default BacklogList;

