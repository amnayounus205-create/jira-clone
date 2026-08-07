const Input = ({
  label,
  error,
  ...props
}) => {
  return (
    <div>

      {label && (
        <label className="block mb-2 font-medium">
          {label}
        </label>
      )}

      <input
        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0052CC]"
        {...props}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;