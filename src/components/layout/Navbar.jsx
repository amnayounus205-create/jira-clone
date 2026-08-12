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

  // ======================================================
  // THEME
  // ======================================================
  // Navbar and Settings share the same global theme key.

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ======================================================
  // SEARCH STATE
  // ======================================================

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  // ======================================================
  // APPLY / SYNC GLOBAL THEME
  // ======================================================

  useEffect(() => {
    const applyTheme = (theme) => {
      const nextTheme = theme === "dark" ? "dark" : "light";

      document.documentElement.classList.toggle(
        "dark",
        nextTheme === "dark"
      );

      localStorage.setItem("theme", nextTheme);
      setDarkMode(nextTheme === "dark");
    };

    const handleThemeChange = (event) => {
      applyTheme(event.detail?.theme);
    };

    const handleStorageChange = (event) => {
      if (event.key === "theme") {
        applyTheme(event.newValue);
      }
    };

    applyTheme(localStorage.getItem("theme"));

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleThemeToggle = useCallback(() => {
    const nextTheme = darkMode ? "light" : "dark";

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );

    localStorage.setItem("theme", nextTheme);
    setDarkMode(nextTheme === "dark");

    window.dispatchEvent(
      new CustomEvent("theme-change", {
        detail: { theme: nextTheme },
      })
    );
  }, [darkMode]);

  // ======================================================
  // DEBOUNCE SEARCH
  // ======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ======================================================
  // NORMALIZED SEARCH
  // ======================================================

  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  // ======================================================
  // SEARCH RESULTS
  // ======================================================

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

  // ======================================================
  // SEARCH CHANGE
  // ======================================================

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;

    setSearch(value);
    setShowResults(true);
  }, []);

  // ======================================================
  // CLEAR SEARCH
  // ======================================================

  const handleSearchClear = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setShowResults(false);
  }, []);

  // ======================================================
  // ISSUE CLICK
  // ======================================================

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

  // ======================================================
  // SEARCH KEYBOARD
  // ======================================================

  const handleSearchKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        handleSearchClear();
        return;
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

  // ======================================================
  // USER INITIALS
  // ======================================================

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const userInitials = getInitials(user?.name);

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="flex min-w-0 w-full items-center">
      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="hidden min-w-0 shrink-0 md:block">
        <h1 className="truncate text-lg font-bold tracking-tight text-slate-800 dark:text-white">
          Jira Clone
        </h1>
      </div>

      {/* ==================================================
          RIGHT SECTION
      ================================================== */}

      <div
        className="
          ml-auto
          flex
          min-w-0
          max-w-full
          flex-1
          items-center
          justify-end
          gap-1.5

          sm:gap-2
          md:gap-3
        "
      >
        {/* ==================================================
            SEARCH
        ================================================== */}

        <div
          className="
            relative
            min-w-0
            flex-1

            sm:max-w-[280px]
            md:max-w-[320px]
            lg:max-w-[380px]
          "
        >
          <Search
            size={17}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              z-10
              -translate-y-1/2
              text-slate-400
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
              min-w-0
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

              placeholder:text-slate-400

              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/10

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-200
              dark:placeholder:text-slate-500

              sm:w-full
            "
          />

          {/* Clear Search */}
          {search && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="
                absolute
                right-2
                top-1/2
                z-10
                -translate-y-1/2
                rounded
                p-1
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
                dark:hover:bg-slate-700
                dark:hover:text-slate-200
              "
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

          {/* ==================================================
              SEARCH RESULTS
          ================================================== */}

          {showResults && search.trim() && (
            <>
              {/* Search Overlay */}

              <button
                type="button"
                aria-label="Close search results"
                onClick={() => setShowResults(false)}
                className="
                  fixed
                  inset-0
                  z-[60]
                  cursor-default
                  bg-transparent
                "
              />

              {/* Dropdown */}

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  z-[70]
                  mt-2
                  max-h-[70vh]
                  min-w-0
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-2xl

                  dark:border-slate-700
                  dark:bg-slate-900

                  sm:left-auto
                  sm:right-0
                  sm:w-[360px]
                  md:w-[380px]
                "
              >
                {/* Search Header */}

                <div
                  className="
                    border-b
                    border-slate-100
                    px-4
                    py-3

                    dark:border-slate-800
                  "
                >
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

                {/* ==================================================
                    RESULTS
                ================================================== */}

                {searchResults.length > 0 ? (
                  <div className="max-h-[55vh] overflow-y-auto">
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
                        <div className="flex min-w-0 items-start gap-3">
                          {/* Issue Icon */}

                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-50
                              text-blue-600

                              dark:bg-blue-950
                              dark:text-blue-400
                            "
                          >
                            <FileText size={15} />
                          </div>

                          {/* Issue Content */}

                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="shrink-0 text-[10px] font-bold text-blue-600">
                                {issue.id}
                              </span>

                              <span className="truncate text-[10px] text-slate-400">
                                {issue.type}
                              </span>
                            </div>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800

                                dark:text-slate-100
                              "
                            >
                              {issue.title}
                            </p>

                            <p
                              className="
                                mt-1
                                truncate
                                text-[11px]
                                text-slate-400

                                dark:text-slate-500
                              "
                            >
                              {issue.description}
                            </p>

                            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                              {/* Status */}

                              <span
                                className="
                                  max-w-[100px]
                                  truncate
                                  rounded-full
                                  bg-slate-100
                                  px-2
                                  py-0.5
                                  text-[9px]
                                  font-semibold
                                  text-slate-600

                                  dark:bg-slate-800
                                  dark:text-slate-300
                                "
                              >
                                {issue.status}
                              </span>

                              {/* Assignee */}

                              {issue.assignee?.name && (
                                <span className="flex max-w-[120px] min-w-0 items-center gap-1 truncate text-[9px] text-slate-400">
                                  <User
                                    size={10}
                                    className="shrink-0"
                                  />

                                  <span className="truncate">
                                    {issue.assignee.name}
                                  </span>
                                </span>
                              )}

                              {/* Label */}

                              {issue.labels?.length > 0 && (
                                <span className="max-w-[100px] truncate text-[9px] text-slate-400">
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
                  /* ==================================================
                      NO RESULTS
                  ================================================== */

                  <div className="px-5 py-8 text-center">
                    <Search
                      size={25}
                      className="
                        mx-auto
                        text-slate-300

                        dark:text-slate-600
                      "
                    />

                    <p
                      className="
                        mt-2
                        text-sm
                        font-semibold
                        text-slate-600

                        dark:text-slate-300
                      "
                    >
                      No issues found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try an issue ID, title, name,
                      status or label.
                    </p>
                  </div>
                )}

                {/* ==================================================
                    SEARCH FOOTER
                ================================================== */}

                <div
                  className="
                    border-t
                    border-slate-100
                    bg-slate-50
                    px-4
                    py-2

                    dark:border-slate-800
                    dark:bg-slate-950
                  "
                >
                  <p className="text-[9px] text-slate-400">
                    Search by ID, title, description,
                    assignee, reporter, label, status,
                    priority or sprint
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

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
            text-slate-600
            transition

            hover:bg-slate-100

            dark:text-slate-300
            dark:hover:bg-slate-800
          "
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span
            className="
              absolute
              right-1.5
              top-1.5
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* ==================================================
            DARK MODE
        ================================================== */}

        <button
          type="button"
          onClick={handleThemeToggle}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-label={
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

        {/* ==================================================
            USER INFO
        ================================================== */}

        <div className="hidden min-w-0 max-w-[130px] text-right sm:block">
          <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {user?.name || "Admin"}
          </h3>

          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {user?.role || "Super Admin"}
          </p>
        </div>

        {/* ==================================================
            USER AVATAR
        ================================================== */}

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-xs
            font-bold
            text-white
            ring-2
            ring-slate-200

            dark:ring-slate-700

            sm:h-10
            sm:w-10
          "
          title={user?.name || "User"}
        >
          {userInitials}
        </div>

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <button
          type="button"
          onClick={onLogout}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-red-500
            text-white
            transition

            hover:bg-red-600

            sm:w-auto
            sm:gap-2
            sm:px-3
            lg:px-4
          "
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={17} />

          <span className="hidden sm:inline">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;