
import ProfileOverviewCard from "../ProfileOverviewCard";
import ProfileGoalsCard from "../ProfileGoalsCard";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";

const ProfileOverviewTab = () => {
  const { formData } = useEnhancedProfile();

  const handleEdit = () => {
    console.log('Edit profile clicked');
  };

  return (
    <div className="space-y-6">
      <ProfileOverviewCard 
        formData={formData}
        onEdit={handleEdit}
      />
      <ProfileGoalsCard 
        formData={formData}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ProfileOverviewTab;
