
import { Loader2 } from "lucide-react";

const ProfileLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="text-center">
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
