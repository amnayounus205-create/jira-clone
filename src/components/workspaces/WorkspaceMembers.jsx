import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  Trash2,
  Shield,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

import ConfirmDialog from "../ui/ConfirmDialog";

const WorkspaceMembers = ({
  workspace,
  members = [],
  onAddMember,
  onRemoveMember,
}) => {
  const [search, setSearch] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = useMemo(() => {
    const value = search.toLowerCase();

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(value) ||
        member.username.toLowerCase().includes(value) ||
        member.email.toLowerCase().includes(value)
    );
  }, [members, search]);

  const handleRemove = (member) => {
    setSelectedMember(member);
    setDeleteOpen(true);
  };

  const confirmRemove = () => {
    if (!selectedMember) return;

    onRemoveMember(selectedMember.id);

    toast.success(
      `${selectedMember.name} removed from workspace`
    );

    setSelectedMember(null);
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-[#172B4D]">
            Workspace Members
          </h2>

          <p className="text-sm text-gray-500">
            Manage members of {workspace?.name}
          </p>
        </div>

        <button
          onClick={onAddMember}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0052CC] px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Add Member
        </button>

      </div>

      {/* Search */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">

        <div className="relative w-full md:w-96">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-[#0052CC]"
          />

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Members
          </p>

          <p className="mt-2 text-2xl font-bold text-[#172B4D]">
            {members.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Admins
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0052CC]">
            {
              members.filter(
                (member) => member.role === "Admin"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Members
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {
              members.filter(
                (member) => member.status === "Active"
              ).length
            }
          </p>
        </div>

      </div>

      {/* Members */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">
          <h3 className="font-semibold text-[#172B4D]">
            All Members
          </h3>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="divide-y">

            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
              >

                {/* Member Info */}
                <div className="flex items-center gap-4">

                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#172B4D]">
                        {member.name}
                      </h4>

                      {member.role === "Admin" && (
                        <Shield
                          size={15}
                          className="text-[#0052CC]"
                        />
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      @{member.username}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <Mail size={12} />
                      {member.email}
                    </div>
                  </div>

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                  {/* Status */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {member.status}
                  </span>

                  {/* Role */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      member.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : member.role === "Member"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {member.role}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => handleRemove(member)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    title="Remove member"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Search
                size={24}
                className="text-gray-400"
              />
            </div>

            <h3 className="font-semibold text-[#172B4D]">
              No members found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try a different search term.
            </p>

          </div>
        )}

      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Remove Member"
        message={`Are you sure you want to remove ${
          selectedMember?.name || "this member"
        } from the workspace?`}
        onConfirm={confirmRemove}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedMember(null);
        }}
      />

    </div>
  );
};

export default WorkspaceMembers;