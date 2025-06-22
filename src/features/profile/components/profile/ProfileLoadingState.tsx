
import { Loader2 } from "lucide-react";

const ProfileLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
        <p className="text-gray-700 font-medium text-lg">Loading Profile...</p>
        <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your information</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
