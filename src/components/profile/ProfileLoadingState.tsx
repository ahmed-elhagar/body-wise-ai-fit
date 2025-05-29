
import { Loader2 } from "lucide-react";

const ProfileLoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
