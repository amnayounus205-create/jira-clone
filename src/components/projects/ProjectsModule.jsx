import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import ProjectTable from "./ProjectTable";
import ProjectModal from "./ProjectModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import SearchInput from "../ui/SearchInput";

import { projectData } from "./projectData";

const ProjectsModule = () => {
  const [projects, setProjects] = useState(projectData);

  const [open, setOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const perPage = 5;

  // ==========================
  // Search + Filter
  // ==========================

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

  // ==========================
  // Pagination
  // ==========================

  const totalPages = Math.ceil(
    filteredProjects.length / perPage
  );

  const displayedProjects =
    filteredProjects.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

  // ==========================
  // Create Project
  // ==========================

  const handleCreate = () => {
    setSelectedProject(null);
    setOpen(true);
  };

  // ==========================
  // Edit Project
  // ==========================

  const handleEdit = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  // ==========================
  // Open Delete Dialog
  // ==========================

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  // ==========================
  // Confirm Delete
  // ==========================

  const confirmDelete = () => {
    setProjects((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );

    toast.success("Project Deleted Successfully");

    setDeleteOpen(false);

    setDeleteId(null);
  };

  // ==========================
  // Create / Update
  // ==========================

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
      };

      setProjects((prev) => [
        ...prev,
        newProject,
      ]);

      toast.success("Project Created");
    }

    setOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <div>

          <h1 className="text-3xl font-bold text-[#172B4D]">
            Projects
          </h1>

          <p className="text-gray-500">
            Manage all your projects
          </p>

        </div>

        <button
          onClick={handleCreate}
          className="bg-[#0052CC] hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Create Project
        </button>

      </div>

      {/* Search + Filter */}

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
          className="border rounded-lg px-4 py-3 outline-none"
        >
          <option>All</option>
          <option>Planning</option>
          <option>Active</option>
          <option>Completed</option>
        </select>

      </div>

      {/* Table */}

      <ProjectTable
        projects={displayedProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2">

          {[...Array(totalPages)].map((_, index) => (

            <button
              key={index}
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

          ))}

        </div>

      )}

      {/* Project Modal */}

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        project={selectedProject}
      />

      {/* Delete Confirmation */}

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

    </div>
  );
};

export default ProjectsModule;