
import ProfileBasicInfoCard from "./ProfileBasicInfoCard";
import ProfileGoalsCard from "./ProfileGoalsCard";
import ProfileHealthCard from "./ProfileHealthCard";

interface ProfileViewProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileView = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileViewProps) => {
  return (
    <div className="space-y-6">
      <ProfileBasicInfoCard
        formData={formData}
        updateFormData={updateFormData}
        saveBasicInfo={saveBasicInfo}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />

      <ProfileGoalsCard
        formData={formData}
        updateFormData={updateFormData}
        handleArrayInput={handleArrayInput}
        saveGoalsAndActivity={saveGoalsAndActivity}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />

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

export default ProfileView;
