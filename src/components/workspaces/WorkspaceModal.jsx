import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { workspaceSchema } from "./workspaceSchema";

const WorkspaceModal = ({
  open,
  onClose,
  onSubmit,
  workspace,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      owner: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (workspace) {
      reset({
        name: workspace.name,
        key: workspace.key,
        description: workspace.description,
        owner: workspace.owner,
        status: workspace.status,
      });
    } else {
      reset({
        name: "",
        key: "",
        description: "",
        owner: "",
        status: "Active",
      });
    }
  }, [workspace, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#172B4D]">
              {workspace ? "Edit Workspace" : "Create Workspace"}
            </h2>

            <p className="text-sm text-gray-500">
              {workspace
                ? "Update workspace information"
                : "Create a new workspace"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-6"
        >
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Workspace Name
            </label>

            <input
              {...register("name")}
              placeholder="e.g. Product Team"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Key */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Workspace Key
            </label>

            <input
              {...register("key")}
              placeholder="PROD"
              className="w-full rounded-lg border px-4 py-3 uppercase outline-none focus:border-[#0052CC]"
            />

            {errors.key && (
              <p className="mt-1 text-sm text-red-500">
                {errors.key.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              {...register("description")}
              rows="3"
              placeholder="Describe this workspace..."
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Owner */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Workspace Owner
            </label>

            <input
              {...register("owner")}
              placeholder="Enter owner name"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            />

            {errors.owner && (
              <p className="mt-1 text-sm text-red-500">
                {errors.owner.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              {...register("status")}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#0052CC] px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              {workspace ? "Update Workspace" : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceModal;