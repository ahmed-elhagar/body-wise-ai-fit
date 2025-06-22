
import ProfileHealthCard from "../ProfileHealthCard";
import { useOptimizedProfile } from "@/features/profile/hooks/useOptimizedProfile";

const ProfileHealthTab = () => {
  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
  } = useOptimizedProfile();

  return (
    <div className="space-y-6">
      <ProfileHealthCard
        formData={formData}
        updateFormData={updateFormData}
        handleArrayInput={handleArrayInput}
        saveGoalsAndActivity={saveGoalsAndActivity}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default ProfileHealthTab;
