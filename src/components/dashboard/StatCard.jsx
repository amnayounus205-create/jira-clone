const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2
        className="text-3xl font-bold mt-2"
        style={{ color }}
      >
        {value}
      </h2>
    </div>
  );
};

export default StatCard;