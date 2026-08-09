import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  User,
  Bell,
  Shield,
  Palette,
  Building2,
  Users,
  BriefcaseBusiness,
  Save,
  Lock,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Trash2,
  Plus,
  X,
  Search,
  UserPlus,
  Settings,
} from "lucide-react";

import toast from "react-hot-toast";

/*
|--------------------------------------------------------------------------
| Settings Module
|--------------------------------------------------------------------------
| Frontend-only settings module.
|
| Includes:
| - Profile
| - Password
| - Notifications
| - Appearance / Theme
| - Organization
| - Workspace
| - Team Members
| - Roles & Permissions
| - Two Factor Authentication
| - Danger Zone
|
| Data is persisted in localStorage.
|--------------------------------------------------------------------------
*/

const STORAGE_KEY = "jira_clone_settings";

/* =========================================================================
   CONSTANTS
========================================================================= */

const DEFAULT_SETTINGS = {
  profile: {
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    role: "Project Manager",
    jobTitle: "Project Manager",
    timezone: "Asia/Karachi",
  },

  organization: {
    name: "Jira Clone Organization",
    key: "JCO",
    description: "Professional project management workspace.",
  },

  workspace: {
    name: "Main Workspace",
    description: "Default workspace for project management.",
    visibility: "Private",
  },

  notifications: {
    issueAssigned: true,
    sprintStarted: true,
    sprintCompleted: true,
    newComment: true,
    mentions: true,
    dueDateReminder: true,
    emailNotifications: true,
    browserNotifications: true,
  },

  appearance: {
    theme: "light",
    compactMode: false,
  },

  security: {
    twoFactor: false,
  },

  members: [
    {
      id: 1,
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      role: "Project Manager",
      status: "Active",
    },
    {
      id: 2,
      name: "Daniel Ross",
      email: "daniel@example.com",
      role: "Developer",
      status: "Active",
    },
    {
      id: 3,
      name: "Mei Lin",
      email: "mei@example.com",
      role: "QA Tester",
      status: "Active",
    },
    {
      id: 4,
      name: "Omar Farouk",
      email: "omar@example.com",
      role: "Viewer",
      status: "Invited",
    },
  ],
};

/* =========================================================================
   ROLES
========================================================================= */

const ROLES = [
  "Super Admin",
  "Organization Admin",
  "Project Manager",
  "Scrum Master",
  "Developer",
  "QA Tester",
  "Viewer",
];

const ROLE_PERMISSIONS = {
  "Super Admin": {
    View: true,
    Create: true,
    Edit: true,
    Delete: true,
    "Assign Issues": true,
    "Start Sprint": true,
    "Close Sprint": true,
    "Manage Members": true,
  },

  "Organization Admin": {
    View: true,
    Create: true,
    Edit: true,
    Delete: true,
    "Assign Issues": true,
    "Start Sprint": true,
    "Close Sprint": true,
    "Manage Members": true,
  },

  "Project Manager": {
    View: true,
    Create: true,
    Edit: true,
    Delete: true,
    "Assign Issues": true,
    "Start Sprint": true,
    "Close Sprint": true,
    "Manage Members": false,
  },

  "Scrum Master": {
    View: true,
    Create: true,
    Edit: true,
    Delete: false,
    "Assign Issues": true,
    "Start Sprint": true,
    "Close Sprint": true,
    "Manage Members": false,
  },

  Developer: {
    View: true,
    Create: true,
    Edit: true,
    Delete: false,
    "Assign Issues": false,
    "Start Sprint": false,
    "Close Sprint": false,
    "Manage Members": false,
  },

  "QA Tester": {
    View: true,
    Create: true,
    Edit: true,
    Delete: false,
    "Assign Issues": false,
    "Start Sprint": false,
    "Close Sprint": false,
    "Manage Members": false,
  },

  Viewer: {
    View: true,
    Create: false,
    Edit: false,
    Delete: false,
    "Assign Issues": false,
    "Start Sprint": false,
    "Close Sprint": false,
    "Manage Members": false,
  },
};

/* =========================================================================
   HELPERS
========================================================================= */

const readSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,

      profile: {
        ...DEFAULT_SETTINGS.profile,
        ...parsed.profile,
      },

      organization: {
        ...DEFAULT_SETTINGS.organization,
        ...parsed.organization,
      },

      workspace: {
        ...DEFAULT_SETTINGS.workspace,
        ...parsed.workspace,
      },

      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...parsed.notifications,
      },

      appearance: {
        ...DEFAULT_SETTINGS.appearance,
        ...parsed.appearance,
      },

      security: {
        ...DEFAULT_SETTINGS.security,
        ...parsed.security,
      },

      members:
        Array.isArray(parsed.members) && parsed.members.length
          ? parsed.members
          : DEFAULT_SETTINGS.members,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  } catch {
    // Ignore storage errors.
  }
};

const getInitials = (name) => {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* =========================================================================
   REUSABLE UI
========================================================================= */

const SectionCard = memo(
  ({
    icon: Icon,
    title,
    description,
    children,
  }) => {
    return (
      <section
        className="
          overflow-hidden rounded-2xl
          border border-slate-200
          bg-white
          shadow-sm
          transition-colors duration-200
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            flex items-center gap-3
            border-b border-slate-200
            px-6 py-5
            dark:border-slate-800
          "
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-blue-50
              text-[#0052CC]
              dark:bg-blue-950/50
              dark:text-blue-400
            "
          >
            <Icon size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#172B4D] dark:text-slate-100">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </section>
    );
  }
);

const InputField = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
  }) => {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </label>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="
            w-full rounded-lg
            border border-slate-200
            bg-slate-50
            px-3.5 py-2.5
            text-sm text-slate-700
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-[#0052CC]
            focus:bg-white
            focus:ring-2
            focus:ring-blue-100
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-100
            dark:placeholder:text-slate-500
            dark:focus:border-blue-500
            dark:focus:bg-slate-800
            dark:focus:ring-blue-950
          "
        />
      </div>
    );
  }
);

