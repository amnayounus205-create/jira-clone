import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";

import WorkspaceCard from "./WorkspaceCard";
import WorkspaceModal from "./WorkspaceModal";

import ConfirmDialog from "../ui/ConfirmDialog";
import SearchInput from "../ui/SearchInput";

import { workspaceData } from "./workspaceData";

const WorkspaceModule = () => {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState(workspaceData);

  const [open, setOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) => {
      const searchValue = search.toLowerCase();

      const matchSearch =
        workspace.name.toLowerCase().includes(searchValue) ||
        workspace.key.toLowerCase().includes(searchValue) ||
        workspace.owner.toLowerCase().includes(searchValue);

      const matchStatus =
        status === "All" || workspace.status === status;

      return matchSearch && matchStatus;
    });
  }, [workspaces, search, status]);

  const handleCreate = () => {
    setSelectedWorkspace(null);
    setOpen(true);
  };

  const handleEdit = (workspace) => {
    setSelectedWorkspace(workspace);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setWorkspaces((prev) =>
      prev.filter((workspace) => workspace.id !== deleteId)
    );

    toast.success("Workspace deleted successfully");

    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleSubmit = (data) => {
    if (selectedWorkspace) {
      setWorkspaces((prev) =>
        prev.map((workspace) =>
          workspace.id === selectedWorkspace.id
            ? {
                ...workspace,
                ...data,
              }
            : workspace
        )
      );

      toast.success("Workspace updated successfully");
    } else {
      const newWorkspace = {
        id: Date.now(),
        ...data,
        ownerAvatar: "https://i.pravatar.cc/40?img=11",
        members: 1,
        projects: 0,
        createdAt: new Date()
          .toISOString()
          .split("T")[0],
      };

      setWorkspaces((prev) => [
        ...prev,
        newWorkspace,
      ]);

      toast.success("Workspace created successfully");
    }

    setOpen(false);
    setSelectedWorkspace(null);
  };

  const handleMembers = (workspace) => {
    navigate(`/workspaces/${workspace.id}`);
  };

  const handleSettings = (workspace) => {
    navigate(`/workspaces/${workspace.id}?tab=settings`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-[#0052CC]">
              <LayoutGrid size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#172B4D]">
                Workspaces
              </h1>

              <p className="text-gray-500">
                Manage your workspaces and teams
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0052CC] px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Workspace
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-96">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
          className="rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-[#172B4D]">
            Your Workspaces
          </h2>

          <p className="text-sm text-gray-500">
            {filteredWorkspaces.length} workspace
            {filteredWorkspaces.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {filteredWorkspaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMembers={handleMembers}
              onSettings={handleSettings}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <LayoutGrid
              size={26}
              className="text-gray-400"
            />
          </div>

          <h3 className="text-lg font-semibold text-[#172B4D]">
            No workspaces found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filter.
          </p>
        </div>
      )}

      <WorkspaceModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedWorkspace(null);
        }}
        onSubmit={handleSubmit}
        workspace={selectedWorkspace}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Workspace"
        message="This workspace will be permanently deleted. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default WorkspaceModule;