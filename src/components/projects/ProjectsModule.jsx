import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Clock3,
  Timer,
  X,
  Save,
  History,
} from "lucide-react";
import toast from "react-hot-toast";

import ProjectTable from "./ProjectTable";
import ProjectModal from "./ProjectModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import SearchInput from "../ui/SearchInput";

import { projectData } from "./projectData";

const TIME_STORAGE_KEY = "jira_project_time_tracking";

const ProjectsModule = () => {
  const [projects, setProjects] = useState(projectData);

  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ============================================================
  // TIME TRACKING
  // ============================================================

  const [timeTracking, setTimeTracking] = useState({});
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [timeProject, setTimeProject] = useState(null);

  const [estimateInput, setEstimateInput] = useState("");
  const [timeSpentInput, setTimeSpentInput] = useState("");
  const [workDescription, setWorkDescription] = useState("");

  const [workHistory, setWorkHistory] = useState([]);

  const perPage = 5;

  // ============================================================
  // LOAD TIME TRACKING
  // ============================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TIME_STORAGE_KEY);

      if (saved) {
        setTimeTracking(JSON.parse(saved));
      }
    } catch {
      setTimeTracking({});
    }
  }, []);

  // ============================================================
  // SAVE TIME TRACKING
  // ============================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        TIME_STORAGE_KEY,
        JSON.stringify(timeTracking)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [timeTracking]);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.key
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        status === "All" ||
        project.status === status;

      return matchSearch && matchStatus;
    });
  }, [projects, search, status]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(
    filteredProjects.length / perPage
  );

  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // ============================================================
  // CREATE PROJECT
  // ============================================================

  const handleCreate = () => {
    setSelectedProject(null);
    setOpen(true);
  };

  // ============================================================
  // EDIT PROJECT
  // ============================================================

  const handleEdit = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  // ============================================================
  // DELETE PROJECT
  // ============================================================

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setProjects((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );

    setTimeTracking((prev) => {
      const updated = { ...prev };
      delete updated[deleteId];
      return updated;
    });

    toast.success("Project Deleted Successfully");

    setDeleteOpen(false);
    setDeleteId(null);
  };

  // ============================================================
  // CREATE / UPDATE PROJECT
  // ============================================================

  const handleSubmit = (data) => {
    if (selectedProject) {
      setProjects((prev) =>
        prev.map((item) =>
          item.id === selectedProject.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );

      toast.success("Project Updated");
    } else {
      const newProject = {
        id: Date.now(),
        ...data,
        members: 0,
        tasks: 0,
        progress: 0,
      };

      setProjects((prev) => [
        ...prev,
        newProject,
      ]);

      toast.success("Project Created");
    }

    setOpen(false);
  };

  // ============================================================
  // OPEN TIME TRACKING
  // ============================================================

  const openTimeTracking = (project = null) => {
    const selected =
      project ||
      projects[0];

    if (!selected) {
      toast.error("Create a project first");
      return;
    }

    const existing =
      timeTracking[selected.id] || {
        estimate: 40,
        spent: 0,
        history: [],
      };

    setTimeProject(selected);

    setEstimateInput(
      String(existing.estimate || 40)
    );

    setTimeSpentInput("");

    setWorkDescription("");

    setWorkHistory(
      existing.history || []
    );

    setTimeModalOpen(true);
  };

  // ============================================================
  // CLOSE TIME TRACKING
  // ============================================================

  const closeTimeTracking = () => {
    setTimeModalOpen(false);
    setTimeProject(null);
    setEstimateInput("");
    setTimeSpentInput("");
    setWorkDescription("");
    setWorkHistory([]);
  };

  // ============================================================
  // SAVE ESTIMATE
  // ============================================================

  const saveEstimate = () => {
    if (!timeProject) return;

    const estimate = Number(estimateInput);

    if (!estimate || estimate <= 0) {
      toast.error("Enter a valid estimate");
      return;
    }

    setTimeTracking((prev) => {
      const existing =
        prev[timeProject.id] || {
          estimate: 0,
          spent: 0,
          history: [],
        };

      return {
        ...prev,
        [timeProject.id]: {
          ...existing,
          estimate,
        },
      };
    });

    toast.success("Estimate updated");
  };

  // ============================================================
  // LOG WORK
  // ============================================================

  const handleLogWork = (e) => {
    e.preventDefault();

    if (!timeProject) return;

    const hours = Number(timeSpentInput);

    if (!hours || hours <= 0) {
      toast.error("Enter valid hours");
      return;
    }

    const existing =
      timeTracking[timeProject.id] || {
        estimate: Number(estimateInput) || 40,
        spent: 0,
        history: [],
      };

    const newEntry = {
      id: Date.now(),
      hours,
      description:
        workDescription.trim() ||
        "Work logged",
      date: new Date().toISOString(),
    };

    const updatedSpent =
      Number(existing.spent || 0) + hours;

    const updatedHistory = [
      newEntry,
      ...(existing.history || []),
    ];

    setTimeTracking((prev) => ({
      ...prev,
      [timeProject.id]: {
        ...existing,
        estimate:
          Number(estimateInput) ||
          existing.estimate ||
          40,
        spent: updatedSpent,
        history: updatedHistory,
      },
    }));

    setWorkHistory(updatedHistory);
    setTimeSpentInput("");
    setWorkDescription("");

    toast.success(`${hours}h logged successfully`);
  };

  // ============================================================
  // TIME CALCULATIONS
  // ============================================================

  const currentTimeData =
    timeProject
      ? timeTracking[timeProject.id] || {
          estimate:
            Number(estimateInput) || 40,
          spent: 0,
          history: [],
        }
      : {
          estimate: 0,
          spent: 0,
          history: [],
        };

  const estimate =
    Number(currentTimeData.estimate) || 0;

  const spent =
    Number(currentTimeData.spent) || 0;

  const remaining = Math.max(
    estimate - spent,
    0
  );

  const progress =
    estimate > 0
      ? Math.min(
          (spent / estimate) * 100,
          100
        )
      : 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-[#172B4D]">
            Projects
          </h1>

          <p className="text-gray-500">
            Manage projects and track team work.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => openTimeTracking()}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <Clock3 size={18} />
            Time Tracking
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="bg-[#0052CC] hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Create Project
          </button>

        </div>
      </div>

      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div className="w-full md:w-80">

          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-3 outline-none bg-white"
        >
          <option>All</option>
          <option>Planning</option>
          <option>Active</option>
          <option>Completed</option>
        </select>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <ProjectTable
        projects={displayedProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2">

          {[...Array(totalPages)].map(
            (_, index) => (

              <button
                key={index}
                type="button"
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                className={`w-10 h-10 rounded-lg transition ${
                  currentPage === index + 1
                    ? "bg-[#0052CC] text-white"
                    : "border bg-white hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>

            )
          )}

        </div>
      )}

      {/* ======================================================
          PROJECT MODAL
      ====================================================== */}

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        project={selectedProject}
      />

      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Project"
        message="This project will be permanently deleted. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
      />

      {/* ======================================================
          TIME TRACKING MODAL
      ====================================================== */}

      {timeModalOpen && timeProject && (

        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Timer size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Time Tracking
                  </h2>

                  <p className="text-xs text-slate-500">
                    {timeProject.name} ({timeProject.key})
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeTimeTracking}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Body */}

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

              {/* Project Selector */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Project
                </label>

                <select
                  value={timeProject.id}
                  onChange={(e) => {
                    const project = projects.find(
                      (item) =>
                        String(item.id) ===
                        e.target.value
                    );

                    if (project) {
                      openTimeTracking(project);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.key} — {project.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* Time Summary */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                    Estimate
                  </p>

                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {estimate}h
                  </p>

                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    Time Spent
                  </p>

                  <p className="text-2xl font-bold text-emerald-700 mt-1">
                    {spent}h
                  </p>

                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Remaining
                  </p>

                  <p className="text-2xl font-bold text-amber-700 mt-1">
                    {remaining}h
                  </p>

                </div>

              </div>

              {/* Progress */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-xs font-semibold text-slate-600">
                    Time progress
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {Math.round(progress)}%
                  </span>

                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#0052CC] rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* Estimate */}

              <div className="border border-slate-200 rounded-xl p-4">

                <div className="flex items-center justify-between mb-3">

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Original Estimate
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      Total estimated work for this project
                    </p>
                  </div>

                  <Clock3
                    size={18}
                    className="text-slate-400"
                  />

                </div>

                <div className="flex gap-2">

                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={estimateInput}
                    onChange={(e) =>
                      setEstimateInput(
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="Hours"
                  />

                  <button
                    type="button"
                    onClick={saveEstimate}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800"
                  >
                    <Save size={14} />
                    Save
                  </button>

                </div>

              </div>

              {/* Log Work */}

              <form
                onSubmit={handleLogWork}
                className="border border-slate-200 rounded-xl p-4"
              >

                <div className="mb-4">

                  <h3 className="text-sm font-bold text-slate-800">
                    Log Work
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Record time spent working on this project.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <div>

                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Time Spent (hours)
                    </label>

                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={timeSpentInput}
                      onChange={(e) =>
                        setTimeSpentInput(
                          e.target.value
                        )
                      }
                      placeholder="e.g. 2.5"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />

                  </div>

                  <div className="md:col-span-2">

                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Work Description
                    </label>

                    <input
                      type="text"
                      value={workDescription}
                      onChange={(e) =>
                        setWorkDescription(
                          e.target.value
                        )
                      }
                      placeholder="What did you work on?"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="mt-3 w-full bg-[#0052CC] hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <Clock3 size={16} />
                  Log Work
                </button>

              </form>

              {/* Work History */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <History
                    size={16}
                    className="text-slate-500"
                  />

                  <h3 className="text-sm font-bold text-slate-800">
                    Work Log
                  </h3>

                </div>

                {workHistory.length === 0 ? (

                  <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">

                    <Clock3
                      size={20}
                      className="mx-auto text-slate-300"
                    />

                    <p className="text-xs font-semibold text-slate-500 mt-2">
                      No work logged yet
                    </p>

                  </div>

                ) : (

                  <div className="border border-slate-200 rounded-xl overflow-hidden">

                    {workHistory.map((entry) => (

                      <div
                        key={entry.id}
                        className="px-4 py-3 border-b last:border-b-0 border-slate-100 flex items-center justify-between gap-4"
                      >

                        <div className="min-w-0">

                          <p className="text-xs font-semibold text-slate-700">
                            {entry.description}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(
                              entry.date
                            ).toLocaleString()}
                          </p>

                        </div>

                        <span className="shrink-0 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                          {entry.hours}h
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

            {/* Footer */}

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">

              <button
                type="button"
                onClick={closeTimeTracking}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProjectsModule;
