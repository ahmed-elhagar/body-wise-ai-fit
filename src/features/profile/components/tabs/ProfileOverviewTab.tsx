
import ProfileOverviewCard from "../ProfileOverviewCard";
import ProfileGoalsCard from "../ProfileGoalsCard";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";

const ProfileOverviewTab = () => {
  const { formData } = useProfileForm();

  const handleEdit = () => {
    // This could navigate to edit mode or trigger edit state
    console.log('Edit profile clicked');
  };

  return (
    <div className="space-y-6">
      <ProfileOverviewCard 
        profile={formData}
      />
      <ProfileGoalsCard 
        formData={formData}
        updateFormData={() => {}}
        handleArrayInput={() => {}}
        saveGoalsAndActivity={async () => true}
        isUpdating={false}
        validationErrors={{}}
      />
    </div>
  );
};

export default ProfileOverviewTab;
