import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import BacklogFilters from "./BacklogFilters";
import BacklogList from "./BacklogList";
import IssueModal from "./IssueModal";
import ConfirmDialog from "../ui/ConfirmDialog";

import { backlogIssues } from "./backlogData";
import { ASSIGNEES } from "./backlogConstants";

const initialFilters = {
  type: "All",
  priority: "All",
  status: "All",
  assignee: "All",
  sprint: "All",
};

const BacklogModule = () => {
  // ==========================
  // Issues
  // ==========================

  const [issues, setIssues] =
    useState(backlogIssues);

  // ==========================
  // Search
  // ==========================

  const [search, setSearch] =
    useState("");

  // ==========================
  // Filters
  // ==========================

  const [filters, setFilters] =
    useState(initialFilters);

  // ==========================
  // Issue Modal
  // ==========================

  const [
    isIssueModalOpen,
    setIsIssueModalOpen,
  ] = useState(false);

  const [
    selectedIssue,
    setSelectedIssue,
  ] = useState(null);

  // ==========================
  // Delete Dialog
  // ==========================

  const [
    deleteIssue,
    setDeleteIssue,
  ] = useState(null);

  // ==========================
  // Sprint Change
  // ==========================

  const handleSprintChange = (
    issueId,
    newSprint
  ) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              sprint: newSprint,
            }
          : issue
      )
    );

    toast.success(
      `Issue moved to ${newSprint}`
    );
  };

  // ==========================
  // Create Issue
  // ==========================

  const handleCreateIssue = () => {
    setSelectedIssue(null);
    setIsIssueModalOpen(true);
  };

  // ==========================
  // Edit Issue
  // ==========================

  const handleEditIssue = (issue) => {
    setSelectedIssue(issue);
    setIsIssueModalOpen(true);
  };

  // ==========================
  // Delete Issue
  // ==========================

  const handleDeleteIssue = (issue) => {
    setDeleteIssue(issue);
  };

  // ==========================
  // Confirm Delete
  // ==========================

  const handleConfirmDelete = () => {
    if (!deleteIssue) return;

    setIssues((prev) =>
      prev.filter(
        (issue) =>
          issue.id !== deleteIssue.id
      )
    );

    toast.success(
      "Issue deleted successfully"
    );

    setDeleteIssue(null);
  };

  // ==========================
  // Create / Update Issue
  // ==========================

  const handleIssueSubmit = (data) => {
    const selectedAssignee =
      ASSIGNEES.find(
        (user) =>
          user.id === data.assignee
      );

    const selectedReporter =
      ASSIGNEES.find(
        (user) =>
          user.id === data.reporter
      );

    // ==========================
    // Update Existing Issue
    // ==========================

    if (selectedIssue) {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === selectedIssue.id
            ? {
                ...issue,

                title: data.title,

                description:
                  data.description || "",

                type: data.type,

                priority:
                  data.priority,

                status: data.status,

                dueDate:
                  data.dueDate || null,

                sprint: data.sprint,

                assignee:
                  selectedAssignee ||
                  null,

                reporter:
                  selectedReporter ||
                  null,

                labels: data.labels
                  ? data.labels
                      .split(",")
                      .map((label) =>
                        label.trim()
                      )
                      .filter(Boolean)
                  : [],

                storyPoints:
                  data.storyPoints
                    ? Number(
                        data.storyPoints
                      )
                    : null,

                epic:
                  data.epic || null,
              }
            : issue
        )
      );

      toast.success(
        "Issue updated successfully"
      );

      setSelectedIssue(null);
      setIsIssueModalOpen(false);

      return;
    }

    // ==========================
    // Create New Issue
    // ==========================

    const newIssue = {
      id: `ATL-${Date.now()}`,

      title: data.title,

      description:
        data.description || "",

      type: data.type,

      priority: data.priority,

      status: data.status,

      dueDate:
        data.dueDate || null,

      sprint: data.sprint,

      assignee:
        selectedAssignee || null,

      reporter:
        selectedReporter || null,

      labels: data.labels
        ? data.labels
            .split(",")
            .map((label) =>
              label.trim()
            )
            .filter(Boolean)
        : [],

      storyPoints:
        data.storyPoints
          ? Number(data.storyPoints)
          : null,

      epic: data.epic || null,
    };

    setIssues((prev) => [
      newIssue,
      ...prev,
    ]);

    toast.success(
      "Issue created successfully"
    );

    setIsIssueModalOpen(false);
  };

  // ==========================
  // Search + Filters
  // ==========================

  const filteredIssues = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !normalizedSearch ||
        issue.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        issue.id
          .toLowerCase()
          .includes(normalizedSearch) ||
        issue.labels?.some((label) =>
          label
            .toLowerCase()
            .includes(
              normalizedSearch
            )
        );

      const matchesType =
        filters.type === "All" ||
        issue.type === filters.type;

      const matchesPriority =
        filters.priority === "All" ||
        issue.priority ===
          filters.priority;

      const matchesStatus =
        filters.status === "All" ||
        issue.status ===
          filters.status;

      const matchesAssignee =
        filters.assignee === "All" ||
        issue.assignee?.id ===
          filters.assignee;

      const matchesSprint =
        filters.sprint === "All" ||
        issue.sprint ===
          filters.sprint;

      return (
        matchesSearch &&
        matchesType &&
        matchesPriority &&
        matchesStatus &&
        matchesAssignee &&
        matchesSprint
      );
    });
  }, [issues, search, filters]);

  // ==========================
  // Render
  // ==========================

  return (
    <div className="space-y-5">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-[#172B4D]">
            Backlog
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Prioritise work and assign
            issues to sprints.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateIssue}
          className="w-fit flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition"
        >
          <Plus size={18} />

          Create Issue
        </button>
      </div>

      {/* ==========================
          Filters
      ========================== */}

      <BacklogFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
      />

      {/* ==========================
          Result Count
      ========================== */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredIssues.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {issues.length}
          </span>{" "}
          issues
        </p>
      </div>

      {/* ==========================
          Issues
      ========================== */}

      <BacklogList
        issues={filteredIssues}
        onSprintChange={
          handleSprintChange
        }
        onEdit={handleEditIssue}
        onDelete={handleDeleteIssue}
      />

      {/* ==========================
          Create / Edit Modal
      ========================== */}

      <IssueModal
        open={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedIssue(null);
        }}
        onSubmit={handleIssueSubmit}
        issue={selectedIssue}
      />

      {/* ==========================
          Delete Confirmation
      ========================== */}

      <ConfirmDialog
        open={Boolean(deleteIssue)}
        title="Delete Issue"
        message={
          deleteIssue
            ? `Are you sure you want to delete "${deleteIssue.title}"? This action cannot be undone.`
            : ""
        }
        onConfirm={
          handleConfirmDelete
        }
        onCancel={() =>
          setDeleteIssue(null)
        }
      />
    </div>
  );
};

export default BacklogModule;

