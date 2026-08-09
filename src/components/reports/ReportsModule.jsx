import React, { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Users,
  Clock3,
  FileText,
  Download,
  FileSpreadsheet,
  FileDown,
  Activity,
  CheckCircle2,
  Target,
  Zap,
} from "lucide-react";

import { backlogIssues } from "../backlog/backlogData";

const formatNumber = (value) =>
  Number(value || 0).toLocaleString();

const getIssuePoints = (issue) =>
  Number(issue.storyPoints || issue.points || 0);

const getIssueHours = (issue) =>
  Number(
    issue.loggedHours ||
      issue.timeSpent ||
      issue.hoursLogged ||
      0
  );

const getAssigneeName = (issue) =>
  issue.assigneeName ||
  issue.assignee ||
  "Unassigned";

const sprintData = [
  {
    id: "ATL Sprint 13",
    goal: "Billing polish",
    start: "09 Aug 2026",
    end: "23 Aug 2026",
    committed: 42,
    completed: 36,
    issues: 12,
    completedIssues: 10,
  },
  {
    id: "ATL Sprint 12",
    goal: "Dashboard improvements",
    start: "25 Jul 2026",
    end: "08 Aug 2026",
    committed: 38,
    completed: 32,
    issues: 11,
    completedIssues: 9,
  },
  {
    id: "ATL Sprint 11",
    goal: "Auth hardening",
    start: "11 Jul 2026",
    end: "24 Jul 2026",
    committed: 35,
    completed: 35,
    issues: 10,
    completedIssues: 10,
  },
  {
    id: "ATL Sprint 10",
    goal: "Platform cleanup",
    start: "27 Jun 2026",
    end: "10 Jul 2026",
    committed: 40,
    completed: 34,
    issues: 13,
    completedIssues: 11,
  },
];

const teamData = [
  {
    name: "Ayesha Khan",
    initials: "AK",
    assigned: 12,
    completed: 10,
    hours: 42,
  },
  {
    name: "Daniel Ross",
    initials: "DR",
    assigned: 10,
    completed: 8,
    hours: 36,
  },
  {
    name: "Mei Lin",
    initials: "ML",
    assigned: 9,
    completed: 8,
    hours: 34,
  },
  {
    name: "Omar Farouk",
    initials: "OF",
    assigned: 8,
    completed: 7,
    hours: 31,
  },
  {
    name: "Daniel Noor",
    initials: "DN",
    assigned: 7,
    completed: 6,
    hours: 28,
  },
  {
    name: "John Williams",
    initials: "JW",
    assigned: 6,
    completed: 5,
    hours: 25,
  },
];

