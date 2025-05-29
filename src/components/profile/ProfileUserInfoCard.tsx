
import { Target } from "lucide-react";

interface ProfileUserInfoCardProps {
  formData: any;
  user: any;
  completionPercentage: number;
}

const ProfileUserInfoCard = ({ formData, user, completionPercentage }: ProfileUserInfoCardProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">
              {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {formData.first_name && formData.last_name 
                ? `${formData.first_name} ${formData.last_name}` 
                : "Welcome to FitGenius"}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">{completionPercentage}% Complete</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center">
            <p className="text-blue-600 text-xs font-medium">Height</p>
            <p className="font-bold text-sm text-gray-800">{formData.height ? `${formData.height}cm` : "—"}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center">
            <p className="text-green-600 text-xs font-medium">Weight</p>
            <p className="font-bold text-sm text-gray-800">{formData.weight ? `${formData.weight}kg` : "—"}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center">
            <p className="text-purple-600 text-xs font-medium">Goal</p>
            <p className="font-bold text-xs text-gray-800 capitalize">{formData.fitness_goal?.replace('_', ' ') || "—"}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg text-center">
            <p className="text-orange-600 text-xs font-medium">Activity</p>
            <p className="font-bold text-xs text-gray-800 capitalize">{formData.activity_level?.replace('_', ' ') || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserInfoCard;
