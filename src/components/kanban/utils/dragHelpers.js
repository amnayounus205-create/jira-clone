import { arrayMove } from "@dnd-kit/sortable";

// Find issue

export const findIssue = (issues, id) =>
  issues.find((issue) => issue.id === id);

// Move issue to another column

export const moveIssue = (
  issues,
  issueId,
  newStatus
) => {
  return issues.map((issue) =>
    issue.id === issueId
      ? {
          ...issue,
          status: newStatus,
        }
      : issue
  );
};

// Reorder issues

export const reorderIssues = (
  issues,
  activeId,
  overId
) => {

  const oldIndex = issues.findIndex(
    (issue) => issue.id === activeId
  );

  const newIndex = issues.findIndex(
    (issue) => issue.id === overId
  );

  if (
    oldIndex === -1 ||
    newIndex === -1
  ) {
    return issues;
  }

  return arrayMove(
    issues,
    oldIndex,
    newIndex
  );

};