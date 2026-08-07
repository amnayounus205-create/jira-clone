const activities = [
  "Sprint Started",
  "Bug Fixed",
  "Task Assigned",
  "Project Updated",
  "Story Completed",
];

const ActivityTimeline = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="font-bold text-lg mb-4">
        Recent Activities
      </h2>

      <div className="space-y-4">

        {activities.map((item, index) => (

          <div
            key={index}
            className="border-l-4 border-[#0052CC] pl-4"
          >

            <p>{item}</p>

            <span className="text-xs text-gray-400">
              Today
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ActivityTimeline;