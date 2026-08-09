import { useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addMemberSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  role: z.enum(["Admin", "Member", "Viewer"]),
});

const AddMemberModal = ({
  open,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "Member",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        username: "",
        email: "",
        role: "Member",
      });
    }
  }, [open, reset]);

  if (!open) {
    return null;
  }

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-[#0052CC]">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#172B4D]">
                Add Member
              </h2>

              <p className="text-sm text-gray-500">
                Add a new member to this workspace
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-5 p-6"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-[#172B4D]">
              Full Name
            </label>

            <input
              {...register("name")}
              placeholder="e.g. Muhammad Ali"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#172B4D]">
              Username
            </label>

            <input
              {...register("username")}
              placeholder="e.g. muhammad"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            />

            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#172B4D]">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="e.g. muhammad@example.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#172B4D]">
              Role
            </label>

            <select
              {...register("role")}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#0052CC]"
            >
              <option value="Admin">
                Admin
              </option>

              <option value="Member">
                Member
              </option>

              <option value="Viewer">
                Viewer
              </option>
            </select>

            {errors.role && (
              <p className="mt-1 text-xs text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#0052CC] px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Add Member
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddMemberModal;