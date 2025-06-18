
import { useOptimizedProfile } from "@/hooks/useOptimizedProfile";
import ProfileOverviewCard from "../ProfileOverviewCard";

const ProfileOverviewTab = () => {
  const { profile, formData } = useOptimizedProfile();

  const handleEdit = () => {
    // Tab navigation will be handled by parent component
    console.log('Edit profile clicked');
  };

  return (
    <div className="space-y-6">
      <ProfileOverviewCard 
        profile={profile || formData} 
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ProfileOverviewTab;
