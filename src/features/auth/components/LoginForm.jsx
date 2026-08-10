import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { loginSchema } from "../validation/loginSchema";
import { loginUser } from "../services/authService";
import { loginSuccess } from "../authSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        ...data,
        remember,
      });

      // Save auth in Redux + correct storage
      dispatch(
        loginSuccess({
          ...response,
          remember,
        })
      );

      toast.success(
        `Welcome ${response.user.name} (${response.user.role})`
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.message || "Login failed"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <label className="block mb-2 font-medium text-slate-800 dark:text-slate-200">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter Email"
          {...register("email")}
          className="
            w-full
            border border-slate-300
            dark:border-slate-700
            rounded-lg
            px-4 py-3
            outline-none
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-slate-100
            placeholder:text-slate-400
            dark:placeholder:text-slate-500
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-2 font-medium text-slate-800 dark:text-slate-200">
          Password
        </label>

        <div className="relative">
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter Password"
            {...register("password")}
            className="
              w-full
              border border-slate-300
              dark:border-slate-700
              rounded-lg
              px-4 py-3
              pr-12
              outline-none
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-slate-100
              placeholder:text-slate-400
              dark:placeholder:text-slate-500
              focus:ring-2
              focus:ring-blue-500
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
              absolute
              right-4
              top-4
              text-slate-500
              dark:text-slate-300
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) =>
              setRemember(
                e.target.checked
              )
            }
          />

          Remember Me
        </label>

        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline text-sm"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full
          bg-[#0052CC]
          hover:bg-blue-700
          disabled:opacity-60
          disabled:cursor-not-allowed
          text-white
          rounded-lg
          py-3
          font-semibold
          transition
        "
      >
        {isSubmitting
          ? "Signing In..."
          : "Login"}
      </button>

      {/* Demo Accounts */}
      <div
        className="
          bg-blue-50
          dark:bg-slate-800
          border
          border-blue-100
          dark:border-slate-700
          rounded-lg
          p-4
          text-sm
          text-slate-800
          dark:text-slate-200
          transition-colors
          duration-200
        "
      >
        <h3 className="font-bold mb-3 text-slate-900 dark:text-white">
          Demo Accounts
        </h3>

        <div className="space-y-2">

          <p>
            <strong className="text-slate-900 dark:text-white">
              Super Admin
            </strong>
            <br />
            admin@gmail.com / 123456
          </p>

          <p>
            <strong className="text-slate-900 dark:text-white">
              Organization Admin
            </strong>
            <br />
            org@gmail.com / 123456
          </p>

          <p>
            <strong className="text-slate-900 dark:text-white">
              Project Manager
            </strong>
            <br />
            pm@gmail.com / 123456
          </p>

          <p>
            <strong className="text-slate-900 dark:text-white">
              Scrum Master
            </strong>
            <br />
            scrum@gmail.com / 123456
          </p>

          <p>
            <strong className="text-slate-900 dark:text-white">
              Developer
            </strong>
            <br />
            developer@gmail.com / 123456
          </p>

          <p>
            <strong className="text-slate-900 dark:text-white">
              QA Tester
            </strong>
            <br />
            qa@gmail.com / 123456
          </p>

          <p>
            <strong className="text-slate-900 dark:text-white">
              Viewer
            </strong>
            <br />
            viewer@gmail.com / 123456
          </p>

        </div>
      </div>
    </form>
  );
};

export default LoginForm;
