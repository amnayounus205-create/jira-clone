import {
  MoreVertical,
  Users,
  FolderKanban,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react";

const WorkspaceCard = ({
  workspace,
  onEdit,
  onDelete,
  onMembers,
  onSettings,
}) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Top */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0052CC] font-bold text-white">
            {workspace.key.slice(0, 2)}
          </div>

          <div>
            <h3 className="font-bold text-[#172B4D]">
              {workspace.name}
            </h3>

            <p className="text-sm text-gray-500">
              {workspace.key}
            </p>
          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            workspace.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {workspace.status}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-2 text-sm text-gray-500">
        {workspace.description}
      </p>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={16} />
            <span className="text-xs">Members</span>
          </div>

          <p className="mt-1 text-lg font-bold text-[#172B4D]">
            {workspace.members}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-500">
            <FolderKanban size={16} />
            <span className="text-xs">Projects</span>
          </div>

          <p className="mt-1 text-lg font-bold text-[#172B4D]">
            {workspace.projects}
          </p>
        </div>

      </div>

      {/* Owner */}
      <div className="mt-5 flex items-center gap-3">

        <img
          src={workspace.ownerAvatar}
          alt={workspace.owner}
          className="h-8 w-8 rounded-full"
        />

        <div>
          <p className="text-xs text-gray-400">
            Workspace Owner
          </p>

          <p className="text-sm font-medium text-[#172B4D]">
            {workspace.owner}
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2 border-t pt-4">

        <button
          onClick={() => onMembers(workspace)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          <Users size={16} />
          Members
        </button>

        <button
          onClick={() => onSettings(workspace)}
          className="rounded-lg border p-2 hover:bg-gray-50"
          title="Settings"
        >
          <Settings size={16} />
        </button>

        <button
          onClick={() => onEdit(workspace)}
          className="rounded-lg border p-2 text-blue-600 hover:bg-blue-50"
          title="Edit"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete(workspace.id)}
          className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>

      </div>
    </div>
  );
};

export default WorkspaceCard;