import { useState } from "react";
import {
  ArrowLeft,
  Users,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import WorkspaceMembers from "./WorkspaceMembers";
import WorkspaceSettings from "./WorkspaceSettings";

import { workspaceData } from "./workspaceData";
import { workspaceMembersData } from "./workspaceMembersData";

const WorkspaceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialWorkspace = workspaceData.find(
    (item) => item.id === Number(id)
  );

  const [workspace, setWorkspace] = useState(initialWorkspace);

  const [activeTab, setActiveTab] = useState("overview");

  const [members, setMembers] = useState(
    workspaceMembersData[Number(id)] || []
  );

  if (!workspace) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">

        <h2 className="text-xl font-bold text-[#172B4D]">
          Workspace not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          The workspace you are looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/workspaces")}
          className="mt-5 rounded-lg bg-[#0052CC] px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Back to Workspaces
        </button>

      </div>
    );
  }

  const handleRemoveMember = (memberId) => {
    setMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
  };

  const handleAddMember = () => {
    alert("Add Member feature coming next");
  };

  const handleSaveSettings = (data) => {
    setWorkspace((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleArchive = () => {
    setWorkspace((prev) => ({
      ...prev,
      status:
        prev.status === "Archived"
          ? "Active"
          : "Archived",
    }));
  };

  const handleDeleteWorkspace = () => {
    navigate("/workspaces");
  };

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate("/workspaces")}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0052CC]"
      >
        <ArrowLeft size={18} />
        Back to Workspaces
      </button>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0052CC] text-lg font-bold text-white">
              {workspace.key.slice(0, 2)}
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold text-[#172B4D]">
                  {workspace.name}
                </h1>

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

              <p className="mt-1 text-sm text-gray-500">
                {workspace.description}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Members
            </p>

            <p className="mt-1 text-2xl font-bold text-[#172B4D]">
              {members.length}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Projects
            </p>

            <p className="mt-1 text-2xl font-bold text-[#172B4D]">
              {workspace.projects}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Owner
            </p>

            <p className="mt-1 font-semibold text-[#172B4D]">
              {workspace.owner}
            </p>
          </div>

        </div>

      </div>

      <div className="flex overflow-x-auto border-b">

        <button
          onClick={() => setActiveTab("overview")}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
            activeTab === "overview"
              ? "border-[#0052CC] text-[#0052CC]"
              : "border-transparent text-gray-500 hover:text-[#172B4D]"
          }`}
        >
          <LayoutGrid size={17} />
          Overview
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
            activeTab === "members"
              ? "border-[#0052CC] text-[#0052CC]"
              : "border-transparent text-gray-500 hover:text-[#172B4D]"
          }`}
        >
          <Users size={17} />
          Members
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
            activeTab === "settings"
              ? "border-[#0052CC] text-[#0052CC]"
              : "border-transparent text-gray-500 hover:text-[#172B4D]"
          }`}
        >
          <Settings size={17} />
          Settings
        </button>

      </div>

      {activeTab === "overview" && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-[#172B4D]">
            Workspace Overview
          </h2>

          <p className="mt-2 text-gray-500">
            Welcome to the {workspace.name} workspace.
          </p>

          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-700">
              This workspace contains{" "}
              <strong>{workspace.projects}</strong>{" "}
              projects and{" "}
              <strong>{members.length}</strong>{" "}
              members.
            </p>
          </div>

        </div>
      )}

      {activeTab === "members" && (
        <WorkspaceMembers
          workspace={workspace}
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}

      {activeTab === "settings" && (
        <WorkspaceSettings
          workspace={workspace}
          onSave={handleSaveSettings}
          onArchive={handleArchive}
          onDelete={handleDeleteWorkspace}
        />
      )}

    </div>
  );
};

export default WorkspaceDetails;