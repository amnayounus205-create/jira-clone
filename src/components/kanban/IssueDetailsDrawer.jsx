import {
  X,
  Calendar,
  Flag,
  MessageSquare,
  Paperclip,
} from "lucide-react";

const priorityColor = {
  Highest: "text-red-600",
  High: "text-orange-500",
  Medium: "text-yellow-500",
  Low: "text-green-600",
};

const IssueDetailsDrawer = ({
  open,
  issue,
  onClose,
}) => {

  if (!open || !issue) return null;

  return (

    <div className="fixed inset-0 z-[100]">

      {/* Overlay */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Drawer */}

      <div
        className="
          absolute
          right-0
          top-0
          h-screen
          w-full
          max-w-[520px]
          bg-white
          shadow-2xl
          overflow-y-auto
          animate-slide-in
        "
      >

        {/* Header */}

        <div className="sticky top-0 bg-white z-20 border-b p-6 flex justify-between items-center">

          <div>

            <p className="text-xs text-gray-500">
              {issue.id}
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {issue.title}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
            "
          >
            <X />
          </button>

        </div>

        {/* Content */}

        <div className="p-6 space-y-8">

          {/* Description */}

          <div>

            <h3 className="font-semibold mb-3">
              Description
            </h3>

            <p className="text-gray-600 leading-7">
              {issue.description}
            </p>

          </div>

          {/* Details */}

          <div className="grid grid-cols-2 gap-6">

            <div>

              <p className="text-sm text-gray-500">
                Assignee
              </p>

              <div className="flex items-center gap-3 mt-2">

                <img
                  src={issue.assigneeAvatar}
                  alt={issue.assignee}
                  className="w-10 h-10 rounded-full"
                />

                <span>
                  {issue.assignee}
                </span>

              </div>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Priority
              </p>

              <div
                className={`flex items-center gap-2 mt-2 ${priorityColor[issue.priority]}`}
              >
                <Flag size={18} />
                {issue.priority}
              </div>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Story Points
              </p>

              <div className="font-semibold mt-2">
                {issue.storyPoints}
              </div>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Due Date
              </p>

              <div className="flex items-center gap-2 mt-2">

                <Calendar size={18} />

                {issue.dueDate || "Not Set"}

              </div>

            </div>

          </div>

          {/* Labels */}

          <div>

            <h3 className="font-semibold mb-3">
              Labels
            </h3>

            <div className="flex flex-wrap gap-2">

              {issue.labels?.length ? (

                issue.labels.map((label) => (

                  <span
                    key={label}
                    className="
                      bg-blue-100
                      text-blue-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                    "
                  >
                    {label}
                  </span>

                ))

              ) : (

                <span className="text-gray-400">
                  No Labels
                </span>

              )}

            </div>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 gap-6">

            <div className="flex items-center gap-2">

              <MessageSquare size={18} />

              {issue.comments} Comments

            </div>

            <div className="flex items-center gap-2">

              <Paperclip size={18} />

              {issue.attachments} Attachments

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default IssueDetailsDrawer;