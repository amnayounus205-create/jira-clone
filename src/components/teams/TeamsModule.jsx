import React, { useState } from "react";
import { Users, UserPlus, Mail, MoreHorizontal, Trash2, Edit3, X, Filter } from "lucide-react";

const initialTeamMembers = [
  { id: 1, name: "Ayesha Khan", email: "ayesha@atlas.io", role: "Org_admin", team: "Engineering", openItems: 0, status: "Active" },
  { id: 2, name: "Daniel Ross", email: "daniel@atlas.io", role: "Project_manager", team: "Product", openItems: 3, status: "Active" },
  { id: 3, name: "Mei Lin", email: "mei@atlas.io", role: "Scrum_master", team: "Frontend", openItems: 5, status: "Active" },
  { id: 4, name: "Omar Farouk", email: "omar@atlas.io", role: "Developer", team: "Backend", openItems: 5, status: "Active" },
  { id: 5, name: "Sara Novak", email: "sara@atlas.io", role: "Developer", team: "UI/UX", openItems: 5, status: "Active" },
  { id: 6, name: "Jonas Weber", email: "jonas@atlas.io", role: "Qa_tester", team: "Quality Assurance", openItems: 5, status: "Active" },
];

const rolesList = [
  "Org_admin",
  "Project_manager",
  "Scrum_master",
  "Developer",
  "Qa_tester",
  "Viewer",
];

const roleColors = {
  Org_admin: "bg-slate-900 text-white",
  Project_manager: "bg-slate-900 text-white",
  Scrum_master: "bg-slate-900 text-white",
  Developer: "bg-slate-900 text-white",
  Qa_tester: "bg-slate-900 text-white",
  Viewer: "bg-slate-700 text-white",
};

const avatarColors = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
];

export default function TeamsModule() {
  const [members, setMembers] = useState(initialTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", role: "Developer", team: "Engineering", openItems: 0 });

  // 1. CREATE Member Handler
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newMember = {
      id: Date.now(),
      ...formData,
      status: "Active",
    };

    setMembers([newMember, ...members]);
    setFormData({ name: "", email: "", role: "Developer", team: "Engineering", openItems: 0 });
    setIsAddOpen(false);
  };

  // 2. OPEN EDIT Modal Handler
  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      team: member.team,
      openItems: member.openItems,
    });
  };

  // 3. UPDATE/EDIT Member Handler
  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setMembers(
      members.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              team: formData.team,
            }
          : m
      )
    );
    setEditingMember(null);
    setFormData({ name: "", email: "", role: "Developer", team: "Engineering", openItems: 0 });
  };

  // 4. DELETE Member Handler
  const handleDeleteConfirm = () => {
    if (!memberToDelete) return;
    setMembers(members.filter((m) => m.id !== memberToDelete.id));
    setMemberToDelete(null);
  };

  // Filtering Logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.team.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === "All" || m.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team</h1>
          <p className="text-sm text-slate-500 mt-1">People working across your projects.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: "", email: "", role: "Developer", team: "Engineering", openItems: 0 });
            setIsAddOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus size={18} /> Add Team Member
        </button>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Users size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search everything..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter size={16} /> Role:
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Roles</option>
            {rolesList.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
            Total: {filteredMembers.length}
          </span>
        </div>
      </div>

      {/* Team Members Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMembers.map((m, index) => (
          <div key={m.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${avatarColors[index % avatarColors.length]} text-white flex items-center justify-center font-bold text-base shadow-sm`}>
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{m.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{m.email}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${roleColors[m.role] || "bg-slate-800 text-white"}`}>
                      {m.role}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {m.openItems} open items
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons on Card */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(m)}
                  className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit Member"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => setMemberToDelete(m)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Delete Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Add New Team Member</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ayesha@atlas.io"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Team Unit</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="e.g. Engineering"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  {rolesList.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Edit Team Member</h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Team Unit</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  {rolesList.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Box Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-600">Remove Team Member</h3>
              <button onClick={() => setMemberToDelete(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to remove <span className="font-semibold text-slate-800">"{memberToDelete.name}"</span> from the team? They will lose workspace access.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setMemberToDelete(null)}
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