import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Play,
  Calendar as CalendarIcon,
  X,
  ArrowRight,
  ListChecks,
  MessageSquare,
} from "lucide-react";

import { backlogIssues } from "../backlog/backlogData";
import CommentsPanel from "../ui/CommentsPanel";

const initialSprints = [
  {
    id: "ATL Sprint 13",
    goal: "Billing polish",
    startDate: "09 Aug 2026",
    endDate: "23 Aug 2026",
    status: "Active",
  },
  {
    id: "ATL Sprint 11",
    goal: "Auth hardening",
    startDate: "11 Jul 2026",
    endDate: "24 Jul 2026",
    status: "Completed",
  },
];

const formatDate = (date) => {
  if (!date) return "Not set";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function SprintsModule() {
  // ============================================================
  // SPRINTS
  // ============================================================

  const [sprints, setSprints] = useState(initialSprints);

  // ============================================================
  // ISSUES
  // ============================================================

  const [issues, setIssues] = useState(backlogIssues);

  // ============================================================
  // CREATE SPRINT FORM
  // ============================================================

  const [sprintName, setSprintName] = useState("");
  const [sprintGoal, setSprintGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ============================================================
  // DELETE / MOVE ISSUES
  // ============================================================

  const [sprintToDelete, setSprintToDelete] = useState(null);
  const [selectedIssueIds, setSelectedIssueIds] = useState([]);
  const [targetSprint, setTargetSprint] = useState("Backlog");

  // ============================================================
  // COMMENTS DRAWER
  // ============================================================

  const [selectedSprint, setSelectedSprint] = useState(null);

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  // ============================================================
  // GET ISSUES FOR SPRINT
  // ============================================================

  const getSprintIssues = (sprintId) => {
    return issues.filter((issue) => issue.sprint === sprintId);
  };

  // ============================================================
  // CREATE SPRINT
  // ============================================================

  const handleCreateSprint = (e) => {
    e.preventDefault();

    const cleanName = sprintName.trim();

    if (!cleanName) {
      showNotification("Sprint name is required", "error");
      return;
    }

    const sprintExists = sprints.some(
      (sprint) =>
        sprint.id.toLowerCase() === cleanName.toLowerCase()
    );

    if (sprintExists) {
      showNotification("Sprint already exists", "error");
      return;
    }

    if (
      startDate &&
      endDate &&
      new Date(endDate) < new Date(startDate)
    ) {
      showNotification(
        "End date cannot be before start date",
        "error"
      );
      return;
    }

    const newSprint = {
      id: cleanName,
      goal: sprintGoal.trim() || "General sprint goals",
      startDate: formatDate(startDate || "2026-08-06"),
      endDate: formatDate(endDate || "2026-08-20"),
      status: "Planned",
    };

    setSprints((prev) => [newSprint, ...prev]);

    setSprintName("");
    setSprintGoal("");
    setStartDate("");
    setEndDate("");

    showNotification("Sprint created successfully");
  };

  // ============================================================
  // START / COMPLETE SPRINT
  // ============================================================

  const handleToggleStatus = (sprintId) => {
    setSprints((prev) =>
      prev.map((sprint) => {
        if (sprint.id !== sprintId) {
          return sprint;
        }

        if (sprint.status === "Planned") {
          showNotification("Sprint started");

          return {
            ...sprint,
            status: "Active",
          };
        }

        if (sprint.status === "Active") {
          showNotification("Sprint completed");

          return {
            ...sprint,
            status: "Completed",
          };
        }

        return sprint;
      })
    );
  };

  // ============================================================
  // DELETE SPRINT
  // ============================================================

  const handleDeleteClick = (sprint) => {
    const sprintIssues = getSprintIssues(sprint.id);

    if (sprintIssues.length === 0) {
      setSprints((prev) =>
        prev.filter((item) => item.id !== sprint.id)
      );

      if (selectedSprint?.id === sprint.id) {
        setSelectedSprint(null);
      }

      showNotification("Sprint deleted successfully");
      return;
    }

    setSprintToDelete(sprint);

    setSelectedIssueIds(
      sprintIssues.map((issue) => issue.id)
    );

    setTargetSprint("Backlog");
  };

  // ============================================================
  // CLOSE DELETE MODAL
  // ============================================================

  const closeDeleteModal = () => {
    setSprintToDelete(null);
    setSelectedIssueIds([]);
    setTargetSprint("Backlog");
  };

  // ============================================================
  // SELECT / DESELECT ISSUE
  // ============================================================

  const toggleIssueSelection = (issueId) => {
    setSelectedIssueIds((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  // ============================================================
  // SELECT / DESELECT ALL
  // ============================================================

  const toggleAllIssues = () => {
    if (!sprintToDelete) return;

    const sprintIssues = getSprintIssues(
      sprintToDelete.id
    );

    const allSelected =
      selectedIssueIds.length === sprintIssues.length;

    if (allSelected) {
      setSelectedIssueIds([]);
    } else {
      setSelectedIssueIds(
        sprintIssues.map((issue) => issue.id)
      );
    }
  };

  // ============================================================
  // MOVE ISSUES + DELETE SPRINT
  // ============================================================

  const handleMoveIssues = () => {
    if (!sprintToDelete) return;

    if (selectedIssueIds.length === 0) {
      showNotification(
        "Select at least one issue to move",
        "error"
      );
      return;
    }

    if (!targetSprint) {
      showNotification(
        "Select a destination sprint",
        "error"
      );
      return;
    }

    if (targetSprint === sprintToDelete.id) {
      showNotification(
        "Issues cannot be moved to the same sprint",
        "error"
      );
      return;
    }

    setIssues((prev) =>
      prev.map((issue) =>
        selectedIssueIds.includes(issue.id)
          ? {
              ...issue,
              sprint: targetSprint,
            }
          : issue
      )
    );

    const remainingIssues = getSprintIssues(
      sprintToDelete.id
    ).filter(
      (issue) =>
        !selectedIssueIds.includes(issue.id)
    );

    if (remainingIssues.length === 0) {
      setSprints((prev) =>
        prev.filter(
          (sprint) =>
            sprint.id !== sprintToDelete.id
        )
      );

      if (selectedSprint?.id === sprintToDelete.id) {
        setSelectedSprint(null);
      }

      const count = selectedIssueIds.length;

      closeDeleteModal();

      showNotification(
        `${count} issue${
          count > 1 ? "s" : ""
        } moved and sprint deleted`
      );

      return;
    }

    const count = selectedIssueIds.length;

    closeDeleteModal();

    showNotification(
      `${count} issue${
        count > 1 ? "s" : ""
      } moved successfully`
    );
  };

  // ============================================================
  // OPEN COMMENTS DRAWER
  // ============================================================

  const openCommentsDrawer = (sprint) => {
    setSelectedSprint(sprint);
  };

  // ============================================================
  // CLOSE COMMENTS DRAWER
  // ============================================================

  const closeCommentsDrawer = () => {
    setSelectedSprint(null);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-5">
      {/* ======================================================
          NOTIFICATION
      ====================================================== */}

      {notification && (
        <div className="fixed top-5 right-5 z-[100]">
          <div
            className={`min-w-[260px] max-w-sm px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 ${
              notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                notification.type === "error"
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
            />

            <p className="text-sm font-semibold">
              {notification.message}
            </p>

            <button
              type="button"
              onClick={() =>
                setNotification(null)
              }
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sprints
        </h1>

        <p className="text-sm text-slate-500 mt-0.5">
          Plan and run your iterations.
        </p>
      </div>

      {/* ======================================================
          CREATE SPRINT
      ====================================================== */}

      <form
        onSubmit={handleCreateSprint}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
      >
        <input
          type="text"
          required
          value={sprintName}
          onChange={(e) =>
            setSprintName(e.target.value)
          }
          placeholder="Sprint name"
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
        />

        <input
          type="text"
          value={sprintGoal}
          onChange={(e) =>
            setSprintGoal(e.target.value)
          }
          placeholder="Sprint goal"
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 text-slate-600"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 text-slate-600"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus size={16} />
          Create sprint
        </button>
      </form>

      {/* ======================================================
          SPRINT LIST
      ====================================================== */}

      <div className="space-y-3">
        {sprints.map((sprint) => {
          const sprintIssues =
            getSprintIssues(sprint.id);

          const completedIssues =
            sprintIssues.filter(
              (issue) =>
                issue.status === "Done"
            ).length;

          return (
            <div
              key={sprint.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Sprint Info */}

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {sprint.id}
                  </h3>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      sprint.status === "Active"
                        ? "bg-blue-100 text-blue-700"
                        : sprint.status === "Completed"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {sprint.status}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-700">
                  {sprint.goal}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CalendarIcon size={13} />

                  <span>
                    {sprint.startDate} –{" "}
                    {sprint.endDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ListChecks size={13} />

                  <span>
                    {completedIssues}/
                    {sprintIssues.length} done
                  </span>
                </div>
              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}

              <div className="flex items-center gap-2 flex-wrap">
                {/* COMMENTS */}

                <button
                  type="button"
                  onClick={() =>
                    openCommentsDrawer(sprint)
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-700 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  Comments
                </button>

                {/* START / COMPLETE */}

                {sprint.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleStatus(
                        sprint.id
                      )
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    {sprint.status ===
                    "Active" ? (
                      <>
                        <CheckCircle2
                          size={14}
                        />
                        Complete sprint
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Start sprint
                      </>
                    )}
                  </button>
                )}

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteClick(
                      sprint
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty State */}

        {sprints.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No sprints found
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Create your first sprint above.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================
          COMMENTS DETAILS DRAWER
      ====================================================== */}

      {selectedSprint && (
        <div
          className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[1px]"
          onClick={closeCommentsDrawer}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Drawer Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MessageSquare size={17} />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {selectedSprint.id}
                    </h2>

                    <p className="text-[11px] text-slate-400">
                      Sprint comments & attachments
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCommentsDrawer}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                aria-label="Close comments"
              >
                <X size={20} />
              </button>
            </div>

            {/* ==================================================
                ONLY COMMENTS PANEL
            ================================================== */}

            <div className="flex-1 overflow-y-auto">
              <CommentsPanel
                issueId={`sprint-${selectedSprint.id}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MOVE ISSUES MODAL
      ====================================================== */}

      {sprintToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Move Issues Before Deleting
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">
                    {sprintToDelete.id}
                  </span>{" "}
                  contains{" "}
                  {getSprintIssues(
                    sprintToDelete.id
                  ).length}{" "}
                  issue(s).
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="p-6 space-y-5">

              {/* Destination */}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Move selected issues to
                </label>

                <select
                  value={targetSprint}
                  onChange={(e) =>
                    setTargetSprint(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-600"
                >
                  <option value="Backlog">
                    Backlog
                  </option>

                  {sprints
                    .filter(
                      (sprint) =>
                        sprint.id !==
                        sprintToDelete.id
                    )
                    .map((sprint) => (
                      <option
                        key={sprint.id}
                        value={sprint.id}
                      >
                        {sprint.id}
                      </option>
                    ))}
                </select>
              </div>

              {/* Issues Header */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Issues
                  </p>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedIssueIds.length}{" "}
                    selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleAllIssues}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {selectedIssueIds.length ===
                  getSprintIssues(
                    sprintToDelete.id
                  ).length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              {/* Issue List */}

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                {getSprintIssues(
                  sprintToDelete.id
                ).map((issue) => {
                  const selected =
                    selectedIssueIds.includes(
                      issue.id
                    );

                  return (
                    <label
                      key={issue.id}
                      className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100 cursor-pointer transition ${
                        selected
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleIssueSelection(
                            issue.id
                          )
                        }
                        className="h-4 w-4 accent-blue-600"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600">
                            {issue.id}
                          </span>

                          <span className="text-xs text-slate-700 truncate">
                            {issue.title}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {issue.status} ·{" "}
                          {issue.priority} ·{" "}
                          {issue.storyPoints}{" "}
                          points
                        </p>
                      </div>
                    </label>
                  );
                })}

                {getSprintIssues(
                  sprintToDelete.id
                ).length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No issues in this sprint.
                    </p>
                  </div>
                )}
              </div>

              {/* Warning */}

              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-xs text-amber-700">
                  All issues must be moved out of{" "}
                  <strong>
                    {sprintToDelete.id}
                  </strong>{" "}
                  before this sprint can be
                  deleted.
                </p>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleMoveIssues}
                disabled={
                  selectedIssueIds.length ===
                  0
                }
                className="px-5 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <ArrowRight size={16} />
                Move & Delete Sprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
