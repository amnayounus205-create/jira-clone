import React, { useState } from "react";
import { FolderKanban, Plus, Search, MoreHorizontal, Users, Calendar, Trash2, Edit3, X, Filter } from "lucide-react";

const initialProjects = [
  { id: 1, name: "Jira Enterprise SaaS", key: "JIRA", lead: "Admin User", status: "Active", deadline: "Aug 30, 2026", issuesCount: 24 },
  { id: 2, name: "P Foodie Mobile Case Study", key: "FOOD", lead: "Sarah Jenkins", status: "In Progress", deadline: "Sep 15, 2026", issuesCount: 16 },
  { id: 3, name: "HR Management System", key: "HRMS", lead: "Alex Morgan", status: "Completed", deadline: "Jul 20, 2026", issuesCount: 42 },
];

export default function ProjectsModule() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modals States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({ name: "", key: "", lead: "", deadline: "", status: "Active" });

  // 1. CREATE Project Handler
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.key) return;

    const newProj = {
      id: Date.now(),
      name: formData.name,
      key: formData.key.toUpperCase(),
      lead: formData.lead || "Admin User",
      status: formData.status || "Active",
      deadline: formData.deadline || "TBD",
      issuesCount: 0,
    };

    setProjects([newProj, ...projects]);
    setFormData({ name: "", key: "", lead: "", deadline: "", status: "Active" });
    setIsCreateOpen(false);
  };

  // 2. OPEN EDIT Modal Handler
  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      key: project.key,
      lead: project.lead,
      deadline: project.deadline,
      status: project.status,
    });
  };

  // 3. UPDATE/EDIT Project Handler
  const handleUpdateProject = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.key) return;

    setProjects(
      projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              name: formData.name,
              key: formData.key.toUpperCase(),
              lead: formData.lead,
              deadline: formData.deadline,
              status: formData.status,
            }
          : p
      )
    );
    setEditingProject(null);
    setFormData({ name: "", key: "", lead: "", deadline: "", status: "Active" });
  };

  // 4. DELETE Project Handler
  const handleDeleteConfirm = () => {
    if (!projectToDelete) return;
    setProjects(projects.filter((p) => p.id !== projectToDelete.id));
    setProjectToDelete(null);
  };

  // Filtering Logic (Search Query + Status Dropdown)
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, edit, delete, and filter workspace projects.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: "", key: "", lead: "", deadline: "", status: "Active" });
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Create Project
        </button>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or key..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter size={16} /> Status Filter:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
            Total: {filteredProjects.length}
          </span>
        </div>
      </div>

      {/* Projects Table Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Project Name</th>
                <th className="p-4">Project Key</th>
                <th className="p-4">Project Lead</th>
                <th className="p-4">Status</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Issues</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-semibold text-slate-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {p.key[0]}
                    </div>
                    {p.name}
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                      {p.key}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.lead}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.status === "Active" ? "bg-blue-50 text-blue-600" :
                      p.status === "In Progress" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs flex items-center gap-1.5 pt-5">
                    <Calendar size={14} /> {p.deadline}
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{p.issuesCount}</td>
                  <td className="p-4 text-right space-x-1">
                    <button 
                      onClick={() => openEditModal(p)}
                      className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setProjectToDelete(p)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Create New Project</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Enterprise SaaS CRM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Key</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g. CRM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Lead</label>
                <input
                  type="text"
                  value={formData.lead}
                  onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                  placeholder="e.g. Admin User"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Target Deadline</label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  placeholder="e.g. Sep 30, 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Edit Project</h3>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Key</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Lead</label>
                <input
                  type="text"
                  value={formData.lead}
                  onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Box Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-600">Delete Project</h3>
              <button onClick={() => setProjectToDelete(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-800">"{projectToDelete.name}"</span>? This will permanently remove all related issues and milestone tracking.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}