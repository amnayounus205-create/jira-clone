import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  FolderKanban,
  Users,
  ListChecks,
  TrendingUp,
  Pencil,
  Calendar,
  Hash,
  CheckCircle,
  Trash2,
  Plus,
} from "lucide-react";

import { projectData as initialData } from "./projectData";
import ProjectInfoCard from "./ProjectInfoCard";
import TeamMembers from "./TeamMembers";
import ActivityTimeline from "./ActivityTimeline";
import ProjectModal from "./ProjectModal";
import ConfirmDialog from "../ui/ConfirmDialog";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Local state taake edit/delete ho sake
  const [projects, setProjects] = useState(initialData);
  const [open, setOpen] = useState(false); // edit modal
  const [deleteDialog, setDeleteDialog] = useState(false); // delete dialog

  const project = projects.find(
    (item) => String(item.id) === String(id)
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Toaster position="top-right" />
        <FolderKanban size={70} className="text-gray-300" />
        <h2 className="text-2xl font-bold mt-5 text-[#172B4D]">
          Project Not Found
        </h2>
        <p className="text-gray-500 mt-2">
          We couldn't find a project with ID: <span className="font-mono">{id}</span>
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-[#0052CC] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ========== HANDLERS ==========
  const handleEdit = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialog(true);
  };

  const handleAddTask = () => {
    toast("Add Task feature coming soon 🚀");
  };

  const confirmDelete = () => {
    setProjects((prev) => prev.filter((item) => item.id !== project.id));
    toast.success("Project Deleted Successfully");
    setDeleteDialog(false);
    navigate("/projects");
  };

  const handleSubmit = (data) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === project.id ? { ...item, ...data } : item
      )
    );
    toast.success("Project Updated Successfully");
    setOpen(false);
  };

  const statusColor = {
    Active: "bg-green-100 text-green-700",
    Planning: "bg-yellow-100 text-yellow-700",
    Completed: "bg-blue-100 text-blue-700",
    "On Hold": "bg-gray-200 text-gray-700",
  };

  const completedTasks = Math.round((project.tasks * project.progress) / 100);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0052CC] font-semibold hover:underline"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex gap-3">
          <button 
            onClick={handleEdit}
            className="bg-[#0052CC] text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Pencil size={18} />
            Edit Project
          </button>

          <button 
            onClick={handleDelete}
            className="border border-red-500 text-red-600 px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-red-50 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex gap-5">
            <div className="w-24 h-24 rounded-xl bg-[#0052CC] flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {project.key}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-[#172B4D]">
                  {project.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-gray-500">{project.description}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Hash size={18} />
                  Key: {project.key}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {project.startDate} → {project.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  {completedTasks}/{project.tasks} Tasks Done
                </div>
              </div>
            </div>
          </div>

          {/* Project Lead */}
          <div className="bg-slate-50 rounded-xl p-5 w-full lg:w-80">
            <h3 className="font-bold mb-4">Project Lead</h3>
            <div className="flex items-center gap-3">
              <img
                src={project.leadAvatar}
                alt={project.lead}
                className="w-14 h-14 rounded-full"
              />
              <div>
                <h4 className="font-semibold">{project.lead}</h4>
                <p className="text-sm text-gray-500">Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow p-6">
          <Users size={34} className="text-[#0052CC]" />
          <h2 className="text-3xl font-bold mt-5">{project.members}</h2>
          <p className="text-gray-500">Team Members</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <ListChecks size={34} className="text-green-600" />
          <h2 className="text-3xl font-bold mt-5">{project.tasks}</h2>
          <p className="text-gray-500">Total Tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <TrendingUp size={34} className="text-orange-500" />
          <h2 className="text-3xl font-bold mt-5">{completedTasks}</h2>
          <p className="text-gray-500">Completed Tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FolderKanban size={34} className="text-purple-600" />
          <h2 className="text-3xl font-bold mt-5">{project.progress}%</h2>
          <p className="text-gray-500">Progress</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Project Progress</h2>
          <span className="font-semibold text-[#0052CC]">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-[#0052CC] h-4 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {completedTasks} out of {project.tasks} tasks completed
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="xl:col-span-2 space-y-6">
          <ProjectInfoCard project={project} />
          <ActivityTimeline />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <TeamMembers />

          {/* Quick Actions - with functionality */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={handleAddTask}
                className="w-full bg-[#0052CC] text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Task
              </button>

              <button 
                onClick={handleEdit}
                className="w-full border border-[#0052CC] text-[#0052CC] py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                <Pencil size={18} />
                Edit Project
              </button>

              <button 
                onClick={handleDelete}
                className="w-full border border-red-500 text-red-600 py-3 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        project={project}
      />

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onCancel={() => setDeleteDialog(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProjectDetails;