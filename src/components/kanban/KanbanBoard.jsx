import { useMemo, useState } from "react";

import {
  DndContext,
  PointerSensor,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
} from "@dnd-kit/sortable";

import BoardHeader from "./BoardHeader";
import BoardStats from "./BoardStats";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import IssueDetailsDrawer from "./IssueDetailsDrawer";
import CreateIssueModal from "./CreateIssueModal";

import { boardColumns } from "./data/boardData";

import useKanban from "./hooks/useKanban";

import {
  findIssue,
} from "./utils/dragHelpers";

const KanbanBoard = () => {

  const {
    issues,
    setIssues,
    activeIssue,
    setActiveIssue,
    isCreateOpen,
    openCreateModal,
    closeCreateModal,
    defaultStatus,
    createIssue,
  } = useKanban();

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [assignee, setAssignee] = useState("All");
  const [sprint, setSprint] = useState("All");

  const [
    selectedIssue,
    setSelectedIssue,
  ] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const filteredIssues =
    useMemo(() => {

      return issues.filter(
        (issue) => {

          const matchesSearch =
            issue.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            issue.id
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesPriority =
            priority === "All" ||
            issue.priority ===
              priority;

          const matchesAssignee =
            assignee === "All" ||
            issue.assignee ===
              assignee;

          const matchesSprint =
            sprint === "All" ||
            issue.sprint ===
              sprint;

          return (
            matchesSearch &&
            matchesPriority &&
            matchesAssignee &&
            matchesSprint
          );

        }
      );

    }, [
      issues,
      search,
      priority,
      assignee,
      sprint,
    ]);

  const handleCreateIssue = (
    status = "todo"
  ) => {
    openCreateModal(status);
  };

  const handleOpenIssue = (
    issue
  ) => {
    setSelectedIssue(issue);
  };

  const handleCloseIssue =
    () => {
      setSelectedIssue(null);
    };

  const handleDragStart = ({
    active,
  }) => {

    setActiveIssue(
      findIssue(
        issues,
        active.id
      )
    );

  };

  const handleDragEnd = ({
    active,
    over,
  }) => {

    setActiveIssue(null);

    if (!over) return;

    const activeIssue =
      issues.find(
        (i) =>
          i.id === active.id
      );

    if (!activeIssue) return;

    const targetColumn =
      boardColumns.find(
        (c) =>
          c.id === over.id
      );

    if (targetColumn) {

      setIssues((prev) =>
        prev.map((issue) =>
          issue.id ===
          active.id
            ? {
                ...issue,
                status:
                  targetColumn.id,
              }
            : issue
        )
      );

      return;

    }

    const overIssue =
      issues.find(
        (i) =>
          i.id === over.id
      );

    if (!overIssue) return;

    const oldIndex =
      issues.findIndex(
        (i) =>
          i.id === active.id
      );

    const newIndex =
      issues.findIndex(
        (i) =>
          i.id === over.id
      );

    const updated = [
      ...issues,
    ];

    updated[oldIndex] = {
      ...updated[oldIndex],
      status:
        overIssue.status,
    };

    setIssues(
      arrayMove(
        updated,
        oldIndex,
        newIndex
      )
    );

  };

  return (

    <div className="space-y-6 h-full flex flex-col">

      <BoardHeader
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        assignee={assignee}
        setAssignee={setAssignee}
        sprint={sprint}
        setSprint={setSprint}
        onCreateIssue={
          handleCreateIssue
        }
      />

      <BoardStats
        issues={filteredIssues}
      />

      <div className="flex-1 overflow-hidden">

        <DndContext
          sensors={sensors}
          collisionDetection={
            closestCorners
          }
          onDragStart={
            handleDragStart
          }
          onDragEnd={
            handleDragEnd
          }
        >

          <div
            className="
              h-full
              flex
              gap-5
              overflow-x-auto
              overflow-y-hidden
              pb-4
              px-1
            "
          >

            {boardColumns.map(
              (column) => {

                const columnIssues =
                  filteredIssues.filter(
                    (issue) =>
                      issue.status ===
                      column.id
                  );

                return (

                  <KanbanColumn
                    key={column.id}
                    column={column}
                    issues={columnIssues}
                    onCreateIssue={
                      handleCreateIssue
                    }
                    onOpenIssue={
                      handleOpenIssue
                    }
                  />

                );

              }
            )}

          </div>

          <DragOverlay>

            {activeIssue ? (

              <div className="w-[340px] rotate-2 pointer-events-none">

                <KanbanCard
                  issue={activeIssue}
                  onOpen={() => {}}
                />

              </div>

            ) : null}

          </DragOverlay>

        </DndContext>

      </div>

      <IssueDetailsDrawer
        open={
          !!selectedIssue
        }
        issue={selectedIssue}
        onClose={
          handleCloseIssue
        }
      />

      <CreateIssueModal
        open={isCreateOpen}
        onClose={
          closeCreateModal
        }
        onSave={createIssue}
        defaultStatus={
          defaultStatus
        }
      />

    </div>

  );

};

export default KanbanBoard;