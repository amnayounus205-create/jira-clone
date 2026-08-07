import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import OrganizationTable from "./OrganizationTable";
import OrganizationModal from "./OrganizationModal";
import { organizationData } from "./organizationData";

import SearchInput from "../ui/SearchInput";
import ConfirmDialog from "../ui/ConfirmDialog";

const OrganizationsModule = () => {
  const navigate = useNavigate();

  // ===========================
  // States
  // ===========================

  const [organizations, setOrganizations] =
    useState(organizationData);

  const [open, setOpen] =
    useState(false);

  const [selectedOrganization, setSelectedOrganization] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const perPage = 5;

  // Delete Dialog

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  // ===========================
  // Search + Filter
  // ===========================

  const filteredOrganizations =
    useMemo(() => {
      return organizations.filter(
        (organization) => {
          const matchSearch =
            organization.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            organization.key
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            organization.owner
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchStatus =
            status === "All" ||
            organization.status ===
              status;

          return (
            matchSearch &&
            matchStatus
          );
        }
      );
    }, [
      organizations,
      search,
      status,
    ]);

  // ===========================
  // Pagination
  // ===========================

  const totalPages =
    Math.ceil(
      filteredOrganizations.length /
        perPage
    );

  const displayedOrganizations =
    filteredOrganizations.slice(
      (currentPage - 1) *
        perPage,
      currentPage * perPage
    );

  // ===========================
  // Create
  // ===========================

  const handleCreate = () => {
    setSelectedOrganization(
      null
    );

    setOpen(true);
  };

  // ===========================
  // Edit
  // ===========================

  const handleEdit = (
    organization
  ) => {
    setSelectedOrganization(
      organization
    );

    setOpen(true);
  };

  // ===========================
  // View Details
  // ===========================

  const handleView = (id) => {
    navigate(
      `/organizations/${id}`
    );
  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    setOrganizations((prev) =>
      prev.filter(
        (item) =>
          item.id !== deleteId
      )
    );

    toast.success(
      "Organization Deleted Successfully"
    );

    setDeleteDialog(false);
  };

  // ===========================
  // Create / Update
  // ===========================

  const handleSubmit = (
    data
  ) => {
    if (
      selectedOrganization
    ) {
      setOrganizations(
        (prev) =>
          prev.map((item) =>
            item.id ===
            selectedOrganization.id
              ? {
                  ...item,
                  ...data,
                }
              : item
          )
      );

      toast.success(
        "Organization Updated Successfully"
      );
    } else {
      const newOrganization = {
        id: Date.now(),

        members: 0,

        projects: 0,

        workspaces: 1,

        avatar:
          "https://i.pravatar.cc/100",

        ...data,
      };

      setOrganizations(
        (prev) => [
          ...prev,
          newOrganization,
        ]
      );

      toast.success(
        "Organization Created Successfully"
      );
    }

    setOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-5">

        <div>

          <h1 className="text-3xl font-bold text-[#172B4D]">
            Organizations
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all organizations
            and workspaces.
          </p>

        </div>

        <button
          onClick={handleCreate}
          className="bg-[#0052CC] hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />

          Create Organization
        </button>

      </div>

      {/* Search + Filter */}

      <div className="flex flex-col md:flex-row gap-4 justify-between">

        <div className="w-full md:w-80">

          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setCurrentPage(1);
            }}
          />

        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(
              e.target.value
            );

            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-3"
        >
          <option>
            All
          </option>

          <option>
            Planning
          </option>

          <option>
            Active
          </option>

          <option>
            Completed
          </option>

        </select>

      </div>
            {/* Organization Table */}

      <OrganizationTable
        organizations={displayedOrganizations}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">

          {[...Array(totalPages)].map((_, index) => (

            <button
              key={index}
              onClick={() =>
                setCurrentPage(index + 1)
              }
              className={`w-10 h-10 rounded-lg transition ${
                currentPage === index + 1
                  ? "bg-[#0052CC] text-white"
                  : "border bg-white hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>

          ))}

        </div>
      )}

      {/* Create / Edit Modal */}

      <OrganizationModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        organization={selectedOrganization}
      />

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Organization"
        description="Are you sure you want to delete this organization? This action cannot be undone."
        onCancel={() =>
          setDeleteDialog(false)
        }
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default OrganizationsModule;