const members = [
  "Muhammad Ali",
  "Sarah Khan",
  "Ahmed Raza",
  "Hamza",
];

const TeamMembers = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="font-bold text-lg mb-4">
        Team Members
      </h2>

      <div className="space-y-4">

        {members.map((member) => (

          <div
            key={member}
            className="flex items-center gap-3"
          >

            <img
              src={`https://i.pravatar.cc/40?u=${member}`}
              className="rounded-full"
            />

            <div>

              <p className="font-medium">
                {member}
              </p>

              <p className="text-sm text-gray-500">
                Developer
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default TeamMembers;