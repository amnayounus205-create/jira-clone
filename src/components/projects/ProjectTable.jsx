import {
  Pencil,
  Trash2,
  Eye,
  FolderKanban,
  Users,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Planning: "bg-yellow-100 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
};

const ProjectTable = ({
  projects,
  onEdit,
  onDelete,
}) => {
  // Empty State
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-16 text-center">
        <FolderKanban
          size={70}
          className="mx-auto text-gray-300"
        />

        <h2 className="text-xl font-bold mt-5">
          No Projects Found
        </h2>

        <p className="text-gray-500 mt-2">
          Create your first project.
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

              <th className="p-4">Project</th>

              <th className="p-4">Lead</th>

              <th className="p-4">Members</th>

              <th className="p-4">Tasks</th>

              <th className="p-4">Progress</th>

              <th className="p-4">Status</th>

              <th className="p-4">Timeline</th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {projects.map((project) => (

              <tr
                key={project.id}
                className="border-b hover:bg-slate-50 transition"
              >

                {/* Project */}

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-lg bg-[#0052CC] flex items-center justify-center text-white font-bold">

                      {project.key}

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {project.name}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {project.key}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Lead */}

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={project.leadAvatar}
                      alt={project.lead}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <span>{project.lead}</span>

                  </div>

                </td>

                {/* Members */}

                <td className="p-4">

                  <div className="flex items-center gap-2">

                    <Users size={18} />

                    {project.members}

                  </div>

                </td>

                {/* Tasks */}

                <td className="p-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 size={18} />

                    {project.tasks}

                  </div>

                </td>

                {/* Progress */}

                <td className="p-4 w-52">

                  <div className="w-full bg-gray-200 rounded-full h-2">

                    <div
                      className="bg-[#0052CC] h-2 rounded-full"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs mt-2">
                    {project.progress}%
                  </p>

                </td>

                {/* Status */}

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[project.status]}`}
                  >
                    {project.status}
                  </span>

                </td>

                {/* Timeline */}

                <td className="p-4">

                  <p className="text-sm">
                    {project.startDate}
                  </p>

                  <p className="text-xs text-gray-500">
                    {project.endDate}
                  </p>

                </td>

                {/* Actions */}

                <td className="p-4">

                  <div className="flex justify-center gap-4">

                    {/* View */}

                    <Link
                      to={`/projects/${project.id}`}
                      className="text-gray-600 hover:text-black"
                    >
                      <Eye size={18} />
                    </Link>

                    {/* Edit */}

                    <button
                      onClick={() => onEdit(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Delete */}

                    <button
                      onClick={() =>
                        onDelete(project.id)
                      }
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

export default ProjectTable;