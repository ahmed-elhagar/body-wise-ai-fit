
import ProfileBasicInfoCard from "./enhanced/ProfileBasicInfoCard";
import ProfileGoalsCard from "./enhanced/ProfileGoalsCard";
import ProfileHealthCard from "../enhanced/ProfileHealthCard";

interface RefactoredProfileViewProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const RefactoredProfileView = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: RefactoredProfileViewProps) => {
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

export default RefactoredProfileView;
