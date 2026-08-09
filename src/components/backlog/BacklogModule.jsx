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
  const [issues, setIssues] = useState(backlogIssues);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [deleteIssue, setDeleteIssue] = useState(null);

  const handleSprintChange = (issueId, newSprint) => {
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

    toast.success(`Issue moved to ${newSprint}`);
  };

  const handleCreateIssue = () => {
    setSelectedIssue(null);
    setIsIssueModalOpen(true);
  };

  const handleEditIssue = (issue) => {
    setSelectedIssue(issue);
    setIsIssueModalOpen(true);
  };

  const handleDeleteIssue = (issue) => {
    setDeleteIssue(issue);
  };

  const handleConfirmDelete = () => {
    if (!deleteIssue) return;

    setIssues((prev) =>
      prev.filter((issue) => issue.id !== deleteIssue.id)
    );

    toast.success("Issue deleted successfully");
    setDeleteIssue(null);
  };

  const handleIssueSubmit = (data) => {
    const selectedAssignee = ASSIGNEES.find(
      (user) => user.id === data.assignee
    );

    const selectedReporter = ASSIGNEES.find(
      (user) => user.id === data.reporter
    );

    const formattedLabels = data.labels
      ? data.labels
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean)
      : [];

    const parsedStoryPoints = data.storyPoints
      ? Number(data.storyPoints)
      : null;

    if (selectedIssue) {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === selectedIssue.id
            ? {
                ...issue,
                title: data.title,
                description: data.description || "",
                type: data.type,
                priority: data.priority,
                status: data.status,
                dueDate: data.dueDate || null,
                sprint: data.sprint,
                assignee: selectedAssignee || null,
                reporter: selectedReporter || null,
                labels: formattedLabels,
                storyPoints: parsedStoryPoints,
                epic: data.epic || null,
              }
            : issue
        )
      );

      toast.success("Issue updated successfully");
      setSelectedIssue(null);
      setIsIssueModalOpen(false);
      return;
    }

    const newIssue = {
      id: `ATL-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      type: data.type,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate || null,
      sprint: data.sprint,
      assignee: selectedAssignee || null,
      reporter: selectedReporter || null,
      labels: formattedLabels,
      storyPoints: parsedStoryPoints,
      epic: data.epic || null,
    };

    setIssues((prev) => [newIssue, ...prev]);
    toast.success("Issue created successfully");
    setIsIssueModalOpen(false);
  };

  const filteredIssues = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !normalizedSearch ||
        issue.title.toLowerCase().includes(normalizedSearch) ||
        issue.id.toLowerCase().includes(normalizedSearch) ||
        issue.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        issue.assignee?.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        issue.reporter?.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        issue.labels?.some((label) =>
          label.toLowerCase().includes(normalizedSearch)
        );

      const matchesType =
        filters.type === "All" ||
        issue.type === filters.type;

      const matchesPriority =
        filters.priority === "All" ||
        issue.priority === filters.priority;

      const matchesStatus =
        filters.status === "All" ||
        issue.status === filters.status;

      const matchesAssignee =
        filters.assignee === "All" ||
        issue.assignee?.id === filters.assignee;

      const matchesSprint =
        filters.sprint === "All" ||
        issue.sprint === filters.sprint;

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

  return (
    <div className="w-full min-w-0 space-y-5 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172B4D] dark:text-white">
            Backlog
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Prioritise work and assign issues to sprints.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateIssue}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0052CC] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Create Issue
        </button>
      </div>

      <div className="w-full min-w-0">
        <BacklogFilters
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {filteredIssues.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {issues.length}
          </span>{" "}
          issues
        </p>

        {search.trim() && (
          <p className="max-w-full truncate text-xs text-slate-400">
            Search: "{search}"
          </p>
        )}
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        <BacklogList
          issues={filteredIssues}
          onSprintChange={handleSprintChange}
          onEdit={handleEditIssue}
          onDelete={handleDeleteIssue}
        />
      </div>

      <IssueModal
        open={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedIssue(null);
        }}
        onSubmit={handleIssueSubmit}
        issue={selectedIssue}
      />

      <ConfirmDialog
        open={Boolean(deleteIssue)}
        title="Delete Issue"
        message={
          deleteIssue
            ? `Are you sure you want to delete "${deleteIssue.title}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIssue(null)}
      />
    </div>
  );
};

export default BacklogModule;