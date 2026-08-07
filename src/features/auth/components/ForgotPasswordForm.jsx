import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { forgotPasswordSchema } from "../validation/loginSchema";

const ForgotPasswordForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {

    console.log(data);

    toast.success("Password reset link sent to your email.");

  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >

      <div>

        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          {...register("email")}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="admin@gmail.com"
        />

        <p className="text-red-500 text-sm mt-1">
          {errors.email?.message}
        </p>

      </div>

      <button
        type="submit"
        className="w-full bg-[#0052CC] text-white py-3 rounded-lg"
      >
        Send Reset Link
      </button>

      <div className="text-center">

        <Link
          to="/login"
          className="text-blue-600"
        >
          Back to Login
        </Link>

      </div>

    </form>
  );
};

export default ForgotPasswordForm;