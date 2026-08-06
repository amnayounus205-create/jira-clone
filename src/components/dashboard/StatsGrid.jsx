import StatCard from "./StatCard";

const StatsGrid = () => {
  const stats = [
    {
      title: "Projects",
      value: 12,
      color: "#0052CC",
    },
    {
      title: "Issues",
      value: 154,
      color: "#3B82F6",
    },
    {
      title: "Sprint",
      value: 5,
      color: "#22C55E",
    },
    {
      title: "Team Members",
      value: 18,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
};

export default StatsGrid;