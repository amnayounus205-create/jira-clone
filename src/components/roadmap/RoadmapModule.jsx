import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Circle,
  Flag,
  Layers3,
  Milestone,
  Package,
  Plus,
  Rocket,
  Search,
  Target,
  X,
} from "lucide-react";

const initialEpics = [
  {
    id: "EPIC-1",
    name: "User Experience",
    description: "Improve onboarding and overall product experience.",
    owner: "Ayesha Khan",
    color: "blue",
    startDate: "2026-08-01",
    endDate: "2026-09-15",
    status: "In Progress",
    progress: 68,
  },
  {
    id: "EPIC-2",
    name: "Payments",
    description: "Modernize billing, subscriptions and payment flows.",
    owner: "Daniel Ross",
    color: "emerald",
    startDate: "2026-08-10",
    endDate: "2026-10-05",
    status: "In Progress",
    progress: 42,
  },
  {
    id: "EPIC-3",
    name: "Authentication",
    description: "Improve authentication, security and account access.",
    owner: "Mei Lin",
    color: "purple",
    startDate: "2026-08-15",
    endDate: "2026-09-20",
    status: "Planned",
    progress: 25,
  },
  {
    id: "EPIC-4",
    name: "Checkout",
    description: "Improve checkout reliability and conversion.",
    owner: "Omar Farouk",
    color: "amber",
    startDate: "2026-09-01",
    endDate: "2026-10-20",
    status: "Planned",
    progress: 15,
  },
  {
    id: "EPIC-5",
    name: "Performance",
    description: "Improve application performance and loading times.",
    owner: "Daniel Noor",
    color: "rose",
    startDate: "2026-08-20",
    endDate: "2026-09-30",
    status: "In Progress",
    progress: 55,
  },
];

const initialStories = [
  {
    id: "ATL-1",
    title: "Onboarding Experience",
    epic: "EPIC-1",
    status: "To Do",
    assignee: "AK",
    startDate: "2026-08-04",
    dueDate: "2026-08-11",
    points: 5,
  },
  {
    id: "ATL-102",
    title: "Create onboarding checklist",
    epic: "EPIC-1",
    status: "In Progress",
    assignee: "AK",
    startDate: "2026-08-08",
    dueDate: "2026-08-16",
    points: 5,
  },
  {
    id: "ATL-2",
    title: "Billing & Payments",
    epic: "EPIC-2",
    status: "In Progress",
    assignee: "DR",
    startDate: "2026-08-08",
    dueDate: "2026-08-12",
    points: 8,
  },
  {
    id: "ATL-100",
    title: "Implement OAuth sign-in",
    epic: "EPIC-3",
    status: "To Do",
    assignee: "ML",
    startDate: "2026-08-12",
    dueDate: "2026-08-14",
    points: 5,
  },
  {
    id: "ATL-101",
    title: "Fix cart total rounding",
    epic: "EPIC-4",
    status: "To Do",
    assignee: "OF",
    startDate: "2026-08-13",
    dueDate: "2026-08-20",
    points: 3,
  },
  {
    id: "ATL-104",
    title: "Improve dashboard load time",
    epic: "EPIC-5",
    status: "Done",
    assignee: "DN",
    startDate: "2026-08-15",
    dueDate: "2026-08-20",
    points: 5,
  },
  {
    id: "ATL-105",
    title: "Write E2E tests for checkout",
    epic: "EPIC-4",
    status: "Backlog",
    assignee: "JW",
    startDate: "2026-08-18",
    dueDate: "2026-08-25",
    points: 8,
  },
  {
    id: "ATL-106",
    title: "Add release notes editor",
    epic: "EPIC-5",
    status: "Review",
    assignee: "OF",
    startDate: "2026-08-20",
    dueDate: "2026-08-29",
    points: 5,
  },
];

