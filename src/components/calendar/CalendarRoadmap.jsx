import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  Activity,
  Trash2,
  Send,
  CalendarDays,
  Clock3,
  ListChecks,
} from "lucide-react";
import toast from "react-hot-toast";

import { backlogIssues } from "../backlog/backlogData";

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

const statusColors = {
  Backlog: "bg-slate-100 text-slate-700",
  "To Do": "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Review: "bg-indigo-50 text-indigo-700",
  Testing: "bg-purple-50 text-purple-700",
  Done: "bg-emerald-50 text-emerald-700",
};

const statusDotColors = {
  Backlog: "bg-slate-400",
  "To Do": "bg-blue-500",
  "In Progress": "bg-amber-500",
  Review: "bg-indigo-500",
  Testing: "bg-purple-500",
  Done: "bg-emerald-500",
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (value) => String(value).padStart(2, "0");

const toDateKey = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

const parseDisplayDate = (value) => {
  if (!value) return null;

  const match = value.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
  );

  if (!match) return null;

  const [, day, monthName, year] = match;

  const monthIndex = monthNames.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1) return null;

  return new Date(
    Number(year),
    monthIndex,
    Number(day)
  );
};

const formatDate = (date) => {
  if (!date) return "Not set";

  const parsed =
    typeof date === "string"
      ? new Date(`${date}T00:00:00`)
      : date;

  if (Number.isNaN(parsed.getTime())) {
    return "Not set";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getSprintDateKey = (value) => {
  const parsed = parseDisplayDate(value);

  if (!parsed) return null;

  return toDateKey(parsed);
};

export default function CalendarRoadmap() {
  // ============================================================
  // CALENDAR
  // ============================================================

  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 7, 1)
  );

  // ============================================================
  // ISSUES
  // Uses the same backlog data as Backlog/Sprints.
  // ============================================================

  const [issues, setIssues] = useState(
    backlogIssues.map((issue) => ({
      ...issue,
      dueDate: issue.dueDate || "",
    }))
  );

  // ============================================================
  // SPRINTS
  // Keep sprint schedule in sync with Sprints module structure.
  // ============================================================

  const [sprints] = useState(initialSprints);

  // ============================================================
  // ISSUE DRAWER
  // ============================================================

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // ============================================================
  // TIME TRACKING
  // ============================================================

  const [timeInput, setTimeInput] = useState("");
  const [loggedHours, setLoggedHours] = useState({});

  // ============================================================
  // COMMENTS
  // ============================================================

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

  // ============================================================
  // CALENDAR VALUES
  // ============================================================

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  // Convert Sunday=0 into Monday=0.
  const mondayOffset =
    firstDay === 0 ? 6 : firstDay - 1;

  const calendarCells = useMemo(() => {
    const cells = [];

    for (let i = 0; i < mondayOffset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        year,
        month,
        day
      );

      cells.push({
        day,
        dateKey: toDateKey(date),
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [
    year,
    month,
    totalDays,
    mondayOffset,
  ]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(
      new Date(2026, 7, 1)
    );
  };

  // ============================================================
  // ISSUE HELPERS
  // ============================================================

  const getIssuesForDate = (dateKey) => {
    return issues.filter(
      (issue) =>
        issue.dueDate === dateKey
    );
  };

  const getIssueSprint = (issue) => {
    if (!issue.sprint) {
      return "Backlog";
    }

    return issue.sprint;
  };

  // ============================================================
  // ISSUE UPDATE
  // ============================================================

  const handleUpdateIssue = (updatedIssue) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === updatedIssue.id
          ? updatedIssue
          : issue
      )
    );

    setSelectedIssue(null);

    toast.success(
      "Issue updated successfully"
    );
  };

  // ============================================================
  // DELETE ISSUE
  // ============================================================

  const handleDeleteIssue = (issueId) => {
    setIssues((prev) =>
      prev.filter(
        (issue) => issue.id !== issueId
      )
    );

    setSelectedIssue(null);

    toast.success(
      "Issue deleted successfully"
    );
  };

  // ============================================================
  // LOG WORK
  // ============================================================

  const handleLogWork = (e) => {
    e.preventDefault();

    const hours = Number(timeInput);

    if (!hours || hours <= 0) {
      toast.error(
        "Enter valid hours"
      );
      return;
    }

    if (!selectedIssue) return;

    setLoggedHours((prev) => ({
      ...prev,
      [selectedIssue.id]:
        (prev[selectedIssue.id] || 0) +
        hours,
    }));

    setTimeInput("");

    toast.success(
      `${hours}h logged successfully`
    );
  };

  // ============================================================
  // ADD COMMENT
  // ============================================================

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    if (!selectedIssue) return;

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      time: "Just now",
    };

    setComments((prev) => ({
      ...prev,
      [selectedIssue.id]: [
        ...(prev[selectedIssue.id] || []),
        newComment,
      ],
    }));

    setCommentText("");

    toast.success(
      "Comment added"
    );
  };

  // ============================================================
  // OPEN ISSUE
  // ============================================================

  const handleOpenIssue = (issue) => {
    setSelectedIssue({ ...issue });
    setActiveTab("details");
    setCommentText("");
  };

  // ============================================================
  // SPRINT HELPERS
  // ============================================================

  const getSprintIssues = (sprintId) => {
    return issues.filter(
      (issue) =>
        issue.sprint === sprintId
    );
  };

  const getSprintProgress = (sprintId) => {
    const sprintIssues =
      getSprintIssues(sprintId);

    const doneIssues =
      sprintIssues.filter(
        (issue) =>
          issue.status === "Done"
      ).length;

    return {
      total: sprintIssues.length,
      done: doneIssues,
    };
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <CalendarDays
              size={22}
              className="text-blue-600"
            />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Calendar
            </h1>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Sprint calendar, due dates and deadlines.
          </p>
        </div>

        {/* Month Navigation */}

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Previous month"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            Today
          </button>

          <div className="min-w-[150px] text-center px-3 py-2 bg-white border border-slate-200 rounded-lg">
            <span className="text-sm font-bold text-slate-800">
              {monthNames[month]} {year}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Next month"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {/* ======================================================
          CALENDAR
      ====================================================== */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Week Header */}

        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">

          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-bold text-slate-500 py-3 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}

        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">

          {calendarCells.map(
            (cell, index) => {

              if (!cell) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[125px] bg-slate-50/40"
                  />
                );
              }

              const dayIssues =
                getIssuesForDate(
                  cell.dateKey
                );

              const isToday =
                cell.dateKey ===
                "2026-08-08";

              return (
                <div
                  key={cell.dateKey}
                  className={`min-h-[125px] p-2.5 transition-colors hover:bg-slate-50 ${
                    isToday
                      ? "bg-blue-50/30"
                      : "bg-white"
                  }`}
                >

                  {/* Date */}

                  <div className="flex items-center justify-between mb-2">

                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center"
                          : "text-slate-500"
                      }`}
                    >
                      {cell.day}
                    </span>

                    {dayIssues.length >
                      0 && (
                      <span className="text-[9px] font-semibold text-slate-400">
                        {dayIssues.length}{" "}
                        {dayIssues.length ===
                        1
                          ? "issue"
                          : "issues"}
                      </span>
                    )}
                  </div>

                  {/* Issues */}

                  <div className="space-y-1.5">

                    {dayIssues.map(
                      (issue) => (
                        <button
                          key={issue.id}
                          type="button"
                          onClick={() =>
                            handleOpenIssue(
                              issue
                            )
                          }
                          className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-1.5 transition cursor-pointer"
                        >

                          <div className="flex items-center justify-between gap-1">

                            <span className="text-[9px] font-bold text-blue-700 truncate">
                              {issue.id}
                            </span>

                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                statusDotColors[
                                  issue.status
                                ] ||
                                "bg-slate-400"
                              }`}
                            />
                          </div>

                          <p className="text-[10px] font-semibold text-slate-700 truncate mt-0.5">
                            {issue.title}
                          </p>

                        </button>
                      )
                    )}

                  </div>
                </div>
              );
            }
          )}

        </div>
      </div>

      {/* ======================================================
          LEGEND
      ====================================================== */}

      <div className="bg-white rounded-xl border border-slate-200 p-4">

        <div className="flex flex-wrap items-center gap-4">

          <span className="text-xs font-bold text-slate-700">
            Status:
          </span>

          {Object.entries(
            statusDotColors
          ).map(([status, color]) => (
            <div
              key={status}
              className="flex items-center gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${color}`}
              />

              <span className="text-[11px] text-slate-500">
                {status}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* ======================================================
          SPRINT CALENDAR
      ====================================================== */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sprint Calendar
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Sprint timelines and issue progress.
            </p>
          </div>

          <CalendarDays
            size={19}
            className="text-slate-400"
          />
        </div>

        <div className="space-y-3">

          {sprints.map((sprint) => {

            const progress =
              getSprintProgress(
                sprint.id
              );

            const startKey =
              getSprintDateKey(
                sprint.startDate
              );

            const endKey =
              getSprintDateKey(
                sprint.endDate
              );

            return (
              <div
                key={sprint.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* Sprint Info */}

                  <div className="min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <h3 className="text-sm font-bold text-slate-900">
                        {sprint.id}
                      </h3>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          sprint.status ===
                          "Active"
                            ? "bg-blue-100 text-blue-700"
                            : sprint.status ===
                              "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {sprint.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      {sprint.goal}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">

                      <Clock3 size={13} />

                      <span>
                        {sprint.startDate}
                        {" → "}
                        {sprint.endDate}
                      </span>

                    </div>
                  </div>

                  {/* Progress */}

                  <div className="w-full md:w-52">

                    <div className="flex items-center justify-between mb-1.5">

                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        Progress
                      </span>

                      <span className="text-[10px] font-bold text-slate-600">
                        {progress.done}/
                        {progress.total}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{
                          width:
                            progress.total ===
                            0
                              ? "0%"
                              : `${
                                  (progress.done /
                                    progress.total) *
                                  100
                                }%`,
                        }}
                      />

                    </div>

                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                      <ListChecks
                        size={12}
                      />

                      {progress.total}{" "}
                      issues
                    </div>
                  </div>
                </div>

                {/* Timeline */}

                <div className="mt-4">

                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        sprint.status ===
                        "Completed"
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width:
                          sprint.status ===
                          "Completed"
                            ? "100%"
                            : "60%",
                      }}
                    />

                  </div>

                  <div className="flex justify-between mt-1.5 text-[10px] text-slate-400">
                    <span>
                      {startKey
                        ? formatDate(
                            startKey
                          )
                        : sprint.startDate}
                    </span>

                    <span>
                      {endKey
                        ? formatDate(
                            endKey
                          )
                        : sprint.endDate}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}

          {sprints.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No sprints available
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Create a sprint to see it here.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          DUE DATES / DEADLINES
      ====================================================== */}

      <div className="space-y-4">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Upcoming Deadlines
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Issues with upcoming due dates.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          {issues
            .filter(
              (issue) =>
                issue.dueDate
            )
            .sort(
              (a, b) =>
                new Date(
                  a.dueDate
                ) -
                new Date(
                  b.dueDate
                )
            )
            .slice(0, 8)
            .map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() =>
                  handleOpenIssue(
                    issue
                  )
                }
                className="w-full flex items-center justify-between gap-4 px-4 py-3 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition text-left"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <CalendarDays
                      size={15}
                      className="text-blue-600"
                    />
                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] font-bold text-blue-600">
                        {issue.id}
                      </span>

                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {issue.title}
                      </span>

                    </div>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {getIssueSprint(
                        issue
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">

                  <span
                    className={`hidden sm:inline-flex text-[10px] font-semibold px-2 py-1 rounded-full ${
                      statusColors[
                        issue.status
                      ] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {issue.status}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-500">
                    {formatDate(
                      issue.dueDate
                    )}
                  </span>

                </div>

              </button>
            ))}

          {issues.filter(
            (issue) =>
              issue.dueDate
          ).length === 0 && (
            <div className="p-8 text-center">

              <p className="text-sm font-semibold text-slate-700">
                No deadlines
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Issues with due dates will appear here.
              </p>

            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          ISSUE DRAWER
      ====================================================== */}

      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">

          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">

            {/* Drawer Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">

              <div className="flex items-center gap-2">

                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">
                  {selectedIssue.id}
                </span>

                <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-700 rounded">
                  {selectedIssue.type ||
                    "Issue"}
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedIssue(
                    null
                  )
                }
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* Drawer Content */}

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Title */}

              <div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {selectedIssue.title}
                </h2>

                <div className="flex items-center gap-2 flex-wrap">

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      statusColors[
                        selectedIssue.status
                      ] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selectedIssue.status}
                  </span>

                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                    {getIssueSprint(
                      selectedIssue
                    )}
                  </span>

                  {selectedIssue.priority && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded font-medium">
                      {selectedIssue.priority}
                    </span>
                  )}

                </div>
              </div>

              {/* Tabs */}

              <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "details"
                    )
                  }
                  className={`pb-2 border-b-2 ${
                    activeTab ===
                    "details"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500"
                  }`}
                >
                  Details
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "comments"
                    )
                  }
                  className={`pb-2 border-b-2 flex items-center gap-1.5 ${
                    activeTab ===
                    "comments"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500"
                  }`}
                >
                  <MessageSquare
                    size={15}
                  />

                  Comments (
                  {
                    (
                      comments[
                        selectedIssue.id
                      ] || []
                    ).length
                  }
                  )
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "activity"
                    )
                  }
                  className={`pb-2 border-b-2 flex items-center gap-1.5 ${
                    activeTab ===
                    "activity"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500"
                  }`}
                >
                  <Activity
                    size={15}
                  />

                  Activity
                </button>

              </div>

              {/* ==================================================
                  DETAILS
              ================================================== */}

              {activeTab ===
                "details" && (
                <div className="space-y-6">

                  {/* Description */}

                  <div>

                    <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                      Description
                    </h3>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-line">
                      {selectedIssue.description ||
                        "No description provided."}
                    </div>

                  </div>

                  {/* Info */}

                  <div className="grid grid-cols-2 gap-4">

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">

                      <span className="block text-slate-400 uppercase tracking-wider mb-1 text-[10px] font-semibold">
                        Story Points
                      </span>

                      <span className="text-lg font-bold text-slate-800">
                        {selectedIssue.storyPoints ??
                          0}
                      </span>

                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">

                      <span className="block text-slate-400 uppercase tracking-wider mb-1 text-[10px] font-semibold">
                        Due Date
                      </span>

                      <span className="text-sm font-bold text-slate-800">
                        {formatDate(
                          selectedIssue.dueDate
                        )}
                      </span>

                    </div>

                  </div>

                  {/* Time Tracking */}

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">

                    <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      Time Tracking
                    </h3>

                    <p className="text-sm text-slate-600">
                      {loggedHours[
                        selectedIssue.id
                      ] || 0}
                      h logged
                    </p>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">

                      <div
                        className="bg-blue-600 h-full transition-all"
                        style={{
                          width: `${Math.min(
                            ((loggedHours[
                              selectedIssue
                                .id
                            ] || 0) /
                              (selectedIssue.originalEstimate ||
                                12)) *
                              100,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    <form
                      onSubmit={
                        handleLogWork
                      }
                      className="flex gap-2 pt-2"
                    >

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={
                          timeInput
                        }
                        onChange={(e) =>
                          setTimeInput(
                            e.target.value
                          )
                        }
                        placeholder="Hours"
                        className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                      />

                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        Log work
                      </button>

                    </form>
                  </div>

                  {/* Status */}

                  <div>

                    <label className="font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 text-[10px]">
                      Status
                    </label>

                    <select
                      value={
                        selectedIssue.status
                      }
                      onChange={(e) =>
                        setSelectedIssue({
                          ...selectedIssue,
                          status:
                            e.target
                              .value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Backlog">
                        Backlog
                      </option>
                      <option value="To Do">
                        To Do
                      </option>
                      <option value="In Progress">
                        In Progress
                      </option>
                      <option value="Review">
                        Review
                      </option>
                      <option value="Testing">
                        Testing
                      </option>
                      <option value="Done">
                        Done
                      </option>
                    </select>

                  </div>

                  {/* Due Date */}

                  <div>

                    <label className="font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 text-[10px]">
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={
                        selectedIssue.dueDate ||
                        ""
                      }
                      onChange={(e) =>
                        setSelectedIssue({
                          ...selectedIssue,
                          dueDate:
                            e.target
                              .value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600"
                    />

                  </div>

                </div>
              )}

              {/* ==================================================
                  COMMENTS
              ================================================== */}

              {activeTab ===
                "comments" && (
                <div className="space-y-4">

                  <div className="space-y-3">

                    {(
                      comments[
                        selectedIssue.id
                      ] || []
                    ).map(
                      (comment) => (
                        <div
                          key={
                            comment.id
                          }
                          className="bg-slate-50 p-3 rounded-lg border border-slate-200"
                        >

                          <div className="flex justify-between text-slate-400 mb-1">

                            <span className="font-semibold text-slate-700">
                              Ayesha Khan
                            </span>

                            <span>
                              {
                                comment.time
                              }
                            </span>

                          </div>

                          <p className="text-slate-600 text-sm">
                            {
                              comment.text
                            }
                          </p>

                        </div>
                      )
                    )}

                    {(
                      comments[
                        selectedIssue.id
                      ] || []
                    ).length === 0 && (
                      <p className="text-slate-400 text-center py-8 text-sm">
                        No comments yet.
                      </p>
                    )}

                  </div>

                  <form
                    onSubmit={
                      handleAddComment
                    }
                    className="flex gap-2"
                  >

                    <input
                      type="text"
                      value={
                        commentText
                      }
                      onChange={(e) =>
                        setCommentText(
                          e.target
                            .value
                        )
                      }
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                    />

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Send
                        size={14}
                      />

                      Send
                    </button>

                  </form>

                </div>
              )}

              {/* ==================================================
                  ACTIVITY
              ================================================== */}

              {activeTab ===
                "activity" && (
                <div className="space-y-3">

                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">

                    <Activity
                      size={16}
                      className="text-blue-600 mt-0.5"
                    />

                    <div>

                      <p className="text-xs font-semibold text-slate-700">
                        Issue viewed from Calendar
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Just now
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">

                    <CalendarDays
                      size={16}
                      className="text-blue-600 mt-0.5"
                    />

                    <div>

                      <p className="text-xs font-semibold text-slate-700">
                        Due date:
                        {" "}
                        {formatDate(
                          selectedIssue.dueDate
                        )}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Calendar deadline
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Drawer Footer */}

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">

              <button
                type="button"
                onClick={() =>
                  handleDeleteIssue(
                    selectedIssue.id
                  )
                }
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 size={15} />
                Delete issue
              </button>

              <button
                type="button"
                onClick={() =>
                  handleUpdateIssue(
                    selectedIssue
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition"
              >
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}