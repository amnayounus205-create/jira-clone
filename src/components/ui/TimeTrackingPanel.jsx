import React, { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Timer,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const STORAGE_KEY = "jira_time_tracking";

const formatHours = (hours) => {
  const value = Number(hours || 0);

  if (value === 0) return "0h";

  const wholeHours = Math.floor(value);
  const minutes = Math.round((value - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
};

const readStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

export default function TimeTrackingPanel({
  issueId = "default-issue",
  initialEstimate = 12,
}) {
  // ============================================================
  // ESTIMATE
  // ============================================================

  const [estimate, setEstimate] = useState(initialEstimate);

  const [estimateInput, setEstimateInput] = useState(
    String(initialEstimate)
  );

  const [editingEstimate, setEditingEstimate] = useState(false);

  // ============================================================
  // WORK LOGS
  // ============================================================

  const [workLogs, setWorkLogs] = useState([]);

  const [timeInput, setTimeInput] = useState("");
  const [workDescription, setWorkDescription] = useState("");

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    const stored = readStorage();
    const issueData = stored[issueId];

    if (!issueData) {
      setEstimate(initialEstimate);
      setEstimateInput(String(initialEstimate));
      setWorkLogs([]);
      return;
    }

    setEstimate(
      Number(issueData.estimate ?? initialEstimate)
    );

    setEstimateInput(
      String(issueData.estimate ?? initialEstimate)
    );

    setWorkLogs(issueData.workLogs || []);
  }, [issueId, initialEstimate]);

  // ============================================================
  // SAVE DATA
  // ============================================================

  useEffect(() => {
    const stored = readStorage();

    stored[issueId] = {
      estimate,
      workLogs,
    };

    saveStorage(stored);
  }, [issueId, estimate, workLogs]);

  // ============================================================
  // CALCULATIONS
  // ============================================================

  const timeSpent = useMemo(() => {
    return workLogs.reduce(
      (total, log) => total + Number(log.hours || 0),
      0
    );
  }, [workLogs]);

  const remainingTime = Math.max(
    Number(estimate || 0) - timeSpent,
    0
  );

  const progress = estimate
    ? Math.min((timeSpent / estimate) * 100, 100)
    : 0;

  // ============================================================
  // LOG WORK
  // ============================================================

  const handleLogWork = (e) => {
    e.preventDefault();

    const hours = Number(timeInput);

    if (!hours || hours <= 0) {
      toast.error("Enter valid hours");
      return;
    }

    const newLog = {
      id: `work-${Date.now()}`,
      hours,
      description:
        workDescription.trim() || "Work logged",
      createdAt: new Date().toISOString(),
    };

    setWorkLogs((prev) => [newLog, ...prev]);

    setTimeInput("");
    setWorkDescription("");

    toast.success(`${formatHours(hours)} logged`);
  };

  // ============================================================
  // DELETE WORK LOG
  // ============================================================

  const deleteWorkLog = (logId) => {
    setWorkLogs((prev) =>
      prev.filter((log) => log.id !== logId)
    );

    toast.success("Work log deleted");
  };

  // ============================================================
  // UPDATE ESTIMATE
  // ============================================================

  const saveEstimate = () => {
    const value = Number(estimateInput);

    if (!value || value <= 0) {
      toast.error("Enter a valid estimate");
      return;
    }

    setEstimate(value);
    setEstimateInput(String(value));
    setEditingEstimate(false);

    toast.success("Estimate updated");
  };

  const cancelEstimateEdit = () => {
    setEstimateInput(String(estimate));
    setEditingEstimate(false);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-5">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock3 size={18} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Time Tracking
            </h3>

            <p className="text-[11px] text-slate-400">
              Track work and estimate remaining effort
            </p>
          </div>

        </div>

        <span className="text-xs font-semibold text-slate-500">
          {formatHours(timeSpent)} spent
        </span>

      </div>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Estimate */}

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

          <div className="flex items-center justify-between mb-2">

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimate
            </span>

            <Timer
              size={15}
              className="text-slate-400"
            />

          </div>

          {editingEstimate ? (
            <div className="flex items-center gap-2">

              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimateInput}
                onChange={(e) =>
                  setEstimateInput(e.target.value)
                }
                className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-bold text-slate-700 outline-none"
                autoFocus
              />

              <button
                type="button"
                onClick={saveEstimate}
                className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Check size={14} />
              </button>

              <button
                type="button"
                onClick={cancelEstimateEdit}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X size={14} />
              </button>

            </div>
          ) : (
            <div className="flex items-center justify-between">

              <span className="text-xl font-bold text-slate-800">
                {formatHours(estimate)}
              </span>

              <button
                type="button"
                onClick={() => {
                  setEstimateInput(String(estimate));
                  setEditingEstimate(true);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                title="Edit estimate"
              >
                <Pencil size={14} />
              </button>

            </div>
          )}

        </div>

        {/* Time Spent */}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

          <div className="flex items-center justify-between mb-2">

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
              Time Spent
            </span>

            <Clock3
              size={15}
              className="text-blue-500"
            />

          </div>

          <span className="text-xl font-bold text-blue-700">
            {formatHours(timeSpent)}
          </span>

          <p className="text-[10px] text-blue-500 mt-1">
            Total logged work
          </p>

        </div>

        {/* Remaining */}

        <div
          className={`border rounded-xl p-4 ${
            remainingTime === 0
              ? "bg-emerald-50 border-emerald-100"
              : "bg-amber-50 border-amber-100"
          }`}
        >

          <div className="flex items-center justify-between mb-2">

            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                remainingTime === 0
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              Remaining Time
            </span>

            {remainingTime === 0 ? (
              <Check
                size={15}
                className="text-emerald-600"
              />
            ) : (
              <AlertCircle
                size={15}
                className="text-amber-600"
              />
            )}

          </div>

          <span
            className={`text-xl font-bold ${
              remainingTime === 0
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {formatHours(remainingTime)}
          </span>

          <p
            className={`text-[10px] mt-1 ${
              remainingTime === 0
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {remainingTime === 0
              ? "Estimate completed"
              : "Estimated work remaining"}
          </p>

        </div>

      </div>

      {/* ======================================================
          PROGRESS
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-4">

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-semibold text-slate-700">
            Time progress
          </span>

          <span className="text-xs font-bold text-slate-500">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progress >= 100
                ? "bg-emerald-500"
                : "bg-blue-600"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="flex justify-between mt-2 text-[10px] text-slate-400">

          <span>
            {formatHours(timeSpent)} logged
          </span>

          <span>
            {formatHours(estimate)} estimated
          </span>

        </div>

      </div>

      {/* ======================================================
          LOG WORK FORM
      ====================================================== */}

      <div className="border border-slate-200 rounded-xl p-4">

        <div className="flex items-center gap-2 mb-4">

          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Plus size={16} />
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Log Work
            </h4>

            <p className="text-[10px] text-slate-400">
              Add time spent on this issue
            </p>
          </div>

        </div>

        <form
          onSubmit={handleLogWork}
          className="space-y-3"
        >

          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-2">

            <div className="relative">

              <input
                type="number"
                min="0.25"
                step="0.25"
                value={timeInput}
                onChange={(e) =>
                  setTimeInput(e.target.value)
                }
                placeholder="Hours"
                className="w-full px-3 py-2.5 pr-12 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                HOURS
              </span>

            </div>

            <input
              type="text"
              value={workDescription}
              onChange={(e) =>
                setWorkDescription(e.target.value)
              }
              placeholder="What did you work on?"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500"
            />

            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Plus size={15} />
              Log Work
            </button>

          </div>

        </form>

      </div>

      {/* ======================================================
          WORK LOG HISTORY
      ====================================================== */}

      <div className="border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">

          <div>
            <h4 className="text-xs font-bold text-slate-700">
              Work Log
            </h4>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Recent time entries
            </p>
          </div>

          <span className="text-[10px] font-semibold text-slate-500">
            {workLogs.length}{" "}
            {workLogs.length === 1
              ? "entry"
              : "entries"}
          </span>

        </div>

        {workLogs.length === 0 ? (
          <div className="py-10 text-center">

            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <Clock3 size={18} />
            </div>

            <p className="text-xs font-semibold text-slate-600">
              No work logged
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Add your first time entry above.
            </p>

          </div>
        ) : (
          <div>

            {workLogs.map((log) => (

              <div
                key={log.id}
                className="px-4 py-3 border-b last:border-b-0 border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock3 size={15} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {log.description}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 shrink-0">

                  <span className="text-xs font-bold text-slate-700">
                    {formatHours(log.hours)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      deleteWorkLog(log.id)
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete work log"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* ======================================================
          REMAINING TIME NOTICE
      ====================================================== */}

      {timeSpent > estimate && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200">

          <AlertCircle
            size={17}
            className="text-red-500 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-xs font-bold text-red-700">
              Logged time exceeds estimate
            </p>

            <p className="text-[10px] text-red-500 mt-0.5">
              You have logged{" "}
              {formatHours(timeSpent)}{" "}
              against an estimate of{" "}
              {formatHours(estimate)}.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