const initialReleases = [
  {
    id: "REL-1",
    name: "Version 2.5",
    version: "v2.5",
    date: "2026-08-23",
    status: "Released",
    description: "Billing improvements and UX fixes.",
  },
  {
    id: "REL-2",
    name: "Version 2.6",
    version: "v2.6",
    date: "2026-09-20",
    status: "Planned",
    description: "Authentication and onboarding improvements.",
  },
  {
    id: "REL-3",
    name: "Version 3.0",
    version: "v3.0",
    date: "2026-10-25",
    status: "Planned",
    description: "Major checkout and performance release.",
  },
];

const initialMilestones = [
  {
    id: "M-1",
    name: "Onboarding Beta",
    date: "2026-08-16",
    status: "In Progress",
    description: "Complete the first onboarding experience.",
  },
  {
    id: "M-2",
    name: "Billing Launch",
    date: "2026-08-30",
    status: "Planned",
    description: "Launch the updated billing experience.",
  },
  {
    id: "M-3",
    name: "Authentication Release",
    date: "2026-09-20",
    status: "Planned",
    description: "Complete OAuth and authentication hardening.",
  },
  {
    id: "M-4",
    name: "Checkout 2.0",
    date: "2026-10-20",
    status: "Planned",
    description: "Deliver the improved checkout experience.",
  },
];

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
  if (!value) return "Not set";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "Done":
    case "Released":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "Review":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";

    case "Planned":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "To Do":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "Backlog":
      return "bg-slate-100 text-slate-500 border-slate-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getEpicColor = (color) => {
  switch (color) {
    case "emerald":
      return "bg-emerald-500";

    case "purple":
      return "bg-purple-500";

    case "amber":
      return "bg-amber-500";

    case "rose":
      return "bg-rose-500";

    default:
      return "bg-blue-500";
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RoadmapModule() {
  const [epics, setEpics] = useState(initialEpics);
  const [stories, setStories] = useState(initialStories);
  const [releases, setReleases] = useState(initialReleases);
  const [milestones, setMilestones] = useState(initialMilestones);

  const [activeView, setActiveView] = useState("Timeline");
  const [searchText, setSearchText] = useState("");

  const [expandedEpics, setExpandedEpics] = useState(
    initialEpics.reduce((acc, epic) => {
      acc[epic.id] = true;
      return acc;
    }, {})
  );

  const [selectedEpic, setSelectedEpic] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createType, setCreateType] = useState("Epic");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    date: "",
    status: "Planned",
    owner: "",
    version: "",
  });

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredEpics = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return epics;

    return epics.filter((epic) => {
      const storiesOfEpic = stories.filter(
        (story) => story.epic === epic.id
      );

      return (
        epic.name.toLowerCase().includes(query) ||
        epic.id.toLowerCase().includes(query) ||
        epic.owner.toLowerCase().includes(query) ||
        storiesOfEpic.some(
          (story) =>
            story.title.toLowerCase().includes(query) ||
            story.id.toLowerCase().includes(query)
        )
      );
    });
  }, [epics, stories, searchText]);

  // ==========================================================
  // EPIC TOGGLE
  // ==========================================================

  const toggleEpic = (epicId) => {
    setExpandedEpics((prev) => ({
      ...prev,
      [epicId]: !prev[epicId],
    }));
  };

  // ==========================================================
  // CREATE ITEM
  // ==========================================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      date: "",
      status: "Planned",
      owner: "",
      version: "",
    });
  };

  const openCreateModal = (type) => {
    setCreateType(type);
    resetForm();
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleCreate = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (createType === "Epic") {
      const newEpic = {
        id: `EPIC-${epics.length + 1}`,
        name: formData.name.trim(),
        description:
          formData.description.trim() ||
          "New roadmap epic.",
        owner: formData.owner.trim() || "Unassigned",
        color: "blue",
        startDate:
          formData.startDate || "2026-08-01",
        endDate:
          formData.endDate || "2026-09-30",
        status: formData.status,
        progress: 0,
      };

      setEpics((prev) => [newEpic, ...prev]);
    }

    if (createType === "Release") {
      const newRelease = {
        id: `REL-${releases.length + 1}`,
        name: formData.name.trim(),
        version:
          formData.version.trim() || "v1.0",
        date:
          formData.date || "2026-09-30",
        status: formData.status,
        description:
          formData.description.trim() ||
          "New product release.",
      };

      setReleases((prev) => [
        newRelease,
        ...prev,
      ]);
    }

    if (createType === "Milestone") {
      const newMilestone = {
        id: `M-${milestones.length + 1}`,
        name: formData.name.trim(),
        date:
          formData.date || "2026-09-30",
        status: formData.status,
        description:
          formData.description.trim() ||
          "New roadmap milestone.",
      };

      setMilestones((prev) => [
        newMilestone,
        ...prev,
      ]);
    }

    closeCreateModal();
  };

  // ==========================================================
  // UPDATE EPIC
  // ==========================================================

  const handleEpicStatusChange = (
    epicId,
    status
  ) => {
    setEpics((prev) =>
      prev.map((epic) =>
        epic.id === epicId
          ? {
              ...epic,
              status,
            }
          : epic
      )
    );

    setSelectedEpic((prev) =>
      prev
        ? {
            ...prev,
            status,
          }
        : prev
    );
  };

  // ==========================================================
  // DELETE EPIC
  // ==========================================================

  const deleteEpic = (epicId) => {
    setEpics((prev) =>
      prev.filter((epic) => epic.id !== epicId)
    );

    setStories((prev) =>
      prev.filter((story) => story.epic !== epicId)
    );

    setSelectedEpic(null);
  };

  // ==========================================================
  // DELETE STORY
  // ==========================================================

  const deleteStory = (storyId) => {
    setStories((prev) =>
      prev.filter((story) => story.id !== storyId)
    );

    setSelectedStory(null);
  };

  // ==========================================================
  // DELETE RELEASE
  // ==========================================================

  const deleteRelease = (releaseId) => {
    setReleases((prev) =>
      prev.filter(
        (release) => release.id !== releaseId
      )
    );

    setSelectedRelease(null);
  };

  // ==========================================================
  // DELETE MILESTONE
  // ==========================================================

  const deleteMilestone = (milestoneId) => {
    setMilestones((prev) =>
      prev.filter(
        (milestone) =>
          milestone.id !== milestoneId
      )
    );

    setSelectedMilestone(null);
  };

  // ==========================================================
  // SUMMARY COUNTS
  // ==========================================================

  const totalStories = stories.length;

  const completedStories = stories.filter(
    (story) => story.status === "Done"
  ).length;

  const plannedReleases = releases.filter(
    (release) => release.status === "Planned"
  ).length;

  // ==========================================================
  // TIMELINE
  // ==========================================================

  const timelineStart = new Date(
    "2026-08-01T00:00:00"
  );

  const timelineEnd = new Date(
    "2026-10-31T00:00:00"
  );

  const timelineDays =
    Math.ceil(
      (timelineEnd - timelineStart) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const getTimelinePosition = (
    start,
    end
  ) => {
    const startDate = new Date(
      `${start}T00:00:00`
    );

    const endDate = new Date(
      `${end}T00:00:00`
    );

    const startOffset = Math.max(
      0,
      Math.floor(
        (startDate - timelineStart) /
          (1000 * 60 * 60 * 24)
      )
    );

    const endOffset = Math.min(
      timelineDays,
      Math.ceil(
        (endDate - timelineStart) /
          (1000 * 60 * 60 * 24)
      )
    );

    const left =
      (startOffset / timelineDays) * 100;

    const width =
      Math.max(
        4,
        ((endOffset - startOffset) /
          timelineDays) *
          100
      );

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  const monthLabels = [
    {
      label: "August 2026",
      left: "0%",
    },
    {
      label: "September 2026",
      left: "33.7%",
    },
    {
      label: "October 2026",
      left: "66.3%",
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-5 pb-10">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers3 size={19} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Roadmap
            </h1>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Plan epics, stories, releases and
            milestones across your product timeline.
          </p>
        </div>

        <button
          onClick={() =>
            openCreateModal("Epic")
          }
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition"
        >
          <Plus size={17} />
          Add roadmap item
        </button>
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Epics
            </span>
            <Layers3
              size={17}
              className="text-blue-500"
            />
          </div>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {epics.length}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Product initiatives
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Stories
            </span>
            <Circle
              size={17}
              className="text-purple-500"
            />
          </div>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {totalStories}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            {completedStories} completed
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Releases
            </span>
            <Rocket
              size={17}
              className="text-emerald-500"
            />
          </div>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {releases.length}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            {plannedReleases} planned
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Milestones
            </span>
            <Flag
              size={17}
              className="text-amber-500"
            />
          </div>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {milestones.length}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Key delivery points
          </p>
        </div>
      </div>

      {/* ======================================================
          NAVIGATION + SEARCH
      ====================================================== */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              "Timeline",
              "Epics",
              "Stories",
              "Releases",
              "Milestones",
            ].map((view) => (
              <button
                key={view}
                onClick={() =>
                  setActiveView(view)
                }
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeView === view
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              placeholder="Search roadmap..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          TIMELINE
      ====================================================== */}

      {activeView === "Timeline" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Product timeline
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  August — October 2026
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Epic
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2" />
                Release
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-2" />
                Milestone
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Timeline header */}

                <div className="relative h-14 border-b border-slate-200 bg-slate-50">
                  <div className="absolute inset-0">
                    {monthLabels.map(
                      (monthItem) => (
                        <div
                          key={monthItem.label}
                          className="absolute top-0 bottom-0 border-l border-slate-200 px-3 pt-3"
                          style={{
                            left:
                              monthItem.left,
                          }}
                        >
                          <span className="text-xs font-bold text-slate-500">
                            {monthItem.label}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Epic timeline */}

                <div className="divide-y divide-slate-100">
                  {filteredEpics.map(
                    (epic) => {
                      const position =
                        getTimelinePosition(
                          epic.startDate,
                          epic.endDate
                        );

                      return (
                        <div
                          key={epic.id}
                          className="grid grid-cols-[240px_1fr] min-h-[92px]"
                        >
                          <div
                            className="p-4 border-r border-slate-100 cursor-pointer hover:bg-slate-50"
                            onClick={() =>
                              setSelectedEpic(
                                epic
                              )
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${getEpicColor(
                                  epic.color
                                )}`}
                              />

                              <span className="text-sm font-bold text-slate-800">
                                {epic.name}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 mt-1">
                              {epic.id} ·{" "}
                              {epic.progress}% complete
                            </p>
                          </div>

                          <div className="relative">
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(to right, transparent 0, transparent calc(33.33% - 1px), #f1f5f9 calc(33.33% - 1px), #f1f5f9 33.33%)",
                              }}
                            />

                            <div
                              onClick={() =>
                                setSelectedEpic(
                                  epic
                                )
                              }
                              className={`absolute top-1/2 -translate-y-1/2 h-11 rounded-lg cursor-pointer shadow-sm border border-white/50 ${getEpicColor(
                                epic.color
                              )}`}
                              style={{
                                left:
                                  position.left,
                                width:
                                  position.width,
                              }}
                            >
                              <div className="h-full px-3 flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white truncate">
                                  {epic.name}
                                </span>

                                <span className="text-[10px] text-white/80 font-semibold">
                                  {epic.progress}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* Releases */}

                  {releases.map(
                    (release) => {
                      const position =
                        getTimelinePosition(
                          release.date,
                          release.date
                        );

                      return (
                        <div
                          key={release.id}
                          className="grid grid-cols-[240px_1fr] min-h-[64px]"
                        >
                          <div className="p-4 border-r border-slate-100">
                            <div className="flex items-center gap-2">
                              <Rocket
                                size={14}
                                className="text-emerald-500"
                              />

                              <span className="text-xs font-bold text-slate-700">
                                {release.name}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-1">
                              {release.version}
                            </p>
                          </div>

                          <div className="relative">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-md cursor-pointer"
                              style={{
                                left:
                                  position.left,
                              }}
                              onClick={() =>
                                setSelectedRelease(
                                  release
                                )
                              }
                            />

                            <div
                              className="absolute top-[calc(50%+10px)] -translate-y-1/2 text-[10px] font-semibold text-emerald-700 cursor-pointer whitespace-nowrap"
                              style={{
                                left:
                                  position.left,
                              }}
                              onClick={() =>
                                setSelectedRelease(
                                  release
                                )
                              }
                            >
                              {formatDate(
                                release.date
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* Milestones */}

                  {milestones.map(
                    (milestone) => {
                      const position =
                        getTimelinePosition(
                          milestone.date,
                          milestone.date
                        );

                      return (
                        <div
                          key={milestone.id}
                          className="grid grid-cols-[240px_1fr] min-h-[64px]"
                        >
                          <div className="p-4 border-r border-slate-100">
                            <div className="flex items-center gap-2">
                              <Milestone
                                size={14}
                                className="text-amber-500"
                              />

                              <span className="text-xs font-bold text-slate-700">
                                {milestone.name}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-1">
                              {formatDate(
                                milestone.date
                              )}
                            </p>
                          </div>

                          <div className="relative">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-amber-500 border border-white shadow cursor-pointer"
                              style={{
                                left:
                                  position.left,
                              }}
                              onClick={() =>
                                setSelectedMilestone(
                                  milestone
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          EPICS
      ====================================================== */}

      {activeView === "Epics" && (
        <div className="space-y-3">
          {filteredEpics.map(
            (epic) => {
              const epicStories =
                stories.filter(
                  (story) =>
                    story.epic === epic.id
                );

              const isExpanded =
                expandedEpics[epic.id];

              return (
                <div
                  key={epic.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() =>
                          toggleEpic(
                            epic.id
                          )
                        }
                        className="mt-0.5 p-1 rounded hover:bg-slate-100 text-slate-400"
                      >
                        {isExpanded ? (
                          <ChevronDown
                            size={17}
                          />
                        ) : (
                          <ChevronRight
                            size={17}
                          />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${getEpicColor(
                              epic.color
                            )}`}
                          />

                          <h3
                            onClick={() =>
                              setSelectedEpic(
                                epic
                              )
                            }
                            className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600"
                          >
                            {epic.name}
                          </h3>

                          <span className="text-[10px] font-semibold text-slate-400">
                            {epic.id}
                          </span>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusClass(
                              epic.status
                            )}`}
                          >
                            {epic.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5">
                          {epic.description}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                          <span>
                            Owner:{" "}
                            <strong className="text-slate-600">
                              {epic.owner}
                            </strong>
                          </span>

                          <span>
                            {formatDate(
                              epic.startDate
                            )}{" "}
                            →{" "}
                            {formatDate(
                              epic.endDate
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-48">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Progress
                        </span>

                        <span className="text-xs font-bold text-slate-700">
                          {epic.progress}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${getEpicColor(
                            epic.color
                          )} rounded-full`}
                          style={{
                            width: `${epic.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                      {epicStories.length ===
                      0 ? (
                        <div className="px-12 py-6 text-xs text-slate-400">
                          No stories assigned
                          to this epic.
                        </div>
                      ) : (
                        epicStories.map(
                          (story) => (
                            <div
                              key={story.id}
                              onClick={() =>
                                setSelectedStory(
                                  story
                                )
                              }
                              className="px-12 py-3 border-b last:border-b-0 border-slate-100 flex items-center justify-between gap-4 hover:bg-white cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Circle
                                  size={11}
                                  className={
                                    story.status ===
                                    "Done"
                                      ? "text-emerald-500 fill-emerald-500"
                                      : "text-slate-300"
                                  }
                                />

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-blue-600">
                                      {story.id}
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700 truncate">
                                      {story.title}
                                    </span>
                                  </div>

                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    {formatDate(
                                      story.startDate
                                    )}{" "}
                                    →{" "}
                                    {formatDate(
                                      story.dueDate
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span
                                  className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${getStatusClass(
                                    story.status
                                  )}`}
                                >
                                  {story.status}
                                </span>

                                <span className="w-7 h-7 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center">
                                  {story.assignee}
                                </span>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}

          {filteredEpics.length ===
            0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No epics found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try another search.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================
          STORIES
      ====================================================== */}

      {activeView === "Stories" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">
              Roadmap stories
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Stories connected to product
              epics.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {stories
              .filter((story) => {
                if (!searchText.trim())
                  return true;

                const q =
                  searchText
                    .toLowerCase();

                return (
                  story.id
                    .toLowerCase()
                    .includes(q) ||
                  story.title
                    .toLowerCase()
                    .includes(q)
                );
              })
              .map((story) => {
                const epic =
                  epics.find(
                    (item) =>
                      item.id ===
                      story.epic
                  );

                return (
                  <div
                    key={story.id}
                    onClick={() =>
                      setSelectedStory(
                        story
                      )
                    }
                    className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Circle
                          size={14}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-blue-600">
                            {story.id}
                          </span>

                          <h3 className="text-sm font-bold text-slate-800">
                            {story.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span>
                            Epic:{" "}
                            <strong className="text-slate-600">
                              {epic?.name ||
                                "Unassigned"}
                            </strong>
                          </span>

                          <span>
                            {story.points} SP
                          </span>

                          <span>
                            Due{" "}
                            {formatDate(
                              story.dueDate
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${getStatusClass(
                          story.status
                        )}`}
                      >
                        {story.status}
                      </span>

                      <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold">
                        {story.assignee}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================
          RELEASES
      ====================================================== */}

      {activeView === "Releases" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() =>
                openCreateModal(
                  "Release"
                )
              }
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Plus size={15} />
              Add release
            </button>
          </div>

          {releases.map(
            (release) => (
              <div
                key={release.id}
                onClick={() =>
                  setSelectedRelease(
                    release
                  )
                }
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 cursor-pointer transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Package
                        size={19}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">
                          {release.name}
                        </h3>

                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {release.version}
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusClass(
                            release.status
                          )}`}
                        >
                          {release.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {release.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      Release date
                    </p>

                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {formatDate(
                        release.date
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ======================================================
          MILESTONES
      ====================================================== */}

      {activeView === "Milestones" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() =>
                openCreateModal(
                  "Milestone"
                )
              }
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Plus size={15} />
              Add milestone
            </button>
          </div>

          {milestones.map(
            (milestone) => (
              <div
                key={milestone.id}
                onClick={() =>
                  setSelectedMilestone(
                    milestone
                  )
                }
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 cursor-pointer transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Target
                        size={19}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {milestone.name}
                        </h3>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusClass(
                            milestone.status
                          )}`}
                        >
                          {milestone.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      Target date
                    </p>

                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {formatDate(
                        milestone.date
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ======================================================
          EPIC DETAIL MODAL
      ====================================================== */}

      {selectedEpic && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-600">
                  {selectedEpic.id}
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  {selectedEpic.name}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedEpic(null)
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-600">
                {selectedEpic.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    Owner
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedEpic.owner}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    Progress
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedEpic.progress}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Start date
                  </label>

                  <input
                    type="date"
                    value={
                      selectedEpic.startDate
                    }
                    onChange={(e) =>
                      setSelectedEpic(
                        {
                          ...selectedEpic,
                          startDate:
                            e.target.value,
                        }
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    End date
                  </label>

                  <input
                    type="date"
                    value={
                      selectedEpic.endDate
                    }
                    onChange={(e) =>
                      setSelectedEpic(
                        {
                          ...selectedEpic,
                          endDate:
                            e.target.value,
                        }
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  Status
                </label>

                <select
                  value={
                    selectedEpic.status
                  }
                  onChange={(e) =>
                    handleEpicStatusChange(
                      selectedEpic.id,
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option>
                    Planned
                  </option>
                  <option>
                    In Progress
                  </option>
                  <option>
                    Completed
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() =>
                    deleteEpic(
                      selectedEpic.id
                    )
                  }
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setEpics((prev) =>
                      prev.map((epic) =>
                        epic.id ===
                        selectedEpic.id
                          ? selectedEpic
                          : epic
                      )
                    );

                    setSelectedEpic(
                      null
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          STORY DETAIL MODAL
      ====================================================== */}

      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-600">
                  {selectedStory.id}
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  {selectedStory.title}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedStory(null)
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    Epic
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {
                      epics.find(
                        (epic) =>
                          epic.id ===
                          selectedStory.epic
                      )?.name
                    }
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    Story points
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedStory.points}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  Status
                </label>

                <select
                  value={
                    selectedStory.status
                  }
                  onChange={(e) =>
                    setSelectedStory(
                      {
                        ...selectedStory,
                        status:
                          e.target.value,
                      }
                    )
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option>
                    Backlog
                  </option>
                  <option>
                    To Do
                  </option>
                  <option>
                    In Progress
                  </option>
                  <option>
                    Review
                  </option>
                  <option>
                    Done
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Start date
                  </label>

                  <input
                    type="date"
                    value={
                      selectedStory.startDate
                    }
                    onChange={(e) =>
                      setSelectedStory(
                        {
                          ...selectedStory,
                          startDate:
                            e.target.value,
                        }
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Due date
                  </label>

                  <input
                    type="date"
                    value={
                      selectedStory.dueDate
                    }
                    onChange={(e) =>
                      setSelectedStory(
                        {
                          ...selectedStory,
                          dueDate:
                            e.target.value,
                        }
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() =>
                    deleteStory(
                      selectedStory.id
                    )
                  }
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setStories((prev) =>
                      prev.map((story) =>
                        story.id ===
                        selectedStory.id
                          ? selectedStory
                          : story
                      )
                    );

                    setSelectedStory(
                      null
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          RELEASE DETAIL
      ====================================================== */}

      {selectedRelease && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-emerald-600">
                  {selectedRelease.version}
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  {selectedRelease.name}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedRelease(
                    null
                  )
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                {selectedRelease.description}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Release date
                </p>

                <p className="text-sm font-bold text-slate-800 mt-1">
                  {formatDate(
                    selectedRelease.date
                  )}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() =>
                    deleteRelease(
                      selectedRelease.id
                    )
                  }
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    setSelectedRelease(
                      null
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MILESTONE DETAIL
      ====================================================== */}

      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-amber-600">
                  {selectedMilestone.id}
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  {selectedMilestone.name}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedMilestone(
                    null
                  )
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                {
                  selectedMilestone.description
                }
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Target date
                </p>

                <p className="text-sm font-bold text-slate-800 mt-1">
                  {formatDate(
                    selectedMilestone.date
                  )}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() =>
                    deleteMilestone(
                      selectedMilestone.id
                    )
                  }
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    setSelectedMilestone(
                      null
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          CREATE MODAL
      ====================================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add {createType}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Add a new item to your roadmap.
                </p>
              </div>

              <button
                onClick={closeCreateModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  Name
                </label>

                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder={`Enter ${createType.toLowerCase()} name`}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              {createType ===
                "Epic" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                      Owner
                    </label>

                    <input
                      value={
                        formData.owner
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          owner:
                            e.target
                              .value,
                        })
                      }
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                        Start date
                      </label>

                      <input
                        type="date"
                        value={
                          formData.startDate
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate:
                              e.target
                                .value,
                          })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                        End date
                      </label>

                      <input
                        type="date"
                        value={
                          formData.endDate
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            endDate:
                              e.target
                                .value,
                          })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {(createType ===
                "Release" ||
                createType ===
                  "Milestone") && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Date
                  </label>

                  <input
                    type="date"
                    value={
                      formData.date
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              )}

              {createType ===
                "Release" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Version
                  </label>

                  <input
                    value={
                      formData.version
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        version:
                          e.target.value,
                      })
                    }
                    placeholder="e.g. v2.7"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  Status
                </label>

                <select
                  value={
                    formData.status
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status:
                        e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option>
                    Planned
                  </option>
                  <option>
                    In Progress
                  </option>
                  <option>
                    Done
                  </option>
                  <option>
                    Released
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Describe this roadmap item..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Create {createType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}