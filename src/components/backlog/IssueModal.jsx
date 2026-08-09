import { useEffect } from "react";
import {
  X,
  CalendarDays,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ISSUE_TYPES,
  PRIORITIES,
  STATUSES,
  SPRINTS,
  ASSIGNEES,
} from "./backlogConstants";

import { issueSchema } from "./issueSchema";

const defaultValues = {
  title: "",
  description: "",
  type: "Task",
  priority: "Medium",
  status: "To Do",
  assignee: "",
  reporter: "u1",
  labels: "",
  dueDate: "",
  storyPoints: "",
  sprint: "Backlog",
  epic: "",
};

const IssueModal = ({
  open,
  onClose,
  onSubmit,
  issue = null,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues,
  });

  // ==========================
  // Load Create / Edit Data
  // ==========================

  useEffect(() => {
    if (!open) return;

    if (issue) {
      reset({
        title: issue.title || "",

        description:
          issue.description || "",

        type:
          issue.type || "Task",

        priority:
          issue.priority || "Medium",

        status:
          issue.status || "To Do",

        assignee:
          issue.assignee?.id || "",

        reporter:
          issue.reporter?.id || "u1",

        labels:
          issue.labels?.join(", ") || "",

        dueDate:
          issue.dueDate || "",

        storyPoints:
          issue.storyPoints !== null &&
          issue.storyPoints !== undefined
            ? String(issue.storyPoints)
            : "",

        sprint:
          issue.sprint || "Backlog",

        epic:
          issue.epic || "",
      });
    } else {
      reset(defaultValues);
    }
  }, [open, issue, reset]);

  // ==========================
  // Submit
  // ==========================

  const submitForm = (data) => {
    /*
      Toast is intentionally NOT handled here.

      BacklogModule handles:
      - Create
      - Update
      - Delete
      - Sprint change
      - Toast notifications
    */

    onSubmit(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* ==========================
            Header
        ========================== */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">
              {issue
                ? "Edit Issue"
                : "Create Issue"}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {issue
                ? "Update issue details"
                : "Create a new backlog issue"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* ==========================
            Form
        ========================== */}

        <form
          onSubmit={handleSubmit(submitForm)}
          className="overflow-y-auto p-6 space-y-5"
        >

          {/* Title */}

          <div>
            <label className="form-label">
              Title *
            </label>

            <input
              {...register("title")}
              placeholder="e.g. Implement OAuth sign-in"
              className="form-input"
            />

            {errors.title && (
              <p className="form-error">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}

          <div>
            <label className="form-label">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe the issue..."
              className="form-input resize-none"
            />

            {errors.description && (
              <p className="form-error">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Type + Priority */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="form-label">
                Issue Type *
              </label>

              <select
                {...register("type")}
                className="form-input"
              >
                {ISSUE_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="form-label">
                Priority *
              </label>

              <select
                {...register("priority")}
                className="form-input"
              >
                {PRIORITIES.map(
                  (priority) => (
                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* Status + Assignee */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="form-label">
                Status *
              </label>

              <select
                {...register("status")}
                className="form-input"
              >
                {STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="form-label">
                Assignee *
              </label>

              <select
                {...register("assignee")}
                className="form-input"
              >
                <option value="">
                  Select assignee
                </option>

                {ASSIGNEES.map(
                  (user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name}
                    </option>
                  )
                )}
              </select>

              {errors.assignee && (
                <p className="form-error">
                  {errors.assignee.message}
                </p>
              )}
            </div>

          </div>

          {/* Reporter + Sprint */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="form-label">
                Reporter *
              </label>

              <select
                {...register("reporter")}
                className="form-input"
              >
                {ASSIGNEES.map(
                  (user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="form-label">
                Sprint *
              </label>

              <select
                {...register("sprint")}
                className="form-input"
              >
                {SPRINTS.map(
                  (sprint) => (
                    <option
                      key={sprint}
                      value={sprint}
                    >
                      {sprint}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* Labels */}

          <div>
            <label className="form-label">
              Labels
            </label>

            <input
              {...register("labels")}
              placeholder="frontend, authentication, bug"
              className="form-input"
            />

            <p className="text-[11px] text-slate-400 mt-1">
              Separate multiple labels with commas.
            </p>
          </div>

          {/* Due Date + Story Points */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="form-label">
                Due Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  {...register("dueDate")}
                  type="date"
                  className="form-input pl-10"
                />

              </div>
            </div>

            <div>
              <label className="form-label">
                Story Points
              </label>

              <input
                {...register("storyPoints")}
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 5"
                className="form-input"
              />
            </div>

          </div>

          {/* Epic */}

          <div>
            <label className="form-label">
              Epic
            </label>

            <input
              {...register("epic")}
              placeholder="e.g. Authentication"
              className="form-input"
            />
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 transition"
            >
              {issue
                ? "Update Issue"
                : "Create Issue"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default IssueModal;

