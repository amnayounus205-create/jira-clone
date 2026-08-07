import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema } from "./projectSchema";

const ProjectModal = ({
  open,
  onClose,
  onSubmit,
  project,
}) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {

    if (project) {

      reset(project);

    } else {

      reset({
        name: "",
        key: "",
        lead: "",
        status: "Planning",
        startDate: "",
        endDate: "",
      });

    }

  }, [project, reset]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">

            {project ? "Edit Project" : "Create Project"}

          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          <div>

            <label>Project Name</label>

            <input
              {...register("name")}
              className="w-full border rounded-lg p-3 mt-1"
            />

            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>

          </div>

          <div>

            <label>Project Key</label>

            <input
              {...register("key")}
              className="w-full border rounded-lg p-3 mt-1"
            />

            <p className="text-red-500 text-sm">
              {errors.key?.message}
            </p>

          </div>

          <div>

            <label>Project Lead</label>

            <input
              {...register("lead")}
              className="w-full border rounded-lg p-3 mt-1"
            />

            <p className="text-red-500 text-sm">
              {errors.lead?.message}
            </p>

          </div>

          <div>

            <label>Status</label>

            <select
              {...register("status")}
              className="w-full border rounded-lg p-3 mt-1"
            >

              <option>Planning</option>

              <option>Active</option>

              <option>Completed</option>

            </select>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label>Start Date</label>

              <input
                type="date"
                {...register("startDate")}
                className="w-full border rounded-lg p-3 mt-1"
              />

            </div>

            <div>

              <label>End Date</label>

              <input
                type="date"
                {...register("endDate")}
                className="w-full border rounded-lg p-3 mt-1"
              />

            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#0052CC] text-white px-6 py-2 rounded-lg"
            >
              {project ? "Update" : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};

export default ProjectModal;