// useKanban.js

import { useState } from "react";
import { boardIssues } from "../data/boardData";

const useKanban = () => {

  const [issues, setIssues] = useState(boardIssues);

  const [
    activeIssue,
    setActiveIssue,
  ] = useState(null);

  // Create Modal

  const [
    isCreateOpen,
    setIsCreateOpen,
  ] = useState(false);

  const [
    defaultStatus,
    setDefaultStatus,
  ] = useState("todo");

  // Open Modal

  const openCreateModal = (
    status = "todo"
  ) => {

    setDefaultStatus(status);
    setIsCreateOpen(true);

  };

  // Close Modal

  const closeCreateModal = () => {

    setIsCreateOpen(false);

  };

  // Create Issue

  const createIssue = (
    issue
  ) => {

    const newIssue = {
      comments: 0,
      attachments: 0,
      labels: [],
      ...issue,
    };

    setIssues((prev) => {

      const updated = [
        newIssue,
        ...prev,
      ];

      return updated;

    });

    setIsCreateOpen(false);

  };

  // Delete Issue

  const deleteIssue = (
    id
  ) => {

    setIssues((prev) =>
      prev.filter(
        (issue) =>
          issue.id !== id
      )
    );

  };

  // Update Issue

  const updateIssue = (
    updatedIssue
  ) => {

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id ===
        updatedIssue.id
          ? {
              ...updatedIssue,
            }
          : issue
      )
    );

  };

  return {

    issues,
    setIssues,

    activeIssue,
    setActiveIssue,

    isCreateOpen,
    openCreateModal,
    closeCreateModal,

    defaultStatus,

    createIssue,
    deleteIssue,
    updateIssue,

  };

};

export default useKanban;