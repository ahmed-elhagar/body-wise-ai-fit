
import ProfileOverviewCard from "../../ProfileOverviewCard";
import ProfileGoalsCard from "../../ProfileGoalsCard";
import { useProfileForm } from "@/hooks/useProfileForm";

const ProfileOverviewTab = () => {
  const { formData } = useProfileForm();

  const handleEdit = () => {
    // This could navigate to edit mode or trigger edit state
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
