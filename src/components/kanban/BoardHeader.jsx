import {
  Search,
  Plus,
} from "lucide-react";

const BoardHeader = ({
  search,
  setSearch,
  priority,
  setPriority,
  assignee,
  setAssignee,
  sprint,
  setSprint,
  onCreateIssue,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">

      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>

          <h1 className="text-3xl font-bold text-[#172B4D]">
            Kanban Board
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your sprint like Jira
          </p>

        </div>

        <button
          onClick={() =>
            onCreateIssue("todo")
          }
          className="
            flex
            items-center
            gap-2
            bg-[#0052CC]
            hover:bg-[#0747A6]
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          <Plus size={18} />
          Create Issue
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search issue..."
            className="
              w-full
              border
              rounded-xl
              pl-10
              pr-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "
          />

        </div>

        {/* Priority */}

        <select
          value={priority}
          onChange={(e) =>
            setPriority(
              e.target.value
            )
          }
          className="border rounded-xl px-4 py-3"
        >
          <option>All</option>
          <option>Highest</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* Assignee */}

        <select
          value={assignee}
          onChange={(e) =>
            setAssignee(
              e.target.value
            )
          }
          className="border rounded-xl px-4 py-3"
        >
          <option>All</option>
          <option>Muhammad Ali</option>
          <option>Sarah Khan</option>
          <option>Ahmed Raza</option>
        </select>

        {/* Sprint */}

        <select
          value={sprint}
          onChange={(e) =>
            setSprint(
              e.target.value
            )
          }
          className="border rounded-xl px-4 py-3"
        >
          <option>All</option>
          <option>Sprint 1</option>
          <option>Sprint 2</option>
          <option>Sprint 3</option>
        </select>

      </div>

    </div>
  );
};

export default BoardHeader;