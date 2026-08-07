import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  FolderKanban,
  Briefcase,
  Pencil,
  Mail,
  Globe,
  Phone,
} from "lucide-react";

import { organizationData } from "./organizationData";

const OrganizationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const organization = organizationData.find(
    (item) => item.id === Number(id)
  );

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center py-20">

        <Building2
          size={70}
          className="text-gray-300"
        />

        <h2 className="text-2xl font-bold mt-5">
          Organization Not Found
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-[#0052CC] text-white px-6 py-3 rounded-lg"
        >
          Go Back
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0052CC] font-semibold"
        >
          <ArrowLeft size={18} />

          Back
        </button>

        <button
          className="bg-[#0052CC] text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Pencil size={18} />

          Edit Organization
        </button>

      </div>

      {/* Hero Card */}

      <div className="bg-white rounded-xl shadow p-8">

        <div className="flex flex-col lg:flex-row justify-between gap-8">

          <div className="flex gap-5">

            <div className="w-24 h-24 rounded-xl bg-[#0052CC] flex items-center justify-center text-white text-3xl font-bold">

              {organization.key}

            </div>

            <div>

              <h1 className="text-3xl font-bold text-[#172B4D]">

                {organization.name}

              </h1>

              <p className="text-gray-500 mt-2">

                {organization.description}

              </p>

              <div className="flex flex-wrap gap-6 mt-6">

                <div className="flex items-center gap-2">

                  <Mail size={18} />

                  {organization.email}

                </div>

                <div className="flex items-center gap-2">

                  <Phone size={18} />

                  {organization.phone}

                </div>

                <div className="flex items-center gap-2">

                  <Globe size={18} />

                  {organization.website}

                </div>

              </div>

            </div>

          </div>

          {/* Owner */}

          <div className="bg-slate-50 rounded-xl p-5 w-80">

            <h3 className="font-bold mb-4">
              Organization Owner
            </h3>

            <div className="flex items-center gap-3">

              <img
                src={organization.ownerAvatar}
                alt={organization.owner}
                className="w-14 h-14 rounded-full"
              />

              <div>

                <h4 className="font-semibold">

                  {organization.owner}

                </h4>

                <p className="text-sm text-gray-500">

                  Organization Admin

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-6">

          <Users
            size={34}
            className="text-[#0052CC]"
          />

          <h2 className="text-3xl font-bold mt-5">

            {organization.members}

          </h2>

          <p className="text-gray-500">

            Members

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <FolderKanban
            size={34}
            className="text-green-600"
          />

          <h2 className="text-3xl font-bold mt-5">

            {organization.projects}

          </h2>

          <p className="text-gray-500">

            Projects

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <Briefcase
            size={34}
            className="text-orange-500"
          />

          <h2 className="text-3xl font-bold mt-5">

            {organization.workspaces}

          </h2>

          <p className="text-gray-500">

            Workspaces

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <Building2
            size={34}
            className="text-purple-600"
          />

          <h2 className="text-3xl font-bold mt-5">

            {organization.status}

          </h2>

          <p className="text-gray-500">

            Current Status

          </p>

        </div>

      </div>

      {/* Progress */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between mb-4">

          <h2 className="font-bold text-lg">

            Organization Progress

          </h2>

          <span className="font-semibold text-[#0052CC]">

            76%

          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-[#0052CC] h-4 rounded-full"
            style={{
              width: "76%",
            }}
          />

        </div>

      </div>
            {/* Main Content */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Section */}

        <div className="xl:col-span-2 space-y-6">

          {/* Recent Projects */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Recent Projects
            </h2>

            {[
              "Jira Clone",
              "HR Management",
              "CRM System",
              "ERP Dashboard",
            ].map((project, index) => (

              <div
                key={index}
                className="flex items-center justify-between py-4 border-b last:border-none"
              >

                <div>

                  <h3 className="font-semibold">
                    {project}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Active Project
                  </p>

                </div>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Running
                </span>

              </div>

            ))}

          </div>

          {/* Activity Timeline */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Recent Activity
            </h2>

            {[
              {
                title:
                  "Created Project 'CRM System'",
                time:
                  "2 Hours Ago",
              },
              {
                title:
                  "Added 3 Team Members",
                time:
                  "Yesterday",
              },
              {
                title:
                  "Workspace Updated",
                time:
                  "2 Days Ago",
              },
              {
                title:
                  "Sprint Started",
                time:
                  "3 Days Ago",
              },
            ].map((activity, index) => (

              <div
                key={index}
                className="flex gap-4 py-4 border-b last:border-none"
              >

                <div className="w-3 h-3 rounded-full bg-[#0052CC] mt-2"></div>

                <div>

                  <h4 className="font-semibold">
                    {activity.title}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {activity.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Right Sidebar */}

        <div className="space-y-6">

          {/* Workspace */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-bold mb-5">
              Workspace
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Total Workspaces
                </span>

                <span className="font-semibold">
                  {organization.workspaces}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Active Projects
                </span>

                <span className="font-semibold">
                  {organization.projects}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Members
                </span>

                <span className="font-semibold">
                  {organization.members}
                </span>

              </div>

            </div>

          </div>

          {/* Team Members */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-bold mb-5">
              Team Members
            </h2>

            {[1, 2, 3, 4].map((member) => (

              <div
                key={member}
                className="flex items-center gap-3 mb-4 last:mb-0"
              >

                <img
                  src={`https://i.pravatar.cc/100?img=${member + 20}`}
                  alt="member"
                  className="w-10 h-10 rounded-full"
                />

                <div>

                  <h4 className="font-medium">
                    Team Member {member}
                  </h4>

                  <p className="text-xs text-gray-500">
                    Developer
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* Organization Settings */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-bold mb-5">
              Quick Actions
            </h2>

            <div className="space-y-3">

              <button className="w-full bg-[#0052CC] text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Edit Organization
              </button>

              <button className="w-full border border-red-500 text-red-600 py-3 rounded-lg hover:bg-red-50 transition">
                Delete Organization
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrganizationDetails;