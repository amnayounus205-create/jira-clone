import {
  Search,
  Plus,
  SlidersHorizontal,
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
    <div className="space-y-5">

      {/* Top Header */}

      <div className="flex items-center justify-between gap-4 flex-wrap">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0052CC] flex items-center justify-center">
              <SlidersHorizontal
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#172B4D]">
                Kanban Board
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage and track your sprint progress
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onCreateIssue("todo")}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            bg-[#0052CC]
            hover:bg-[#0747A6]
            active:bg-[#003B8F]
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            shadow-sm
            hover:shadow-md
            transition-all
            duration-200
            whitespace-nowrap
          "
        >
          <Plus size={18} />
          Create Issue
        </button>

      </div>

      {/* Filters */}

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          p-4
          shadow-sm
        "
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search issues..."
              className="
                w-full
                h-11
                border
                border-gray-200
                rounded-xl
                bg-gray-50
                pl-10
                pr-4
                text-sm
                text-[#172B4D]
                outline-none
                transition
                focus:bg-white
                focus:border-[#0052CC]
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

          {/* Priority */}

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            className="
              w-full
              h-11
              border
              border-gray-200
              rounded-xl
              bg-gray-50
              px-4
              text-sm
              text-[#172B4D]
              outline-none
              cursor-pointer
              transition
              focus:bg-white
              focus:border-[#0052CC]
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">
              All Priorities
            </option>
            <option value="Highest">
              Highest
            </option>
            <option value="High">
              High
            </option>
            <option value="Medium">
              Medium
            </option>
            <option value="Low">
              Low
            </option>
          </select>

          {/* Assignee */}

          <select
            value={assignee}
            onChange={(e) =>
              setAssignee(e.target.value)
            }
            className="
              w-full
              h-11
              border
              border-gray-200
              rounded-xl
              bg-gray-50
              px-4
              text-sm
              text-[#172B4D]
              outline-none
              cursor-pointer
              transition
              focus:bg-white
              focus:border-[#0052CC]
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">
              All Assignees
            </option>

            <option value="Muhammad Ali">
              Muhammad Ali
            </option>

            <option value="Sarah Khan">
              Sarah Khan
            </option>

            <option value="Ahmed Raza">
              Ahmed Raza
            </option>
          </select>

          {/* Sprint */}

          <select
            value={sprint}
            onChange={(e) =>
              setSprint(e.target.value)
            }
            className="
              w-full
              h-11
              border
              border-gray-200
              rounded-xl
              bg-gray-50
              px-4
              text-sm
              text-[#172B4D]
              outline-none
              cursor-pointer
              transition
              focus:bg-white
              focus:border-[#0052CC]
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">
              All Sprints
            </option>

            <option value="Sprint 1">
              Sprint 1
            </option>

            <option value="Sprint 2">
              Sprint 2
            </option>

            <option value="Sprint 3">
              Sprint 3
            </option>
          </select>

        </div>

      </div>

    </div>
  );
};

export default BoardHeader;