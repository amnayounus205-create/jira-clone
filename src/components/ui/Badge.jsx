const colors = {
  Active: "bg-green-100 text-green-700",

  Planning:
    "bg-yellow-100 text-yellow-700",

  Completed:
    "bg-blue-100 text-blue-700",

  Todo:
    "bg-gray-100 text-gray-700",

  Review:
    "bg-orange-100 text-orange-700",

  "In Progress":
    "bg-blue-100 text-blue-700",

  Done:
    "bg-green-100 text-green-700",
};

const Badge = ({ children }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm ${colors[children]}`}
    >
      {children}
    </span>
  );
};

export default Badge;