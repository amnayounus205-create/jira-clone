import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Plus,
  FolderOpen,
} from "lucide-react";

import KanbanCard from "./KanbanCard";

const KanbanColumn = React.memo(
  ({
    column,
    issues,
    onCreateIssue,
    onOpenIssue,
  }) => {

    const {
      setNodeRef,
      isOver,
    } = useDroppable({
      id: column.id,
    });

    return (

      <div
        ref={setNodeRef}
        className={`
          bg-slate-100
          rounded-2xl
          p-4
          min-w-[340px]
          max-w-[340px]
          flex
          flex-col
          h-full
          transition-all
          duration-200
          ${
            isOver
              ? "ring-2 ring-[#0052CC] bg-blue-50"
              : ""
          }
        `}
      >

        {/* Header */}

        <div className="flex justify-between items-center mb-5 flex-shrink-0">

          <div className="flex items-center gap-3">

            <span
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  column.color,
              }}
            />

            <h2 className="font-bold text-[#172B4D]">
              {column.title}
            </h2>

            <span
              className="
                bg-white
                text-gray-600
                px-2
                py-1
                rounded-full
                text-xs
                font-semibold
              "
            >
              {issues.length}
            </span>

          </div>

          <button
            onClick={() =>
              onCreateIssue(
                column.id
              )
            }
            className="
              w-8
              h-8
              rounded-lg
              bg-white
              hover:bg-[#0052CC]
              hover:text-white
              transition
              flex
              items-center
              justify-center
            "
          >
            <Plus size={18} />
          </button>

        </div>

        {/* Cards */}

        <SortableContext
          items={issues.map(
            (issue) =>
              issue.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >

          <div
            className="
              flex-1
              min-h-0
              overflow-y-auto
              overflow-x-hidden
              space-y-4
              pr-2
            "
          >

            {issues.length >
            0 ? (

              issues.map(
                (issue) => (

                  <KanbanCard
                    key={issue.id}
                    issue={issue}
                    onOpen={
                      onOpenIssue
                    }
                  />

                )
              )

            ) : (

              <div
                className="
                  h-full
                  min-h-[220px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  border-2
                  border-dashed
                  border-gray-300
                  rounded-xl
                  text-gray-400
                "
              >

                <FolderOpen
                  size={42}
                />

                <p className="mt-3 text-sm">
                  No issues available
                </p>

                <button
                  onClick={() =>
                    onCreateIssue(
                      column.id
                    )
                  }
                  className="
                    mt-4
                    bg-[#0052CC]
                    hover:bg-[#0747A6]
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  Create Issue
                </button>

              </div>

            )}

          </div>

        </SortableContext>

      </div>

    );

  }
);

export default KanbanColumn;