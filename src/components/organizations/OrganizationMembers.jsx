import {
  Plus,
  Search,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const initialMembers = [
  {
    id: 1,
    name: "Muhammad Ali",
    email: "ali@gmail.com",
    role: "Organization Admin",
    avatar: "https://i.pravatar.cc/100?img=11",
  },
  {
    id: 2,
    name: "Sarah Khan",
    email: "sarah@gmail.com",
    role: "Project Manager",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 3,
    name: "Ahmed Raza",
    email: "ahmed@gmail.com",
    role: "Developer",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
  {
    id: 4,
    name: "Fatima Noor",
    email: "fatima@gmail.com",
    role: "QA Tester",
    avatar: "https://i.pravatar.cc/100?img=20",
  },
];

const OrganizationMembers = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(initialMembers);

  const filteredMembers = members.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      member.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const removeMember = (id) => {
    setMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Organization Members
          </h2>
          <p className="text-gray-500">
            Manage all organization members
          </p>
        </div>

        <button className="bg-[#0052CC] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} />
          Add Member
        </button>

      </div>

      <div className="relative mb-6">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-lg py-3 pl-10 pr-4"
        />

      </div>

      <div className="space-y-4">

        {filteredMembers.map((member) => (

          <div
            key={member.id}
            className="flex justify-between items-center border rounded-xl p-4 hover:shadow-md transition"
          >

            <div className="flex items-center gap-4">

              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 rounded-full"
              />

              <div>

                <h3 className="font-semibold">
                  {member.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-500 text-sm">

                  <Mail size={14} />
                  {member.email}

                </div>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="flex items-center gap-2 text-[#0052CC]">

                <Shield size={16} />

                <span className="font-medium">
                  {member.role}
                </span>

              </div>

              <button
                onClick={() =>
                  removeMember(member.id)
                }
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default OrganizationMembers;