const ProjectInfoCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="font-bold text-lg mb-5">
        Project Information
      </h2>

      <div className="space-y-3">

        <p>
          <strong>Lead :</strong> {project.lead}
        </p>

        <p>
          <strong>Status :</strong> {project.status}
        </p>

        <p>
          <strong>Start :</strong> {project.startDate}
        </p>

        <p>
          <strong>End :</strong> {project.endDate}
        </p>

        <p>
          <strong>Key :</strong> {project.key}
        </p>

      </div>

    </div>
  );
};

export default ProjectInfoCard;