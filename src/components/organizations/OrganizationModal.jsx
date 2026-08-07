import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { organizationSchema } from "./organizationSchema";

const OrganizationModal = ({
  open,
  onClose,
  onSubmit,
  organization,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      organizationSchema
    ),
    defaultValues: {
      name: "",
      key: "",
      owner: "",
      email: "",
      phone: "",
      website: "",
      description: "",
      status: "Planning",
    },
  });

  useEffect(() => {
    if (organization) {
      reset(organization);
    } else {
      reset({
        name: "",
        key: "",
        owner: "",
        email: "",
        phone: "",
        website: "",
        description: "",
        status: "Planning",
      });
    }
  }, [organization, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-2xl p-7 relative">

        <button
          onClick={onClose}
          className="absolute right-5 top-5"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {organization
            ? "Edit Organization"
            : "Create Organization"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label>Organization Name</label>

              <input
                {...register("name")}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-red-500 text-sm">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label>Organization Key</label>

              <input
                {...register("key")}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-red-500 text-sm">
                {errors.key?.message}
              </p>
            </div>

            <div>
              <label>Owner</label>

              <input
                {...register("owner")}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-red-500 text-sm">
                {errors.owner?.message}
              </p>
            </div>

            <div>
              <label>Email</label>

              <input
                {...register("email")}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-red-500 text-sm">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label>Phone</label>

              <input
                {...register("phone")}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-red-500 text-sm">
                {errors.phone?.message}
              </p>
            </div>

            <div>
              <label>Website</label>

              <input
                {...register("website")}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-red-500 text-sm">
                {errors.website?.message}
              </p>
            </div>

          </div>

          <div>
            <label>Description</label>

            <textarea
              rows={4}
              {...register("description")}
              className="w-full border rounded-lg p-3"
            />

            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label>Status</label>

            <select
              {...register("status")}
              className="w-full border rounded-lg p-3"
            >
              <option>Planning</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-3 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#0052CC] text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {organization
                ? "Update Organization"
                : "Create Organization"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default OrganizationModal;