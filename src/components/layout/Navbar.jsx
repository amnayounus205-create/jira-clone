import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Search,
  LogOut,
  Moon,
  Sun,
  FileText,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { backlogIssues } from "../backlog/backlogData";

const Navbar = ({ onLogout }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const normalizedSearch = debouncedSearch
    .trim()
    .toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }

    return backlogIssues
      .filter((issue) => {
        const searchableText = [
          issue.id,
          issue.title,
          issue.description,
          issue.type,
          issue.priority,
          issue.status,
          issue.sprint,
          issue.epic,
          ...(issue.labels || []),
          issue.assignee?.name,
          issue.reporter?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 8);
  }, [normalizedSearch]);

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;

    setSearch(value);
    setShowResults(true);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setShowResults(false);
  }, []);

  const handleIssueClick = useCallback(
    (issue) => {
      setSearch("");
      setDebouncedSearch("");
      setShowResults(false);

      navigate("/backlog", {
        state: {
          selectedIssueId: issue.id,
        },
      });
    },
    [navigate]
  );

  const handleSearchKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        handleSearchClear();
      }

      if (
        event.key === "Enter" &&
        searchResults.length > 0
      ) {
        handleIssueClick(searchResults[0]);
      }
    },
    [
      handleSearchClear,
      handleIssueClick,
      searchResults,
    ]
  );

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-blue-600 shrink-0">
        Jira Clone
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              dark:text-slate-500
              pointer-events-none
            "
          />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => {
              if (search.trim()) {
                setShowResults(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search issues, names, labels..."
            className="
              pl-10
              pr-10
              py-2
              w-72
              border
              border-slate-200
              dark:border-slate-700
              rounded-lg
              outline-none
              bg-white
              dark:bg-slate-800
              text-slate-800
              dark:text-slate-200
              placeholder:text-gray-400
              dark:placeholder:text-slate-500
              focus:border-blue-500
              transition-colors
              text-sm
            "
          />

          {search && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                p-1
                rounded
                text-slate-400
                hover:text-slate-700
                dark:hover:text-slate-200
              "
            >
              <X size={15} />
            </button>
          )}

          {showResults && search.trim() && (
            <div
              className="
                absolute
                top-full
                right-0
                mt-2
                w-[380px]
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-700
                rounded-xl
                shadow-xl
                overflow-hidden
                z-50
              "
            >
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Global Search
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {searchResults.length > 0
                    ? `${searchResults.length} issue${
                        searchResults.length !== 1
                          ? "s"
                          : ""
                      } found`
                    : "No results found"}
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="max-h-[420px] overflow-y-auto">
                  {searchResults.map((issue) => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() =>
                        handleIssueClick(issue)
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        hover:bg-slate-50
                        dark:hover:bg-slate-800
                        border-b
                        border-slate-100
                        dark:border-slate-800
                        transition
                      "
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                          <FileText size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600">
                              {issue.id}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {issue.type}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                            {issue.title}
                          </p>

                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1">
                            {issue.description}
                          </p>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                              {issue.status}
                            </span>

                            {issue.assignee?.name && (
                              <span className="flex items-center gap-1 text-[9px] text-slate-400">
                                <User size={10} />
                                {issue.assignee.name}
                              </span>
                            )}

                            {issue.labels?.length > 0 && (
                              <span className="text-[9px] text-slate-400">
                                #{issue.labels[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <Search
                    size={25}
                    className="mx-auto text-slate-300 dark:text-slate-600"
                  />

                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">
                    No issues found
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Try an issue ID, title, name, status or label.
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[9px] text-slate-400">
                  Search by ID, title, description, assignee,
                  reporter, label, status, priority or sprint
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="
            relative
            p-2
            rounded-lg
            text-gray-600
            dark:text-slate-300
            hover:bg-slate-100
            dark:hover:bg-slate-800
            transition
          "
          title="Notifications"
        >
          <Bell size={20} />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button
          type="button"
          onClick={() =>
            setDarkMode((prev) => !prev)
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="
            w-10
            h-10
            rounded-lg
            flex
            items-center
            justify-center
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-800
            text-slate-600
            dark:text-yellow-400
            hover:bg-slate-100
            dark:hover:bg-slate-700
            transition
          "
        >
          {darkMode ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        <div className="text-right hidden sm:block">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
            {user?.name || "Admin"}
          </h3>

          <p className="text-sm text-gray-500 dark:text-slate-400">
            {user?.role || "Super Admin"}
          </p>
        </div>

        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="
            w-10
            h-10
            rounded-full
            object-cover
            ring-2
            ring-slate-200
            dark:ring-slate-700
          "
        />

        <button
          type="button"
          onClick={onLogout}
          className="
            flex
            items-center
            gap-2
            bg-red-500
            hover:bg-red-600
            text-white
            px-4
            py-2
            rounded-lg
            transition
          "
        >
          <LogOut size={18} />

          <span className="hidden lg:inline">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;