import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  bg,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2 text-[#172B4D]">
          {value}
        </h2>
      </div>

      <div
        className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
    </div>
  );
};

const BoardStats = ({ issues = [] }) => {
  const total = issues.length;

  const completed = issues.filter(
    (issue) => issue.status === "done"
  ).length;

  const inProgress = issues.filter(
    (issue) =>
      issue.status === "progress" ||
      issue.status === "in-progress"
  ).length;

  const backlog = issues.filter(
    (issue) => issue.status === "backlog"
  ).length;

  const todo = issues.filter(
    (issue) => issue.status === "todo"
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="space-y-5">
      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Issues"
          value={total}
          bg="bg-blue-50"
          icon={
            <FolderKanban
              size={24}
              className="text-blue-600"
            />
          }
        />

        <StatCard
          title="To Do"
          value={todo}
          bg="bg-slate-100"
          icon={
            <Clock3
              size={24}
              className="text-slate-600"
            />
          }
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          bg="bg-amber-50"
          icon={
            <Clock3
              size={24}
              className="text-amber-600"
            />
          }
        />

        <StatCard
          title="Completed"
          value={completed}
          bg="bg-emerald-50"
          icon={
            <CheckCircle2
              size={24}
              className="text-emerald-600"
            />
          }
        />

        <StatCard
          title="Backlog"
          value={backlog}
          bg="bg-red-50"
          icon={
            <AlertTriangle
              size={24}
              className="text-red-600"
            />
          }
        />
      </div>

      {/* Sprint Progress */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="font-bold text-[#172B4D]">
              Sprint Progress
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {completed} of {total} issues completed
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-[#0052CC]"
            />

            <span className="font-bold text-[#0052CC]">
              {progress}%
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0052CC] rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardStats;