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
    resolver: zodResolver(organizationSchema),
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

  // ===========================
  // RESET FORM
  // ===========================

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

  // ===========================
  // LOCK BACKGROUND SCROLL
  // ===========================

  useEffect(() => {
    if (!open) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

  // ===========================
  // CLOSE WITH ESCAPE
  // ===========================

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-3
        backdrop-blur-[2px]
        sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className="
          flex
          w-full
          max-w-2xl
          max-h-[calc(100vh-24px)]
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
          sm:max-h-[calc(100vh-40px)]
          sm:rounded-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div className="min-w-0 pr-4">
            <h2
              className="
                truncate
                text-lg
                font-bold
                tracking-tight
                text-[#172B4D]
                sm:text-xl
              "
            >
              {organization
                ? "Edit Organization"
                : "Create Organization"}
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                sm:text-sm
              "
            >
              {organization
                ? "Update the organization details below."
                : "Add a new organization to your workspace."}
            </p>
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/20
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ==================================================
            FORM CONTENT
        ================================================== */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
            flex
            min-h-0
            flex-1
            flex-col
          "
        >
          {/* SCROLLABLE CONTENT */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-4
              py-5
              sm:px-6
              sm:py-6
            "
          >
            <div className="space-y-5">
              {/* ==================================================
                  BASIC INFORMATION
              ================================================== */}

              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  Organization Information
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Enter the basic details of your organization.
                </p>
              </div>

              {/* ==================================================
                  INPUT GRID
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                {/* ORGANIZATION NAME */}

                <div className="min-w-0">
                  <label
                    htmlFor="organization-name"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Organization Name
                  </label>

                  <input
                    id="organization-name"
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Acme Corporation"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0052CC]
                      focus:ring-2
                      focus:ring-[#0052CC]/10
                    "
                  />

                  {errors.name?.message && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* ORGANIZATION KEY */}

                <div className="min-w-0">
                  <label
                    htmlFor="organization-key"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Organization Key
                  </label>

                  <input
                    id="organization-key"
                    type="text"
                    {...register("key")}
                    placeholder="e.g. ACME"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      uppercase
                      text-slate-800
                      outline-none
                      transition
                      placeholder:normal-case
                      placeholder:text-slate-400
                      focus:border-[#0052CC]
                      focus:ring-2
                      focus:ring-[#0052CC]/10
                    "
                  />

                  {errors.key?.message && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.key.message}
                    </p>
                  )}
                </div>

                {/* OWNER */}

                <div className="min-w-0">
                  <label
                    htmlFor="organization-owner"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Owner
                  </label>

                  <input
                    id="organization-owner"
                    type="text"
                    {...register("owner")}
                    placeholder="Owner name"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0052CC]
                      focus:ring-2
                      focus:ring-[#0052CC]/10
                    "
                  />

                  {errors.owner?.message && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.owner.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div className="min-w-0">
                  <label
                    htmlFor="organization-email"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Email
                  </label>

                  <input
                    id="organization-email"
                    type="email"
                    {...register("email")}
                    placeholder="name@company.com"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0052CC]
                      focus:ring-2
                      focus:ring-[#0052CC]/10
                    "
                  />

                  {errors.email?.message && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PHONE */}

                <div className="min-w-0">
                  <label
                    htmlFor="organization-phone"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Phone
                  </label>

                  <input
                    id="organization-phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+92 300 1234567"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0052CC]
                      focus:ring-2
                      focus:ring-[#0052CC]/10
                    "
                  />

                  {errors.phone?.message && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* WEBSITE */}

                <div className="min-w-0">
                  <label
                    htmlFor="organization-website"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Website
                  </label>

                  <input
                    id="organization-website"
                    type="url"
                    {...register("website")}
                    placeholder="https://example.com"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0052CC]
                      focus:ring-2
                      focus:ring-[#0052CC]/10
                    "
                  />

                  {errors.website?.message && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div>
                <label
                  htmlFor="organization-description"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Description
                </label>

                <textarea
                  id="organization-description"
                  rows={4}
                  {...register("description")}
                  placeholder="Briefly describe this organization..."
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#0052CC]
                    focus:ring-2
                    focus:ring-[#0052CC]/10
                  "
                />

                {errors.description?.message && (
                  <p
                    className="
                      mt-1
                      text-xs
                      text-red-500
                    "
                  >
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* ==================================================
                  STATUS
              ================================================== */}

              <div>
                <label
                  htmlFor="organization-status"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Status
                </label>

                <select
                  id="organization-status"
                  {...register("status")}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-[#0052CC]
                    focus:ring-2
                    focus:ring-[#0052CC]/10
                  "
                >
                  <option value="Planning">
                    Planning
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>

                {errors.status?.message && (
                  <p
                    className="
                      mt-1
                      text-xs
                      text-red-500
                    "
                  >
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              FOOTER / ACTIONS
          ================================================== */}

          <div
            className="
              shrink-0
              border-t
              border-slate-200
              bg-slate-50/80
              px-4
              py-3
              sm:px-6
              sm:py-4
            "
          >
            <div
              className="
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-end
                sm:gap-3
              "
            >
              {/* CANCEL */}

              <button
                type="button"
                onClick={onClose}
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-300/50
                  sm:w-auto
                "
              >
                Cancel
              </button>

              {/* SUBMIT */}

              <button
                type="submit"
                className="
                  w-full
                  rounded-lg
                  bg-[#0052CC]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  active:scale-[0.98]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0052CC]/30
                  sm:w-auto
                "
              >
                {organization
                  ? "Update Organization"
                  : "Create Organization"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationModal;