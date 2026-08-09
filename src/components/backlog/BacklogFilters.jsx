import { RotateCcw, Search } from "lucide-react";
import {
  ISSUE_TYPES,
  PRIORITIES,
  SPRINTS,
  STATUSES,
  ASSIGNEES,
} from "./backlogConstants";

const BacklogFilters = ({
  search,
  setSearch,
  filters,
  setFilters,
}) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setSearch("");

    setFilters({
      type: "All",
      priority: "All",
      status: "All",
      assignee: "All",
      sprint: "All",
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col xl:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) =>
            handleChange("type", e.target.value)
          }
          className="filter-select"
        >
          <option value="All">All Types</option>

          {ISSUE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) =>
            handleChange("priority", e.target.value)
          }
          className="filter-select"
        >
          <option value="All">All Priorities</option>

          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
          }
          className="filter-select"
        >
          <option value="All">All Statuses</option>

          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Assignee */}
        <select
          value={filters.assignee}
          onChange={(e) =>
            handleChange("assignee", e.target.value)
          }
          className="filter-select"
        >
          <option value="All">All Assignees</option>

          {ASSIGNEES.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Sprint */}
        <select
          value={filters.sprint}
          onChange={(e) =>
            handleChange("sprint", e.target.value)
          }
          className="filter-select"
        >
          <option value="All">All Sprints</option>

          {SPRINTS.map((sprint) => (
            <option key={sprint} value={sprint}>
              {sprint}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          type="button"
          onClick={resetFilters}
          title="Reset filters"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">
            Reset
          </span>
        </button>
      </div>
    </div>
  );
};

export default BacklogFilters;