const EmptyState = ({
  title = "No Data Found",
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-10 text-center">

      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        Nothing to display.
      </p>

    </div>
  );
};

export default EmptyState;