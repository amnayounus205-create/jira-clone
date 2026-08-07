import {
  Eye,
  Pencil,
  Trash2,
  Building2,
  Users,
  FolderKanban,
  Briefcase,
} from "lucide-react";

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Planning: "bg-yellow-100 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
};

const OrganizationTable = ({
  organizations,
  onView,
  onEdit,
  onDelete,
}) => {
  if (organizations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <Building2 size={70} className="mx-auto text-gray-300" />

        <h2 className="text-2xl font-bold mt-5">
          No Organizations Found
        </h2>

        <p className="text-gray-500 mt-2">
          Create your first organization.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="p-4">Organization</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Members</th>
              <th className="p-4">Projects</th>
              <th className="p-4">Workspaces</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {organizations.map((organization) => (
              <tr
                key={organization.id}
                className="border-b hover:bg-slate-50 transition"
              >
                {/* Organization */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#0052CC] text-white flex items-center justify-center font-bold">
                      {organization.key}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {organization.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {organization.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Owner */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={organization.ownerAvatar}
                      alt={organization.owner}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{organization.owner}</span>
                  </div>
                </td>

                {/* Members */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    {organization.members}
                  </div>
                </td>

                {/* Projects */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FolderKanban size={18} />
                    {organization.projects}
                  </div>
                </td>

                {/* Workspaces */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} />
                    {organization.workspaces}
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[organization.status]}`}
                  >
                    {organization.status}
                  </span>
                </td>

                {/* Created */}
                <td className="p-4">{organization.createdAt}</td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onView(organization.id)} // <-- YE FIX KIYA
                      className="text-gray-600 hover:text-black"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(organization)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(organization.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationTable;