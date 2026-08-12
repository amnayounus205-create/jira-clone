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
  // STATES
  // ===========================

  const [organizations, setOrganizations] =
    useState(organizationData);

  const [open, setOpen] = useState(false);

  const [selectedOrganization, setSelectedOrganization] =
    useState(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 5;

  // ===========================
  // DELETE DIALOG
  // ===========================

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  const [deleteId, setDeleteId] = useState(null);

  // ===========================
  // SEARCH + FILTER
  // ===========================

  const filteredOrganizations = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return organizations.filter((organization) => {
      const matchSearch =
        !normalizedSearch ||
        organization.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        organization.key
          .toLowerCase()
          .includes(normalizedSearch) ||
        organization.owner
          .toLowerCase()
          .includes(normalizedSearch);

      const matchStatus =
        status === "All" ||
        organization.status === status;

      return matchSearch && matchStatus;
    });
  }, [organizations, search, status]);

  // ===========================
  // PAGINATION
  // ===========================

  const totalPages = Math.ceil(
    filteredOrganizations.length / perPage
  );

  const displayedOrganizations =
    filteredOrganizations.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

  // ===========================
  // CREATE
  // ===========================

  const handleCreate = () => {
    setSelectedOrganization(null);
    setOpen(true);
  };

  // ===========================
  // EDIT
  // ===========================

  const handleEdit = (organization) => {
    setSelectedOrganization(organization);
    setOpen(true);
  };

  // ===========================
  // VIEW DETAILS
  // ===========================

  const handleView = (id) => {
    navigate(`/organizations/${id}`);
  };

  // ===========================
  // DELETE
  // ===========================

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    setOrganizations((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );

    toast.success(
      "Organization Deleted Successfully"
    );

    setDeleteDialog(false);
    setDeleteId(null);

    setCurrentPage((page) => {
      const remainingItems =
        organizations.length - 1;

      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingItems / perPage)
      );

      return Math.min(page, newTotalPages);
    });
  };

  // ===========================
  // CREATE / UPDATE
  // ===========================

  const handleSubmit = (data) => {
    if (selectedOrganization) {
      setOrganizations((prev) =>
        prev.map((item) =>
          item.id === selectedOrganization.id
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

      setOrganizations((prev) => [
        ...prev,
        newOrganization,
      ]);

      toast.success(
        "Organization Created Successfully"
      );
    }

    setOpen(false);
    setSelectedOrganization(null);
  };

  // ===========================
  // RENDER
  // ===========================

  return (
    <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
      {/* ===========================
          HEADER
      =========================== */}

      <div
        className="
          flex
          min-w-0
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
          md:gap-5
        "
      >
        {/* TITLE */}

        <div className="min-w-0">
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-[#172B4D]
              sm:text-3xl
            "
          >
            Organizations
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              sm:text-base
            "
          >
            Manage all organizations and workspaces.
          </p>
        </div>

        {/* CREATE BUTTON */}

        <button
          type="button"
          onClick={handleCreate}
          className="
            flex
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#0052CC]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-blue-700
            active:scale-[0.98]
            md:w-auto
          "
        >
          <Plus size={18} />

          <span>
            Create Organization
          </span>
        </button>
      </div>

      {/* ===========================
          SEARCH + FILTER
      =========================== */}

      <div
        className="
          flex
          min-w-0
          flex-col
          gap-3
          sm:gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* SEARCH */}

        <div
          className="
            w-full
            min-w-0
            md:w-80
          "
        >
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* STATUS FILTER */}

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/10
            md:w-auto
            md:min-w-[150px]
          "
        >
          <option value="All">
            All
          </option>

          <option value="Planning">
            Planning
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>
      </div>

      {/* ===========================
          ORGANIZATION TABLE
      =========================== */}

      <div className="min-w-0 overflow-x-auto">
        <OrganizationTable
          organizations={displayedOrganizations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ===========================
          PAGINATION
      =========================== */}

      {totalPages > 1 && (
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-2
          "
        >
          {[...Array(totalPages)].map(
            (_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    setCurrentPage(pageNumber)
                  }
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      currentPage === pageNumber
                        ? "bg-[#0052CC] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  {pageNumber}
                </button>
              );
            }
          )}
        </div>
      )}

      {/* ===========================
          CREATE / EDIT MODAL
      =========================== */}

      <OrganizationModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedOrganization(null);
        }}
        onSubmit={handleSubmit}
        organization={selectedOrganization}
      />

      {/* ===========================
          DELETE CONFIRMATION
      =========================== */}

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Organization"
        description="Are you sure you want to delete this organization? This action cannot be undone."
        onCancel={() => {
          setDeleteDialog(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default OrganizationsModule;