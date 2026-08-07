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

      dispatch(loginSuccess(response));

      toast.success(
        `Welcome ${response.user.name} (${response.user.role})`
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Email */}

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter Email"
          {...register("email")}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <div>
        <label className="block mb-2 font-medium">
          Password
        </label>

        <div className="relative">
          <input
            type={
              showPassword ? "text" : "password"
            }
            placeholder="Enter Password"
            {...register("password")}
            className="w-full border rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-4"
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

      {/* Remember */}

      <div className="flex items-center justify-between">

        <label className="flex items-center gap-2 cursor-pointer">

          <input
            type="checkbox"
            checked={remember}
            onChange={(e) =>
              setRemember(e.target.checked)
            }
          />

          Remember Me

        </label>

        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition"
      >
        {isSubmitting
          ? "Signing In..."
          : "Login"}
      </button>

      {/* Demo Accounts */}

      <div className="bg-blue-50 border rounded-lg p-4 text-sm">

        <h3 className="font-bold mb-3">
          Demo Accounts
        </h3>

        <div className="space-y-2">

          <p>
            <strong>Super Admin</strong><br />
            admin@gmail.com / 123456
          </p>

          <p>
            <strong>Organization Admin</strong><br />
            org@gmail.com / 123456
          </p>

          <p>
            <strong>Project Manager</strong><br />
            pm@gmail.com / 123456
          </p>

          <p>
            <strong>Scrum Master</strong><br />
            scrum@gmail.com / 123456
          </p>

          <p>
            <strong>Developer</strong><br />
            developer@gmail.com / 123456
          </p>

          <p>
            <strong>QA Tester</strong><br />
            qa@gmail.com / 123456
          </p>

          <p>
            <strong>Viewer</strong><br />
            viewer@gmail.com / 123456
          </p>

        </div>

      </div>

    </form>
  );
};

export default LoginForm;