const downloadCSV = (filename, rows) => {
  if (!rows || rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";

          return `"${String(value)
            .replace(/"/g, '""')
            .replace(/\n/g, " ")}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const downloadExcel = (filename, rows) => {
  if (!rows || rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);

  const tableRows = rows
    .map(
      (row) => `
        <tr>
          ${headers
            .map(
              (header) =>
                `<td>${String(row[header] ?? "")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")}</td>`
            )
            .join("")}
        </tr>
      `
    )
    .join("");

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const downloadPDF = (title, content) => {
  const printWindow = window.open(
    "",
    "_blank",
    "width=1000,height=800"
  );

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            color: #0f172a;
          }

          h1 {
            margin-bottom: 4px;
          }

          .muted {
            color: #64748b;
            margin-bottom: 24px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th,
          td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #f8fafc;
          }

          .card {
            display: inline-block;
            min-width: 180px;
            margin: 0 10px 10px 0;
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 300);
};

function ProgressBar({
  value,
  max,
  label,
  showValue = true,
}) {
  const percentage =
    max > 0
      ? Math.min((value / max) * 100, 100)
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>

        {showValue && (
          <span className="text-xs font-bold text-slate-700">
            {value}
          </span>
        )}
      </div>

      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-blue-50 text-blue-600",
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {value}
          </p>

          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function BurndownChart() {
  const data = [
    42,
    38,
    34,
    31,
    27,
    23,
    18,
    14,
    9,
    5,
    0,
  ];

  const max = Math.max(...data);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Burndown
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Remaining story points during the sprint
          </p>
        </div>

        <TrendingDown
          size={18}
          className="text-blue-600"
        />
      </div>

      <div className="h-64 flex items-end gap-2 mt-5">
        {data.map((value, index) => {
          const height =
            max > 0 ? (value / max) * 100 : 0;

          return (
            <div
              key={index}
              className="flex-1 h-full flex flex-col justify-end items-center gap-2"
            >
              <span className="text-[9px] text-slate-400">
                {value}
              </span>

              <div
                className="w-full max-w-[32px] bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all"
                style={{
                  height: `${height}%`,
                }}
              />

              <span className="text-[9px] text-slate-400">
                D{index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BurnupChart() {
  const completed = [
    0,
    4,
    8,
    13,
    18,
    23,
    29,
    34,
    38,
    40,
    42,
  ];

  const scope = [
    42,
    42,
    42,
    44,
    46,
    46,
    48,
    48,
    48,
    48,
    48,
  ];

  const max = Math.max(...scope);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Burnup
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Completed work vs total scope
          </p>
        </div>

        <TrendingUp
          size={18}
          className="text-emerald-600"
        />
      </div>

      <div className="h-64 flex items-end gap-2 mt-5">
        {scope.map((scopeValue, index) => {
          const completedValue = completed[index];

          return (
            <div
              key={index}
              className="flex-1 h-full flex flex-col justify-end items-center gap-1"
            >
              <div className="relative w-full max-w-[32px] h-full flex items-end">
                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-slate-200"
                  style={{
                    height: `${(scopeValue / max) * 100}%`,
                  }}
                />

                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-emerald-500"
                  style={{
                    height: `${(completedValue / max) * 100}%`,
                  }}
                />
              </div>

              <span className="text-[9px] text-slate-400">
                D{index + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-5 mt-5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          Completed
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-200" />
          Scope
        </div>
      </div>
    </div>
  );
}

function VelocityReport() {
  const max = Math.max(
    ...sprintData.map((sprint) => sprint.completed)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Velocity
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Story points completed per sprint
          </p>
        </div>

        <Zap
          size={18}
          className="text-amber-500"
        />
      </div>

      <div className="space-y-4 mt-5">
        {sprintData.map((sprint) => (
          <ProgressBar
            key={sprint.id}
            label={sprint.id}
            value={sprint.completed}
            max={max}
          />
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Average velocity
        </p>

        <p className="text-xl font-bold text-slate-900 mt-1">
          {Math.round(
            sprintData.reduce(
              (sum, sprint) =>
                sum + sprint.completed,
              0
            ) / sprintData.length
          )}{" "}
          points
        </p>
      </div>
    </div>
  );
}

function SprintReport() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">
          Sprint Report
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Sprint commitment and delivery history
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">
                Sprint
              </th>

              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">
                Goal
              </th>

              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">
                Committed
              </th>

              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">
                Completed
              </th>

              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">
                Completion
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sprintData.map((sprint) => {
              const percentage = Math.round(
                (sprint.completed /
                  sprint.committed) *
                  100
              );

              return (
                <tr
                  key={sprint.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-blue-600">
                      {sprint.id}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {sprint.start} → {sprint.end}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">
                    {sprint.goal}
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                    {sprint.committed}
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-emerald-600">
                    {sprint.completed}
                  </td>

                  <td className="px-5 py-4 min-w-[160px]">
                    <ProgressBar
                      value={percentage}
                      max={100}
                      label={`${percentage}%`}
                      showValue={false}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkloadReport() {
  const max = Math.max(
    ...teamData.map((member) => member.assigned)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Workload
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Assigned issues across the team
          </p>
        </div>

        <Users
          size={18}
          className="text-blue-600"
        />
      </div>

      <div className="space-y-4 mt-5">
        {teamData.map((member) => (
          <div key={member.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">
                  {member.initials}
                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {member.name}
                </span>
              </div>

              <span className="text-xs font-bold text-slate-600">
                {member.assigned} issues
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${
                    (member.assigned / max) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductivityReport() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">
          Team Productivity
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Completion and delivery performance
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {teamData.map((member) => {
          const percentage = Math.round(
            (member.completed / member.assigned) *
              100
          );

          return (
            <div
              key={member.name}
              className="p-4 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                {member.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <p className="text-xs font-bold text-slate-800">
                    {member.name}
                  </p>

                  <span className="text-xs font-bold text-emerald-600">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-slate-400 mt-1">
                  {member.completed} completed of{" "}
                  {member.assigned} assigned
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeTrackingReport() {
  const totalHours = teamData.reduce(
    (sum, member) => sum + member.hours,
    0
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Time Tracking
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Logged work by team member
          </p>
        </div>

        <Clock3
          size={18}
          className="text-purple-600"
        />
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Total logged
            </p>

            <p className="text-xl font-bold text-slate-900 mt-1">
              {totalHours}h
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Team members
            </p>

            <p className="text-xl font-bold text-slate-900 mt-1">
              {teamData.length}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Avg / person
            </p>

            <p className="text-xl font-bold text-slate-900 mt-1">
              {Math.round(
                totalHours / teamData.length
              )}
              h
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {teamData.map((member) => (
            <div key={member.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  {member.name}
                </span>

                <span className="text-xs font-bold text-slate-700">
                  {member.hours}h
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${
                      (member.hours / totalHours) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IssueSummary({ issues }) {
  const total = issues.length;

  const done = issues.filter(
    (issue) => issue.status === "Done"
  ).length;

  const inProgress = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const testing = issues.filter(
    (issue) => issue.status === "Testing"
  ).length;

  const totalPoints = issues.reduce(
    (sum, issue) =>
      sum + getIssuePoints(issue),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Issues"
        value={formatNumber(total)}
        subtitle="All report issues"
        icon={FileText}
        iconClass="bg-blue-50 text-blue-600"
      />

      <StatCard
        title="Completed"
        value={formatNumber(done)}
        subtitle="Done issues"
        icon={CheckCircle2}
        iconClass="bg-emerald-50 text-emerald-600"
      />

      <StatCard
        title="In Progress"
        value={formatNumber(
          inProgress + testing
        )}
        subtitle="Active work"
        icon={Activity}
        iconClass="bg-amber-50 text-amber-600"
      />

      <StatCard
        title="Story Points"
        value={formatNumber(totalPoints)}
        subtitle="Total scope"
        icon={Target}
        iconClass="bg-purple-50 text-purple-600"
      />
    </div>
  );
}

export default function ReportsModule() {
  const [activeReport, setActiveReport] =
    useState("overview");

  const [selectedSprint, setSelectedSprint] =
    useState("ATL Sprint 13");

  const issues = Array.isArray(backlogIssues)
    ? backlogIssues
    : [];

  const reportIssues = useMemo(() => {
    if (!issues.length) {
      return [];
    }

    return issues;
  }, [issues]);

  const reportRows = useMemo(() => {
    return reportIssues.map((issue) => ({
      Issue: issue.id,
      Title: issue.title,
      Status: issue.status,
      Assignee: getAssigneeName(issue),
      Priority: issue.priority || "",
      StoryPoints: getIssuePoints(issue),
      LoggedHours: getIssueHours(issue),
      Sprint: issue.sprint || "Backlog",
    }));
  }, [reportIssues]);

  const teamRows = teamData.map((member) => ({
    Member: member.name,
    Assigned: member.assigned,
    Completed: member.completed,
    Completion:
      Math.round(
        (member.completed / member.assigned) *
          100
      ) + "%",
    LoggedHours: member.hours,
  }));

  const sprintRows = sprintData.map(
    (sprint) => ({
      Sprint: sprint.id,
      Goal: sprint.goal,
      Start: sprint.start,
      End: sprint.end,
      Committed: sprint.committed,
      Completed: sprint.completed,
      Issues: sprint.issues,
      CompletedIssues:
        sprint.completedIssues,
    })
  );

  const handleCSVExport = () => {
    downloadCSV(
      "jira-report.csv",
      reportRows.length
        ? reportRows
        : sprintRows
    );
  };

  const handleExcelExport = () => {
    downloadExcel(
      "jira-report.xls",
      reportRows.length
        ? reportRows
        : sprintRows
    );
  };

  const handlePDFExport = () => {
    const completedCount = reportIssues.filter(
      (issue) => issue.status === "Done"
    ).length;

    const totalPoints = reportIssues.reduce(
      (sum, issue) =>
        sum + getIssuePoints(issue),
      0
    );

    const html = `
      <h1>Jira Project Report</h1>

      <p class="muted">
        Generated on ${new Date().toLocaleDateString()}
      </p>

      <div class="card">
        <strong>Total Issues</strong>
        <br />
        ${reportIssues.length}
      </div>

      <div class="card">
        <strong>Completed</strong>
        <br />
        ${completedCount}
      </div>

      <div class="card">
        <strong>Story Points</strong>
        <br />
        ${totalPoints}
      </div>

      <h2>Team Productivity</h2>

      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Assigned</th>
            <th>Completed</th>
            <th>Completion</th>
            <th>Hours</th>
          </tr>
        </thead>

        <tbody>
          ${teamRows
            .map(
              (row) => `
                <tr>
                  <td>${row.Member}</td>
                  <td>${row.Assigned}</td>
                  <td>${row.Completed}</td>
                  <td>${row.Completion}</td>
                  <td>${row.LoggedHours}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <h2>Sprint Report</h2>

      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Goal</th>
            <th>Committed</th>
            <th>Completed</th>
          </tr>
        </thead>

        <tbody>
          ${sprintRows
            .map(
              (row) => `
                <tr>
                  <td>${row.Sprint}</td>
                  <td>${row.Goal}</td>
                  <td>${row.Committed}</td>
                  <td>${row.Completed}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    downloadPDF(
      "Jira Project Report",
      html
    );
  };

  const reports = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      id: "burndown",
      label: "Burndown",
      icon: TrendingDown,
    },
    {
      id: "burnup",
      label: "Burnup",
      icon: TrendingUp,
    },
    {
      id: "velocity",
      label: "Velocity",
      icon: Zap,
    },
    {
      id: "sprint",
      label: "Sprint Report",
      icon: Target,
    },
    {
      id: "workload",
      label: "Workload",
      icon: Users,
    },
    {
      id: "productivity",
      label: "Team Productivity",
      icon: Activity,
    },
    {
      id: "time",
      label: "Time Tracking",
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reports
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Track sprint performance, team workload,
            velocity and project progress.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCSVExport}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
          >
            <Download size={14} />
            CSV
          </button>

          <button
            type="button"
            onClick={handleExcelExport}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet size={14} />
            Excel
          </button>

          <button
            type="button"
            onClick={handlePDFExport}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <FileDown size={14} />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">
            Sprint
          </label>

          <select
            value={selectedSprint}
            onChange={(e) =>
              setSelectedSprint(e.target.value)
            }
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            {sprintData.map((sprint) => (
              <option
                key={sprint.id}
                value={sprint.id}
              >
                {sprint.id}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-slate-400">
          Showing report data for{" "}
          <span className="font-semibold text-slate-600">
            {selectedSprint}
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {reports.map((report) => {
            const Icon = report.icon;
            const active =
              activeReport === report.id;

            return (
              <button
                key={report.id}
                type="button"
                onClick={() =>
                  setActiveReport(report.id)
                }
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={14} />
                {report.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeReport === "overview" && (
        <div className="space-y-5">
          <IssueSummary
            issues={reportIssues}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <BurndownChart />
            <BurnupChart />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <VelocityReport />
            <WorkloadReport />
          </div>
        </div>
      )}

      {activeReport === "burndown" && (
        <div className="space-y-5">
          <IssueSummary
            issues={reportIssues}
          />

          <BurndownChart />

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Burndown Summary
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              The team started with 42 story points
              and progressively reduced the remaining
              scope.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <StatCard
                title="Starting Scope"
                value="42"
                subtitle="Story points"
                icon={Target}
              />

              <StatCard
                title="Remaining"
                value="5"
                subtitle="Story points"
                icon={TrendingDown}
              />

              <StatCard
                title="Completed"
                value="37"
                subtitle="Story points"
                icon={CheckCircle2}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Progress"
                value="88%"
                subtitle="Sprint completion"
                icon={Activity}
                iconClass="bg-purple-50 text-purple-600"
              />
            </div>
          </div>
        </div>
      )}

      {activeReport === "burnup" && (
        <div className="space-y-5">
          <BurnupChart />

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Burnup Summary
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Track how completed work grows while
              project scope changes over time.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
              <StatCard
                title="Total Scope"
                value="48"
                subtitle="Current points"
                icon={Target}
              />

              <StatCard
                title="Completed"
                value="42"
                subtitle="Delivered points"
                icon={CheckCircle2}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Remaining"
                value="6"
                subtitle="Points remaining"
                icon={TrendingUp}
                iconClass="bg-purple-50 text-purple-600"
              />
            </div>
          </div>
        </div>
      )}

      {activeReport === "velocity" && (
        <div className="space-y-5">
          <VelocityReport />

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Velocity History
            </h3>

            <div className="mt-5 space-y-4">
              {sprintData.map((sprint) => (
                <div
                  key={sprint.id}
                  className="flex items-center gap-4"
                >
                  <div className="w-32 shrink-0">
                    <p className="text-xs font-semibold text-slate-700">
                      {sprint.id}
                    </p>
                  </div>

                  <div className="flex-1">
                    <ProgressBar
                      value={sprint.completed}
                      max={45}
                      label=""
                      showValue={false}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-700 w-16 text-right">
                    {sprint.completed} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeReport === "sprint" && (
        <div className="space-y-5">
          <SprintReport />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="Commitment"
              value="155"
              subtitle="Across 4 sprints"
              icon={Target}
            />

            <StatCard
              title="Delivered"
              value="137"
              subtitle="Story points"
              icon={CheckCircle2}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Completion"
              value="88%"
              subtitle="Average delivery"
              icon={Activity}
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Sprints"
              value="4"
              subtitle="Reported"
              icon={BarChart3}
              iconClass="bg-purple-50 text-purple-600"
            />
          </div>
        </div>
      )}

      {activeReport === "workload" && (
        <div className="space-y-5">
          <WorkloadReport />

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Workload Distribution
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Compare issue allocation between team
              members.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamData.map((member) => (
                <div
                  key={member.name}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                      {member.initials}
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        {member.name}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {member.assigned} assigned ·{" "}
                        {member.completed} completed
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressBar
                      value={member.completed}
                      max={member.assigned}
                      label="Completion"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeReport === "productivity" && (
        <div className="space-y-5">
          <ProductivityReport />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="Team Issues"
              value={teamData.reduce(
                (sum, member) =>
                  sum + member.assigned,
                0
              )}
              subtitle="Assigned"
              icon={FileText}
            />

            <StatCard
              title="Completed"
              value={teamData.reduce(
                (sum, member) =>
                  sum + member.completed,
                0
              )}
              subtitle="Delivered"
              icon={CheckCircle2}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Logged Hours"
              value={`${teamData.reduce(
                (sum, member) =>
                  sum + member.hours,
                0
              )}h`}
              subtitle="Total team time"
              icon={Clock3}
              iconClass="bg-purple-50 text-purple-600"
            />

            <StatCard
              title="Avg Completion"
              value={`${Math.round(
                teamData.reduce(
                  (sum, member) =>
                    sum +
                    (member.completed /
                      member.assigned) *
                      100,
                  0
                ) / teamData.length
              )}%`}
              subtitle="Team average"
              icon={TrendingUp}
              iconClass="bg-blue-50 text-blue-600"
            />
          </div>
        </div>
      )}

      {activeReport === "time" && (
        <div className="space-y-5">
          <TimeTrackingReport />

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Time Tracking Details
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Logged hours by team member.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-slate-400">
                      Member
                    </th>

                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-slate-400">
                      Assigned
                    </th>

                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-slate-400">
                      Completed
                    </th>

                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-slate-400">
                      Logged
                    </th>

                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-slate-400">
                      Avg / Issue
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {teamData.map((member) => (
                    <tr key={member.name}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                            {member.initials}
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {member.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        {member.assigned}
                      </td>

                      <td className="px-5 py-4 text-xs text-emerald-600 font-semibold">
                        {member.completed}
                      </td>

                      <td className="px-5 py-4 text-xs font-bold text-slate-700">
                        {member.hours}h
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {(
                          member.hours /
                          member.assigned
                        ).toFixed(1)}
                        h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}