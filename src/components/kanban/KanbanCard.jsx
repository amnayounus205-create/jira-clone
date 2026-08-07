import React from "react";
import {
  MessageSquare,
  Paperclip,
  CalendarDays,
} from "lucide-react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import {
  priorityColors,
  issueTypeColors,
} from "./data/boardData";

const KanbanCard = React.memo(
  ({
    issue,
    onOpen,
  }) => {

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: issue.id,
    });

    const style = {
      transform:
        CSS.Transform.toString(
          transform
        ),
      transition,
      opacity: isDragging
        ? 0.4
        : 1,
      zIndex: isDragging
        ? 9999
        : "auto",
    };

    const handleClick = () => {
      if (isDragging) return;

      if (onOpen) {
        onOpen(issue);
      }
    };

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        onClick={handleClick}
        className={`
          bg-white
          rounded-xl
          border
          border-slate-200
          shadow-sm
          hover:shadow-xl
          transition-all
          duration-200
          cursor-grab
          active:cursor-grabbing
          p-4
          space-y-4
          select-none
          touch-none
          ${
            isDragging
              ? "shadow-2xl scale-105 rotate-2"
              : ""
          }
        `}
      >

        {/* Header */}

        <div className="flex justify-between items-start gap-3">

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              issueTypeColors[
                issue.type
              ]
            }`}
          >
            {issue.type}
          </span>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              priorityColors[
                issue.priority
              ]
            }`}
          >
            {issue.priority}
          </span>

        </div>

        {/* Title */}

        <div>

          <h3 className="font-semibold text-[#172B4D] leading-6">
            {issue.title}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {issue.description}
          </p>

        </div>

        {/* Labels */}

        <div className="flex flex-wrap gap-2">

          {issue.labels?.map(
            (label) => (

              <span
                key={label}
                className="
                  bg-slate-100
                  text-slate-700
                  text-xs
                  px-2
                  py-1
                  rounded-md
                "
              >
                {label}
              </span>

            )
          )}

        </div>

        {/* Footer */}

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4 text-gray-500 text-sm">

            <div className="flex items-center gap-1">
              <MessageSquare size={15} />
              {issue.comments}
            </div>

            <div className="flex items-center gap-1">
              <Paperclip size={15} />
              {issue.attachments}
            </div>

            <div className="flex items-center gap-1">
              <CalendarDays size={15} />
              {issue.dueDate || "-"}
            </div>

          </div>

          <div className="flex items-center gap-3">

            <span
              className="
                w-8
                h-8
                rounded-full
                bg-[#0052CC]
                text-white
                flex
                items-center
                justify-center
                text-xs
                font-bold
              "
            >
              {issue.storyPoints}
            </span>

            <img
              src={issue.assigneeAvatar}
              alt={issue.assignee}
              title={issue.assignee}
              draggable={false}
              className="
                w-9
                h-9
                rounded-full
                border-2
                border-white
                shadow
                pointer-events-none
              "
            />

          </div>

        </div>

        {/* Issue ID */}

        <div className="border-t pt-3">

          <span className="text-xs text-gray-400">
            {issue.id}
          </span>

        </div>

      </div>
    );

  }
);

export default KanbanCard;