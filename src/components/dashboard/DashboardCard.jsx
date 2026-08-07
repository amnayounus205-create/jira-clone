import {
  FolderKanban,
  Users,
  CheckCircle,
  AlertCircle,
  Layers,
  Activity
} from "lucide-react";


const icons = {
  Folder: FolderKanban,
  Users: Users,
  Done: CheckCircle,
  Review: AlertCircle,
  Sprint: Activity,
  Issue: Layers,
};


const DashboardCard = ({
  title,
  value,
  change,
  icon
}) => {


  const Icon = icons[icon];


  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>


          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>


          <p className="text-sm text-blue-600 mt-2">
            {change}
          </p>

        </div>


        <div className="bg-blue-100 p-3 rounded-lg">

          {Icon && (
            <Icon
              size={25}
              className="text-[#0052CC]"
            />
          )}

        </div>


      </div>

    </div>
  );
};


export default DashboardCard;