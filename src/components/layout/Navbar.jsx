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

  const normalizedSearch = debouncedSearch.trim().toLowerCase();

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
    <div className="flex w-full min-w-0 items-center justify-between gap-2">
      <h1 className="hidden shrink-0 text-lg font-bold text-blue-600 sm:block">
        Jira Clone
      </h1>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-3">
        <div className="relative min-w-0 flex-1 sm:flex-none md:block">
          <Search
            size={17}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              dark:text-slate-500
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
            placeholder="Search issues..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              pl-9
              pr-9
              text-sm
              text-slate-800
              outline-none
              transition-colors
              focus:border-blue-500
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-200
              dark:placeholder:text-slate-500
              sm:w-56
              md:w-72
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
                rounded
                p-1
                text-slate-400
                hover:text-slate-700
                dark:hover:text-slate-200
              "
            >
              <X size={15} />
            </button>
          )}

          {showResults && search.trim() && (
            <>
              <button
                type="button"
                aria-label="Close search results"
                onClick={() => setShowResults(false)}
                className="fixed inset-0 z-40 cursor-default bg-transparent"
              />

              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-2
                  w-[calc(100vw-24px)]
                  max-w-[380px]
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-xl
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Global Search
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
                  <div className="max-h-[60vh] overflow-y-auto">
                    {searchResults.map((issue) => (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() =>
                          handleIssueClick(issue)
                        }
                        className="
                          w-full
                          border-b
                          border-slate-100
                          px-4
                          py-3
                          text-left
                          transition
                          hover:bg-slate-50
                          dark:border-slate-800
                          dark:hover:bg-slate-800
                        "
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950">
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

                            <p className="mt-0.5 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {issue.title}
                            </p>

                            <p className="mt-1 truncate text-[11px] text-slate-400 dark:text-slate-500">
                              {issue.description}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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

                    <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      No issues found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try an issue ID, title, name, status or label.
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[9px] text-slate-400">
                    Search by ID, title, description, assignee,
                    reporter, label, status, priority or sprint
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="
            relative
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-slate-100
            dark:text-slate-300
            dark:hover:bg-slate-800
          "
          title="Notifications"
        >
          <Bell size={19} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
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
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-600
            transition
            hover:bg-slate-100
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-yellow-400
            dark:hover:bg-slate-700
          "
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        <div className="hidden text-right sm:block">
          <h3 className="max-w-[130px] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {user?.name || "Admin"}
          </h3>

          <p className="max-w-[130px] truncate text-xs text-gray-500 dark:text-slate-400">
            {user?.role || "Super Admin"}
          </p>
        </div>

        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="
            h-9
            w-9
            shrink-0
            rounded-full
            object-cover
            ring-2
            ring-slate-200
            dark:ring-slate-700
            sm:h-10
            sm:w-10
          "
        />

        <button
          type="button"
          onClick={onLogout}
          className="
            flex
            h-10
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-red-500
            px-3
            py-2
            text-white
            transition
            hover:bg-red-600
            sm:px-4
          "
        >
          <LogOut size={17} />

          <span className="hidden lg:inline">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
