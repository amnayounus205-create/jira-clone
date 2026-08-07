import { useState, useEffect } from "react";
import { X } from "lucide-react";

const priorities = [
  "Highest",
  "High",
  "Medium",
  "Low",
];

const issueTypes = [
  "Story",
  "Task",
  "Bug",
];

const statuses = [
  "todo",
  "progress",
  "review",
  "done",
];

const CreateIssueModal = ({
  open,
  onClose,
  onSave,
  defaultStatus = "todo",
}) => {
  const initialState = {
    id: "",
    title: "",
    description: "",
    type: "Task",
    priority: "Medium",
    status: defaultStatus,
    assignee: "Muhammad Ali",
    assigneeAvatar:
      "https://i.pravatar.cc/100?img=11",
    dueDate: "",
    sprint: "Sprint 1",
    storyPoints: 3,
    comments: 0,
    attachments: 0,
    labels: [],
  };

  const [form, setForm] =
    useState(initialState);

  const [labelInput, setLabelInput] =
    useState("");

  useEffect(() => {
    if (open) {
      setForm({
        ...initialState,
        status: defaultStatus,
        id:
          "KAN-" +
          Math.floor(
            Math.random() * 900 + 100
          ),
      });

      setLabelInput("");
    }
  }, [open, defaultStatus]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const addLabel = () => {
    if (!labelInput.trim()) return;

    if (
      form.labels.includes(
        labelInput.trim()
      )
    )
      return;

    setForm({
      ...form,
      labels: [
        ...form.labels,
        labelInput.trim(),
      ],
    });

    setLabelInput("");
  };

  const removeLabel = (label) => {
    setForm({
      ...form,
      labels:
        form.labels.filter(
          (item) => item !== label
        ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(form);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">

      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-hidden
          shadow-2xl
          flex
          flex-col
        "
      >

        {/* Header */}

        <div className="sticky top-0 z-20 bg-white border-b p-6 flex justify-between items-center">

          <h2 className="text-2xl font-bold text-[#172B4D]">
            Create Issue
          </h2>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-lg
              hover:bg-gray-100
              flex
              items-center
              justify-center
            "
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 resize-none"
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2">
                Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                {issueTypes.map(
                  (item) => (
                    <option
                      key={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            <div>

              <label className="block mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                {priorities.map(
                  (item) => (
                    <option
                      key={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            <div>

              <label className="block mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                {statuses.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            <div>

              <label className="block mb-2">
                Story Points
              </label>

              <input
                type="number"
                min="1"
                name="storyPoints"
                value={form.storyPoints}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div>

              <label className="block mb-2">
                Sprint
              </label>

              <input
                name="sprint"
                value={form.sprint}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div>

              <label className="block mb-2">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Labels
            </label>

            <div className="flex gap-3">

              <input
                value={labelInput}
                onChange={(e) =>
                  setLabelInput(
                    e.target.value
                  )
                }
                placeholder="Frontend"
                className="flex-1 border rounded-xl p-3"
              />

              <button
                type="button"
                onClick={addLabel}
                className="
                  bg-[#0052CC]
                  hover:bg-[#0747A6]
                  text-white
                  px-6
                  rounded-xl
                "
              >
                Add
              </button>

            </div>

            <div className="flex flex-wrap gap-2 mt-4">

              {form.labels.map(
                (label) => (

                  <span
                    key={label}
                    onClick={() =>
                      removeLabel(
                        label
                      )
                    }
                    className="
                      bg-blue-100
                      text-blue-700
                      px-3
                      py-1
                      rounded-full
                      cursor-pointer
                    "
                  >
                    {label} ✕
                  </span>

                )
              )}

            </div>

          </div>

          {/* Footer */}

          <div className="sticky bottom-0 bg-white border-t pt-5 flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="
                px-6
                py-3
                rounded-xl
                border
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                bg-[#0052CC]
                hover:bg-[#0747A6]
                text-white
                px-6
                py-3
                rounded-xl
              "
            >
              Create Issue
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateIssueModal;