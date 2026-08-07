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
  color,
  bg,
}) => (
  <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2 text-[#172B4D]">
          {value}
        </h2>

      </div>

      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>

    </div>

  </div>
);

const BoardStats = ({ issues }) => {

  const total = issues.length;

  const completed = issues.filter(
    (item) => item.status === "done"
  ).length;

  const inProgress = issues.filter(
    (item) => item.status === "in-progress"
  ).length;

  const backlog = issues.filter(
    (item) => item.status === "backlog"
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (

    <div className="space-y-6">

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

        <StatCard
          title="Total Issues"
          value={total}
          bg="bg-blue-100"
          icon={
            <FolderKanban
              size={28}
              className="text-blue-600"
            />
          }
        />

        <StatCard
          title="Completed"
          value={completed}
          bg="bg-green-100"
          icon={
            <CheckCircle2
              size={28}
              className="text-green-600"
            />
          }
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          bg="bg-yellow-100"
          icon={
            <Clock3
              size={28}
              className="text-yellow-600"
            />
          }
        />

        <StatCard
          title="Backlog"
          value={backlog}
          bg="bg-red-100"
          icon={
            <AlertTriangle
              size={28}
              className="text-red-600"
            />
          }
        />

        <StatCard
          title="Sprint Progress"
          value={`${progress}%`}
          bg="bg-purple-100"
          icon={
            <TrendingUp
              size={28}
              className="text-purple-600"
            />
          }
        />

      </div>

      {/* Progress */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between mb-3">

          <h3 className="font-bold text-lg">
            Sprint Progress
          </h3>

          <span className="font-semibold text-[#0052CC]">
            {progress}%
          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-[#0052CC] h-4 rounded-full transition-all duration-500"
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