const SelectField = memo(
  ({
    label,
    value,
    onChange,
    options,
  }) => {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </label>

        <select
          value={value}
          onChange={onChange}
          className="
            w-full rounded-lg
            border border-slate-200
            bg-slate-50
            px-3.5 py-2.5
            text-sm text-slate-700
            outline-none
            focus:border-[#0052CC]
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-100
            dark:focus:border-blue-500
          "
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

const Toggle = memo(({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`
        relative h-6 w-11 shrink-0 rounded-full
        transition
        ${
          checked
            ? "bg-[#0052CC]"
            : "bg-slate-300 dark:bg-slate-600"
        }
      `}
    >
      <span
        className={`
          absolute top-0.5 h-5 w-5
          rounded-full
          bg-white
          shadow
          transition
          ${
            checked
              ? "left-5"
              : "left-0.5"
          }
        `}
      />
    </button>
  );
});

const SettingRow = memo(
  ({
    title,
    description,
    checked,
    onChange,
  }) => {
    return (
      <div
        className="
          flex items-center justify-between gap-4
          border-b border-slate-100
          py-4
          last:border-b-0
          dark:border-slate-800
        "
      >
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>

        <Toggle
          checked={checked}
          onChange={onChange}
        />
      </div>
    );
  }
);

/* =========================================================================
   MAIN MODULE
========================================================================= */

const SettingsModule = () => {
  const [settings, setSettings] =
    useState(readSettings);

  const [activeTab, setActiveTab] =
    useState("profile");

  const [showPassword, setShowPassword] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [memberSearch, setMemberSearch] =
    useState("");

  const [inviteOpen, setInviteOpen] =
    useState(false);

  const [inviteName, setInviteName] =
    useState("");

  const [inviteEmail, setInviteEmail] =
    useState("");

  const [inviteRole, setInviteRole] =
    useState("Developer");

  /* =======================================================================
     APPLY THEME
  ======================================================================= */

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const theme = settings.appearance.theme;

      if (theme === "dark") {
        root.classList.add("dark");
        return;
      }

      if (theme === "light") {
        root.classList.remove("dark");
        return;
      }

      const prefersDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

      root.classList.toggle(
        "dark",
        prefersDark
      );
    };

    applyTheme();

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemThemeChange = () => {
      if (
        settings.appearance.theme ===
        "system"
      ) {
        applyTheme();
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [settings.appearance.theme]);

  /* =======================================================================
     PROFILE
  ======================================================================= */

  const updateProfile = useCallback(
    (field, value) => {
      setSettings((prev) => ({
        ...prev,

        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));
    },
    []
  );

  const saveProfile = useCallback(() => {
    setSettings((current) => {
      saveSettings(current);
      return current;
    });

    toast.success(
      "Profile updated successfully"
    );
  }, []);

  /* =======================================================================
     ORGANIZATION
  ======================================================================= */

  const updateOrganization =
    useCallback(
      (field, value) => {
        setSettings((prev) => ({
          ...prev,

          organization: {
            ...prev.organization,
            [field]: value,
          },
        }));
      },
      []
    );

  const saveOrganization = useCallback(() => {
    setSettings((current) => {
      saveSettings(current);
      return current;
    });

    toast.success(
      "Organization settings updated"
    );
  }, []);

  /* =======================================================================
     WORKSPACE
  ======================================================================= */

  const updateWorkspace = useCallback(
    (field, value) => {
      setSettings((prev) => ({
        ...prev,

        workspace: {
          ...prev.workspace,
          [field]: value,
        },
      }));
    },
    []
  );

  const saveWorkspace = useCallback(() => {
    setSettings((current) => {
      saveSettings(current);
      return current;
    });

    toast.success(
      "Workspace settings updated"
    );
  }, []);

  /* =======================================================================
     NOTIFICATIONS
  ======================================================================= */

  const updateNotification =
    useCallback(
      (field, value) => {
        setSettings((prev) => {
          const next = {
            ...prev,

            notifications: {
              ...prev.notifications,
              [field]: value,
            },
          };

          saveSettings(next);

          return next;
        });
      },
      []
    );

  /* =======================================================================
     APPEARANCE
  ======================================================================= */

  const changeTheme = useCallback(
    (theme) => {
      setSettings((prev) => {
        const next = {
          ...prev,

          appearance: {
            ...prev.appearance,
            theme,
          },
        };

        saveSettings(next);

        return next;
      });

      /*
       * Important:
       * Same toast ID prevents duplicate popups.
       */
      toast.success("Theme updated", {
        id: "theme-updated",
      });
    },
    []
  );

  const toggleCompactMode =
    useCallback(() => {
      setSettings((prev) => {
        const next = {
          ...prev,

          appearance: {
            ...prev.appearance,
            compactMode:
              !prev.appearance.compactMode,
          },
        };

        saveSettings(next);

        return next;
      });

      toast.success("Appearance updated", {
        id: "appearance-updated",
      });
    }, []);

  /* =======================================================================
     PASSWORD
  ======================================================================= */

  const changePassword = useCallback(() => {
    if (!password) {
      toast.error(
        "Please enter a new password"
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    setPassword("");
    setConfirmPassword("");

    toast.success(
      "Password changed successfully"
    );
  }, [
    password,
    confirmPassword,
  ]);

  /* =======================================================================
     TWO FACTOR
  ======================================================================= */

  const toggleTwoFactor = useCallback(
    (value) => {
      setSettings((prev) => {
        const next = {
          ...prev,

          security: {
            ...prev.security,
            twoFactor: value,
          },
        };

        saveSettings(next);

        return next;
      });

      toast.success(
        value
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled",
        {
          id: "two-factor-updated",
        }
      );
    },
    []
  );

  /* =======================================================================
     MEMBERS
  ======================================================================= */

  const filteredMembers = useMemo(() => {
    const query =
      memberSearch.trim().toLowerCase();

    if (!query) {
      return settings.members;
    }

    return settings.members.filter(
      (member) =>
        member.name
          .toLowerCase()
          .includes(query) ||
        member.email
          .toLowerCase()
          .includes(query) ||
        member.role
          .toLowerCase()
          .includes(query)
    );
  }, [
    memberSearch,
    settings.members,
  ]);

  const updateMemberRole =
    useCallback(
      (memberId, role) => {
        setSettings((prev) => {
          const next = {
            ...prev,

            members: prev.members.map(
              (member) =>
                member.id === memberId
                  ? {
                      ...member,
                      role,
                    }
                  : member
            ),
          };

          saveSettings(next);

          return next;
        });

        toast.success(
          "Member role updated",
          {
            id: "member-role-updated",
          }
        );
      },
      []
    );

  const removeMember = useCallback(
    (memberId) => {
      setSettings((prev) => {
        const member =
          prev.members.find(
            (item) =>
              item.id === memberId
          );

        if (!member) {
          return prev;
        }

        const confirmed =
          window.confirm(
            `Remove ${member.name} from workspace?`
          );

        if (!confirmed) {
          return prev;
        }

        const next = {
          ...prev,

          members:
            prev.members.filter(
              (item) =>
                item.id !== memberId
            ),
        };

        saveSettings(next);

        toast.success(
          "Member removed"
        );

        return next;
      });
    },
    []
  );

  const inviteMember =
    useCallback(() => {
      if (!inviteName.trim()) {
        toast.error(
          "Member name is required"
        );
        return;
      }

      if (!inviteEmail.trim()) {
        toast.error(
          "Email is required"
        );
        return;
      }

      const newMember = {
        id: Date.now(),
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        status: "Invited",
      };

      setSettings((prev) => {
        const next = {
          ...prev,

          members: [
            ...prev.members,
            newMember,
          ],
        };

        saveSettings(next);

        return next;
      });

      setInviteName("");
      setInviteEmail("");
      setInviteRole("Developer");
      setInviteOpen(false);

      toast.success(
        "Member invited successfully"
      );
    }, [
      inviteName,
      inviteEmail,
      inviteRole,
    ]);

  /* =======================================================================
     PERMISSIONS
  ======================================================================= */

  const permissionRows = useMemo(
    () => [
      "View",
      "Create",
      "Edit",
      "Delete",
      "Assign Issues",
      "Start Sprint",
      "Close Sprint",
      "Manage Members",
    ],
    []
  );

  /* =======================================================================
     SIDEBAR
  ======================================================================= */

  const tabs = useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        icon: User,
      },
      {
        id: "organization",
        label: "Organization",
        icon: Building2,
      },
      {
        id: "workspace",
        label: "Workspace",
        icon: BriefcaseBusiness,
      },
      {
        id: "members",
        label: "Members",
        icon: Users,
      },
      {
        id: "permissions",
        label: "Roles & Permissions",
        icon: Shield,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
      },
      {
        id: "appearance",
        label: "Appearance",
        icon: Palette,
      },
      {
        id: "security",
        label: "Security",
        icon: Lock,
      },
    ],
    []
  );

  /* =======================================================================
     PROFILE
  ======================================================================= */

  const renderProfile = () => (
    <div className="space-y-5">
      <SectionCard
        icon={User}
        title="Profile"
        description="Manage your personal account information."
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="
              flex h-16 w-16 shrink-0
              items-center justify-center
              rounded-full
              bg-blue-100
              text-lg font-bold
              text-blue-700
              dark:bg-blue-950
              dark:text-blue-300
            "
          >
            {getInitials(
              settings.profile.name
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#172B4D] dark:text-slate-100">
              {settings.profile.name}
            </h3>

            <p className="text-sm text-slate-400 dark:text-slate-500">
              {settings.profile.email}
            </p>

            <span
              className="
                mt-2 inline-flex
                rounded-full
                bg-blue-50
                px-2.5 py-1
                text-[11px] font-bold
                text-blue-700
                dark:bg-blue-950
                dark:text-blue-300
              "
            >
              {settings.profile.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Full Name"
            value={settings.profile.name}
            onChange={(e) =>
              updateProfile(
                "name",
                e.target.value
              )
            }
          />

          <InputField
            label="Email"
            type="email"
            value={settings.profile.email}
            onChange={(e) =>
              updateProfile(
                "email",
                e.target.value
              )
            }
          />

          <InputField
            label="Job Title"
            value={settings.profile.jobTitle}
            onChange={(e) =>
              updateProfile(
                "jobTitle",
                e.target.value
              )
            }
          />

          <SelectField
            label="Timezone"
            value={settings.profile.timezone}
            onChange={(e) =>
              updateProfile(
                "timezone",
                e.target.value
              )
            }
            options={[
              "Asia/Karachi",
              "Asia/Dubai",
              "Asia/Kolkata",
              "Europe/London",
              "America/New_York",
              "America/Los_Angeles",
            ]}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={saveProfile}
            className="
              flex items-center gap-2
              rounded-lg
              bg-[#0052CC]
              px-4 py-2.5
              text-sm font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </SectionCard>
    </div>
  );

  /* =======================================================================
     ORGANIZATION
  ======================================================================= */

  const renderOrganization = () => (
    <SectionCard
      icon={Building2}
      title="Organization"
      description="Manage organization-level settings."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Organization Name"
          value={settings.organization.name}
          onChange={(e) =>
            updateOrganization(
              "name",
              e.target.value
            )
          }
        />

        <InputField
          label="Organization Key"
          value={settings.organization.key}
          onChange={(e) =>
            updateOrganization(
              "key",
              e.target.value
                .toUpperCase()
                .slice(0, 10)
            )
          }
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
          Description
        </label>

        <textarea
          rows={4}
          value={
            settings.organization.description
          }
          onChange={(e) =>
            updateOrganization(
              "description",
              e.target.value
            )
          }
          className="
            w-full resize-none rounded-lg
            border border-slate-200
            bg-slate-50
            px-3.5 py-2.5
            text-sm text-slate-700
            outline-none
            focus:border-[#0052CC]
            focus:bg-white
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-100
            dark:focus:border-blue-500
            dark:focus:bg-slate-800
          "
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={saveOrganization}
          className="
            flex items-center gap-2
            rounded-lg
            bg-[#0052CC]
            px-4 py-2.5
            text-sm font-semibold
            text-white
            hover:bg-blue-700
          "
        >
          <Save size={15} />
          Save Organization
        </button>
      </div>
    </SectionCard>
  );

  /* =======================================================================
     WORKSPACE
  ======================================================================= */

  const renderWorkspace = () => (
    <SectionCard
      icon={BriefcaseBusiness}
      title="Workspace"
      description="Manage your current workspace settings."
    >
      <div className="space-y-4">
        <InputField
          label="Workspace Name"
          value={settings.workspace.name}
          onChange={(e) =>
            updateWorkspace(
              "name",
              e.target.value
            )
          }
        />

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Description
          </label>

          <textarea
            rows={4}
            value={
              settings.workspace.description
            }
            onChange={(e) =>
              updateWorkspace(
                "description",
                e.target.value
              )
            }
            className="
              w-full resize-none rounded-lg
              border border-slate-200
              bg-slate-50
              px-3.5 py-2.5
              text-sm text-slate-700
              outline-none
              focus:border-[#0052CC]
              focus:bg-white
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
              dark:focus:border-blue-500
              dark:focus:bg-slate-800
            "
          />
        </div>

        <SelectField
          label="Workspace Visibility"
          value={
            settings.workspace.visibility
          }
          onChange={(e) =>
            updateWorkspace(
              "visibility",
              e.target.value
            )
          }
          options={[
            "Private",
            "Organization",
            "Public",
          ]}
        />

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={saveWorkspace}
            className="
              flex items-center gap-2
              rounded-lg
              bg-[#0052CC]
              px-4 py-2.5
              text-sm font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            <Save size={15} />
            Save Workspace
          </button>
        </div>
      </div>
    </SectionCard>
  );

  /* =======================================================================
     MEMBERS
  ======================================================================= */

  const renderMembers = () => (
    <SectionCard
      icon={Users}
      title="Team Members"
      description="Manage members and workspace roles."
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            value={memberSearch}
            onChange={(e) =>
              setMemberSearch(
                e.target.value
              )
            }
            placeholder="Search members..."
            className="
              w-full rounded-lg
              border border-slate-200
              bg-slate-50
              py-2.5 pl-9 pr-3
              text-sm
              outline-none
              focus:border-[#0052CC]
              focus:bg-white
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
              dark:focus:bg-slate-800
            "
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setInviteOpen(true)
          }
          className="
            flex items-center
            justify-center gap-2
            rounded-lg
            bg-[#0052CC]
            px-4 py-2.5
            text-sm font-semibold
            text-white
            hover:bg-blue-700
          "
        >
          <UserPlus size={15} />
          Invite Member
        </button>
      </div>

      <div
        className="
          overflow-hidden rounded-xl
          border border-slate-200
          dark:border-slate-800
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr className="text-left">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Member
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-slate-900">
              {filteredMembers.map(
                (member) => (
                  <tr
                    key={member.id}
                    className="
                      border-t border-slate-100
                      dark:border-slate-800
                    "
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-full
                            bg-blue-100
                            text-[10px] font-bold
                            text-blue-700
                            dark:bg-blue-950
                            dark:text-blue-300
                          "
                        >
                          {getInitials(
                            member.name
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {member.name}
                          </p>

                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          updateMemberRole(
                            member.id,
                            e.target.value
                          )
                        }
                        className="
                          rounded-lg
                          border border-slate-200
                          bg-white
                          px-2.5 py-1.5
                          text-xs
                          text-slate-700
                          outline-none
                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-slate-200
                        "
                      >
                        {ROLES.map(
                          (role) => (
                            <option
                              key={role}
                              value={role}
                            >
                              {role}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`
                          rounded-full
                          px-2.5 py-1
                          text-[10px]
                          font-bold
                          ${
                            member.status ===
                            "Active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }
                        `}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          removeMember(
                            member.id
                          )
                        }
                        className="
                          rounded-lg p-2
                          text-slate-400
                          hover:bg-red-50
                          hover:text-red-600
                          dark:hover:bg-red-950/40
                        "
                        title="Remove member"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              )}

              {filteredMembers.length ===
                0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center"
                  >
                    <Users
                      size={25}
                      className="mx-auto text-slate-300 dark:text-slate-600"
                    />

                    <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      No members found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );

  /* =======================================================================
     PERMISSIONS
  ======================================================================= */

  const renderPermissions = () => (
    <SectionCard
      icon={Shield}
      title="Roles & Permissions"
      description="View permissions assigned to each workspace role."
    >
      <div
        className="
          overflow-x-auto rounded-xl
          border border-slate-200
          dark:border-slate-800
        "
      >
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Permission
              </th>

              {ROLES.map((role) => (
                <th
                  key={role}
                  className="px-3 py-3 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400"
                >
                  {role}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-slate-900">
            {permissionRows.map(
              (permission) => (
                <tr
                  key={permission}
                  className="
                    border-t border-slate-100
                    dark:border-slate-800
                  "
                >
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {permission}
                  </td>

                  {ROLES.map((role) => {
                    const allowed =
                      ROLE_PERMISSIONS[
                        role
                      ][permission];

                    return (
                      <td
                        key={role}
                        className="px-3 py-3 text-center"
                      >
                        {allowed ? (
                          <span
                            className="
                              inline-flex
                              h-6 w-6
                              items-center
                              justify-center
                              rounded-full
                              bg-emerald-100
                              text-emerald-600
                              dark:bg-emerald-950
                              dark:text-emerald-300
                            "
                          >
                            <Check
                              size={13}
                            />
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div
        className="
          mt-4 rounded-xl
          border border-blue-100
          bg-blue-50
          p-4
          dark:border-blue-900
          dark:bg-blue-950/40
        "
      >
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Permissions are currently displayed as a
          role matrix. Connect this configuration
          to your backend authorization layer when
          authentication is implemented.
        </p>
      </div>
    </SectionCard>
  );

  /* =======================================================================
     NOTIFICATIONS
  ======================================================================= */

  const renderNotifications = () => (
    <SectionCard
      icon={Bell}
      title="Notifications"
      description="Choose which events you want to be notified about."
    >
      <div>
        <SettingRow
          title="Issue Assigned"
          description="Notify when an issue is assigned to you."
          checked={
            settings.notifications
              .issueAssigned
          }
          onChange={(value) =>
            updateNotification(
              "issueAssigned",
              value
            )
          }
        />

        <SettingRow
          title="Sprint Started"
          description="Notify when a sprint starts."
          checked={
            settings.notifications
              .sprintStarted
          }
          onChange={(value) =>
            updateNotification(
              "sprintStarted",
              value
            )
          }
        />

        <SettingRow
          title="Sprint Completed"
          description="Notify when a sprint is completed."
          checked={
            settings.notifications
              .sprintCompleted
          }
          onChange={(value) =>
            updateNotification(
              "sprintCompleted",
              value
            )
          }
        />

        <SettingRow
          title="New Comment"
          description="Notify when someone comments on your issue."
          checked={
            settings.notifications
              .newComment
          }
          onChange={(value) =>
            updateNotification(
              "newComment",
              value
            )
          }
        />

        <SettingRow
          title="Mentions"
          description="Notify when someone mentions you."
          checked={
            settings.notifications
              .mentions
          }
          onChange={(value) =>
            updateNotification(
              "mentions",
              value
            )
          }
        />

        <SettingRow
          title="Due Date Reminder"
          description="Receive reminders for approaching deadlines."
          checked={
            settings.notifications
              .dueDateReminder
          }
          onChange={(value) =>
            updateNotification(
              "dueDateReminder",
              value
            )
          }
        />

        <SettingRow
          title="Email Notifications"
          description="Receive important notifications by email."
          checked={
            settings.notifications
              .emailNotifications
          }
          onChange={(value) =>
            updateNotification(
              "emailNotifications",
              value
            )
          }
        />

        <SettingRow
          title="Browser Notifications"
          description="Allow browser notifications for important events."
          checked={
            settings.notifications
              .browserNotifications
          }
          onChange={(value) =>
            updateNotification(
              "browserNotifications",
              value
            )
          }
        />
      </div>
    </SectionCard>
  );

  /* =======================================================================
     APPEARANCE
  ======================================================================= */

  const renderAppearance = () => (
    <SectionCard
      icon={Palette}
      title="Appearance"
      description="Customize how the application looks and behaves."
    >
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Theme
        </h3>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Select your preferred interface theme.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              id: "light",
              label: "Light",
              icon: Sun,
            },
            {
              id: "dark",
              label: "Dark",
              icon: Moon,
            },
            {
              id: "system",
              label: "System",
              icon: Monitor,
            },
          ].map((item) => {
            const Icon = item.icon;

            const selected =
              settings.appearance.theme ===
              item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  changeTheme(item.id)
                }
                className={`
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition
                  ${
                    selected
                      ? "border-[#0052CC] bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                  }
                `}
              >
                <Icon
                  size={19}
                  className={
                    selected
                      ? "text-[#0052CC] dark:text-blue-400"
                      : "text-slate-500"
                  }
                />

                <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </p>

                {selected && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#0052CC] dark:text-blue-400">
                    <Check size={11} />
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
        <SettingRow
          title="Compact Mode"
          description="Reduce spacing to show more information on screen."
          checked={
            settings.appearance
              .compactMode
          }
          onChange={toggleCompactMode}
        />
      </div>
    </SectionCard>
  );

  /* =======================================================================
     SECURITY
  ======================================================================= */

  const renderSecurity = () => (
    <div className="space-y-5">
      <SectionCard
        icon={KeyRound}
        title="Password"
        description="Update your account password."
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              New Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Minimum 8 characters"
                className="
                  w-full rounded-lg
                  border border-slate-200
                  bg-slate-50
                  px-3.5 py-2.5 pr-11
                  text-sm
                  outline-none
                  focus:border-[#0052CC]
                  focus:bg-white
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-100
                  dark:focus:border-blue-500
                  dark:focus:bg-slate-800
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-slate-600
                  dark:hover:text-slate-200
                "
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Repeat new password"
          />

          <button
            type="button"
            onClick={changePassword}
            className="
              flex items-center gap-2
              rounded-lg
              bg-[#0052CC]
              px-4 py-2.5
              text-sm font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            <KeyRound size={15} />
            Change Password
          </button>
        </div>
      </SectionCard>

      <SectionCard
        icon={Shield}
        title="Two-Factor Authentication"
        description="Add an additional layer of account security."
      >
        <SettingRow
          title="Enable 2FA"
          description="Require an additional verification step during login."
          checked={
            settings.security.twoFactor
          }
          onChange={toggleTwoFactor}
        />
      </SectionCard>

      <section
        className="
          overflow-hidden rounded-2xl
          border border-red-200
          bg-white
          shadow-sm
          dark:border-red-900
          dark:bg-slate-900
        "
      >
        <div
          className="
            flex items-center gap-3
            border-b border-red-100
            px-6 py-5
            dark:border-red-900
          "
        >
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-red-50
              text-red-600
              dark:bg-red-950/50
              dark:text-red-400
            "
          >
            <Trash2 size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
              Danger Zone
            </h2>

            <p className="mt-0.5 text-xs text-red-400 dark:text-red-500">
              Destructive account actions.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Delete Account
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Permanently remove your account and
              associated data.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.error(
                "Account deletion requires backend confirmation",
                {
                  id: "delete-account",
                }
              )
            }
            className="
              rounded-lg
              border border-red-200
              px-4 py-2.5
              text-sm font-semibold
              text-red-600
              hover:bg-red-50
              dark:border-red-900
              dark:hover:bg-red-950/40
            "
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );

  /* =======================================================================
     CONTENT
  ======================================================================= */

  const renderContent = () => {
    switch (activeTab) {
      case "organization":
        return renderOrganization();

      case "workspace":
        return renderWorkspace();

      case "members":
        return renderMembers();

      case "permissions":
        return renderPermissions();

      case "notifications":
        return renderNotifications();

      case "appearance":
        return renderAppearance();

      case "security":
        return renderSecurity();

      case "profile":
      default:
        return renderProfile();
    }
  };

  /* =======================================================================
     RENDER
  ======================================================================= */

  return (
    <div className="min-h-full text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Settings size={14} />

          <span>Settings</span>

          <ChevronRight size={13} />

          <span className="text-slate-600 dark:text-slate-300">
            {tabs.find(
              (tab) =>
                tab.id === activeTab
            )?.label || "Profile"}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] dark:text-slate-100">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account, workspace,
          members, notifications and security.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside
          className="
            h-fit
            rounded-2xl
            border border-slate-200
            bg-white
            p-2
            shadow-sm
            lg:sticky lg:top-5
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  flex w-full items-center
                  gap-3 rounded-xl
                  px-3 py-2.5
                  text-left text-sm font-semibold
                  transition
                  ${
                    active
                      ? "bg-blue-50 text-[#0052CC] dark:bg-blue-950/50 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }
                `}
              >
                <Icon size={17} />

                <span>
                  {tab.label}
                </span>

                {active && (
                  <ChevronRight
                    size={15}
                    className="ml-auto"
                  />
                )}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <main>{renderContent()}</main>
      </div>

      {/* =================================================================
          INVITE MEMBER MODAL
      ================================================================= */}

      {inviteOpen && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setInviteOpen(false)
          }
        >
          <div
            className="
              w-full max-w-lg
              overflow-hidden rounded-2xl
              bg-white
              shadow-2xl
              dark:bg-slate-900
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              className="
                flex items-center
                justify-between
                border-b border-slate-200
                px-6 py-4
                dark:border-slate-800
              "
            >
              <div>
                <h2 className="text-lg font-bold text-[#172B4D] dark:text-slate-100">
                  Invite Member
                </h2>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Add a new member to your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setInviteOpen(false)
                }
                className="
                  rounded-lg p-2
                  text-slate-400
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <InputField
                label="Full Name"
                value={inviteName}
                onChange={(e) =>
                  setInviteName(
                    e.target.value
                  )
                }
                placeholder="e.g. Ali Ahmed"
              />

              <InputField
                label="Email"
                type="email"
                value={inviteEmail}
                onChange={(e) =>
                  setInviteEmail(
                    e.target.value
                  )
                }
                placeholder="member@example.com"
              />

              <SelectField
                label="Role"
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(
                    e.target.value
                  )
                }
                options={ROLES}
              />
            </div>

            <div
              className="
                flex justify-end gap-2
                border-t border-slate-200
                px-6 py-4
                dark:border-slate-800
              "
            >
              <button
                type="button"
                onClick={() =>
                  setInviteOpen(false)
                }
                className="
                  rounded-lg
                  px-4 py-2.5
                  text-sm font-semibold
                  text-slate-600
                  hover:bg-slate-100
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={inviteMember}
                className="
                  flex items-center gap-2
                  rounded-lg
                  bg-[#0052CC]
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  hover:bg-blue-700
                "
              >
                <Plus size={15} />
                Invite Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModule;
