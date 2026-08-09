import React, { useMemo, useState } from "react";
import {
  Users,
  Edit3,
  Trash2,
  X,
  Filter,
  UserPlus,
  Mail,
  Building2,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const initialTeamMembers = [
  {
    id: 1,
    name: "Ayesha Khan",
    email: "ayesha@atlas.io",
    role: "Org_admin",
    team: "Engineering",
    openItems: 0,
    status: "Active",
  },
  {
    id: 2,
    name: "Daniel Ross",
    email: "daniel@atlas.io",
    role: "Project_manager",
    team: "Product",
    openItems: 3,
    status: "Active",
  },
  {
    id: 3,
    name: "Mei Lin",
    email: "mei@atlas.io",
    role: "Scrum_master",
    team: "Frontend",
    openItems: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "Omar Farouk",
    email: "omar@atlas.io",
    role: "Developer",
    team: "Backend",
    openItems: 5,
    status: "Active",
  },
  {
    id: 5,
    name: "Sara Novak",
    email: "sara@atlas.io",
    role: "Developer",
    team: "UI/UX",
    openItems: 5,
    status: "Active",
  },
  {
    id: 6,
    name: "Jonas Weber",
    email: "jonas@atlas.io",
    role: "Qa_tester",
    team: "Quality Assurance",
    openItems: 5,
    status: "Active",
  },
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
  Developer: "bg-blue-50 text-blue-700",
  Qa_tester: "bg-purple-50 text-purple-700",
  Viewer: "bg-slate-100 text-slate-700",
};

const avatarColors = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
];

const emptyForm = {
  name: "",
  email: "",
  role: "Developer",
  team: "Engineering",
  openItems: 0,
};

