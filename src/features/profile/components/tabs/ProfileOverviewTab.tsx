
import { useOptimizedProfile } from "@/hooks/useOptimizedProfile";
import ProfileOverviewCard from "../ProfileOverviewCard";

const ProfileOverviewTab = () => {
  const { profile, formData } = useOptimizedProfile();

  return (
    <div className="space-y-6">
      <ProfileOverviewCard 
        profile={profile || formData} 
      />
    </div>
  );
};

export default ProfileOverviewTab;
