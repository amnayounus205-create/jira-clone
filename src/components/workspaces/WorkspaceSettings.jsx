import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Archive, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const workspaceSettingsSchema = z.object({
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters"),

  key: z
    .string()
    .min(2, "Workspace key is required")
    .max(5, "Maximum 5 characters")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Workspace key can only contain letters and numbers"
    ),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  status: z.enum(["Active", "Archived"]),
});

const WorkspaceSettings = ({
  workspace,
  onSave,
  onArchive,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workspaceSettingsSchema),
    defaultValues: {
      name: workspace.name,
      key: workspace.key,
      description: workspace.description,
      status: workspace.status,
    },
  });

  useEffect(() => {
    reset({
      name: workspace.name,
      key: workspace.key,
      description: workspace.description,
      status: workspace.status,
    });
  }, [workspace, reset]);

  const submitHandler = (data) => {
    onSave({
      ...data,
      key: data.key.toUpperCase(),
    });

    toast.success("Workspace updated successfully");
  };

  const handleArchive = () => {
    onArchive();

    toast.success(
      workspace.status === "Archived"
        ? "Workspace activated successfully"
        : "Workspace archived successfully"
    );
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    onDelete();

    toast.success("Workspace deleted successfully");
  };

  return (
    <div className="space-y-5">

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-[#172B4D]">
            Workspace Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your workspace information and preferences.
          </p>

        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-6"
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172B4D]">
                Workspace Name
              </label>

              <input
                {...register("name")}
                type="text"
                className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
                placeholder="Enter workspace name"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172B4D]">
                Workspace Key
              </label>

              <input
                {...register("key")}
                type="text"
                className="w-full rounded-lg border px-4 py-3 uppercase outline-none transition focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
                placeholder="JIRA"
              />

              {errors.key && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.key.message}
                </p>
              )}
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#172B4D]">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={5}
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
              placeholder="Describe your workspace..."
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172B4D]">
                Workspace Status
              </label>

              <select
                {...register("status")}
                className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Archived">
                  Archived
                </option>
              </select>

              {errors.status && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172B4D]">
                Workspace Owner
              </label>

              <input
                value={workspace.owner}
                disabled
                className="w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-400">
                Workspace owner can be changed from member management.
              </p>
            </div>

          </div>

          <div className="flex justify-end border-t pt-5">

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#0052CC] px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

      <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h3 className="font-bold text-[#172B4D]">
              {workspace.status === "Archived"
                ? "Activate Workspace"
                : "Archive Workspace"}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {workspace.status === "Archived"
                ? "Make this workspace active again."
                : "Archived workspaces are no longer active but can be restored later."}
            </p>

          </div>

          <button
            type="button"
            onClick={handleArchive}
            className="flex items-center justify-center gap-2 rounded-lg border border-orange-300 px-5 py-2.5 font-medium text-orange-600 transition hover:bg-orange-50"
          >
            <Archive size={17} />
            {workspace.status === "Archived"
              ? "Activate"
              : "Archive"}
          </button>

        </div>

      </div>

      <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h3 className="font-bold text-red-600">
              Delete Workspace
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Permanently delete this workspace and all of its data.
            </p>

          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-300 px-5 py-2.5 font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={17} />
            Delete Workspace
          </button>

        </div>

      </div>

    </div>
  );
};

export default WorkspaceSettings;