export default function TeamsModule() {
  const [members, setMembers] = useState(initialTeamMembers);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  // ============================================================
  // Add Member
  // ============================================================

  const handleAddMember = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      team: formData.team.trim() || "Engineering",
      openItems: 0,
      status: "Active",
    };

    setMembers((prev) => [newMember, ...prev]);

    setFormData(emptyForm);
    setIsAddOpen(false);

    toast.success(`${newMember.name} added to the team.`);
  };

  // ============================================================
  // Open Edit
  // ============================================================

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

  // ============================================================
  // Update Member
  // ============================================================

  const handleUpdateMember = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id
          ? {
              ...member,
              name: formData.name.trim(),
              email: formData.email.trim(),
              role: formData.role,
              team: formData.team.trim() || "Engineering",
            }
          : member
      )
    );

    const updatedName = formData.name.trim();

    setEditingMember(null);
    setFormData(emptyForm);

    toast.success(`${updatedName} updated successfully.`);
  };

  // ============================================================
  // Delete Member
  // ============================================================

  const handleDeleteConfirm = () => {
    if (!memberToDelete) return;

    const deletedName = memberToDelete.name;

    setMembers((prev) =>
      prev.filter((member) => member.id !== memberToDelete.id)
    );

    setMemberToDelete(null);

    toast.success(`${deletedName} removed from the team.`);
  };

  // ============================================================
  // Filter
  // ============================================================

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !normalizedSearch ||
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.email.toLowerCase().includes(normalizedSearch) ||
        member.team.toLowerCase().includes(normalizedSearch);

      const matchesRole =
        roleFilter === "All" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // ============================================================
  // Stats
  // ============================================================

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const totalOpenItems = members.reduce(
    (total, member) => total + Number(member.openItems || 0),
    0
  );

  const teamsCount = new Set(
    members.map((member) => member.team)
  ).size;

  return (
    <div className="space-y-6">

      {/* ========================================================
          Header
      ======================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-[#172B4D]">
            Teams
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage team members, roles and access.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => setTeamDetailsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            <Users size={17} />
            Team Details
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData(emptyForm);
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 bg-[#0052CC] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <UserPlus size={17} />
            Add Member
          </button>

        </div>
      </div>

      {/* ========================================================
          Stats
      ======================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Total Members
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {members.length}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Active Members
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {activeMembers}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Teams
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {teamsCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Open Items
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {totalOpenItems}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail size={20} />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          Search + Filter
      ======================================================== */}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="relative w-full sm:w-96">

          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Users size={16} />
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members, email or team..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
          />

        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter size={16} />
            Role:
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Roles</option>

            {rolesList.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2.5 rounded-lg whitespace-nowrap">
            {filteredMembers.length} members
          </span>

        </div>
      </div>

      {/* ========================================================
          Members
      ======================================================== */}

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {filteredMembers.map((member, index) => (

            <div
              key={member.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4 min-w-0">

                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl ${
                      avatarColors[index % avatarColors.length]
                    } text-white flex items-center justify-center font-bold text-base shadow-sm`}
                  >
                    {member.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-slate-800 text-base truncate">
                      {member.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {member.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                          roleColors[member.role] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {member.role}
                      </span>

                      <span className="text-xs text-slate-500 font-medium">
                        {member.openItems} open items
                      </span>

                    </div>

                    <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                      <Building2 size={13} />
                      {member.team}
                    </div>

                  </div>
                </div>

                {/* Actions */}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                    title="Edit Member"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMemberToDelete(member)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                    title="Delete Member"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">

          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Users size={20} />
          </div>

          <h3 className="font-semibold text-slate-700 mt-3">
            No members found
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Try changing your search or role filter.
          </p>

        </div>
      )}

      {/* ========================================================
          Add Member Modal
      ======================================================== */}

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Add Team Member
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Add a new member to your team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleAddMember}
              className="p-6 space-y-4"
            >

              <div>
                <label className="form-label">
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Ayesha Khan"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Email Address *
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="e.g. ayesha@atlas.io"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Team
                </label>

                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      team: e.target.value,
                    })
                  }
                  placeholder="e.g. Engineering"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Role
                </label>

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  {rolesList.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Add Member
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          Edit Member Modal
      ======================================================== */}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Edit Team Member
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Update member information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleUpdateMember}
              className="p-6 space-y-4"
            >

              <div>
                <label className="form-label">
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Email Address *
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Team
                </label>

                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      team: e.target.value,
                    })
                  }
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Role
                </label>

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  {rolesList.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Update Member
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          Delete Confirmation
      ======================================================== */}

      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-bold text-red-600">
                Remove Team Member
              </h3>

              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>

            </div>

            <p className="text-sm text-slate-600 mt-4 leading-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-800">
                "{memberToDelete.name}"
              </span>{" "}
              from the team?
            </p>

            <p className="text-xs text-slate-400 mt-2">
              They will lose workspace access.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Delete
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          Team Details Modal
      ======================================================== */}

      {teamDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>
                <h3 className="text-lg font-bold text-[#172B4D]">
                  Team Details
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Overview of your current team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTeamDetailsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>

            </div>

            <div className="p-6 space-y-5">

              {/* Team identity */}

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-[#0052CC] text-white flex items-center justify-center">
                  <Users size={25} />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-800">
                    Atlas Team
                  </h4>

                  <p className="text-sm text-slate-400">
                    Project Management Team
                  </p>
                </div>

              </div>

              {/* Stats */}

              <div className="grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
                  <p className="text-xl font-bold text-slate-800">
                    {members.length}
                  </p>

                  <p className="text-[11px] text-slate-400 uppercase font-semibold mt-1">
                    Members
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
                  <p className="text-xl font-bold text-emerald-600">
                    {activeMembers}
                  </p>

                  <p className="text-[11px] text-slate-400 uppercase font-semibold mt-1">
                    Active
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
                  <p className="text-xl font-bold text-amber-600">
                    {totalOpenItems}
                  </p>

                  <p className="text-[11px] text-slate-400 uppercase font-semibold mt-1">
                    Open Items
                  </p>
                </div>

              </div>

              {/* Team information */}

              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Team Type
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    Product Team
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Departments
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {teamsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>

              </div>

              <div className="flex justify-end pt-2">

                <button
                  type="button"
                  onClick={() => setTeamDetailsOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Done
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}