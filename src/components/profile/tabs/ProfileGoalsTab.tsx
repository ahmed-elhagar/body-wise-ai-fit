
import EnhancedGoalsForm from "../enhanced/EnhancedGoalsForm";

interface ProfileGoalsTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileGoalsTab = ({ 
  formData, 
  updateFormData, 
  handleArrayInput,
  saveGoalsAndActivity, 
  isUpdating, 
  validationErrors 
}: ProfileGoalsTabProps) => {
  return (
    <div className="space-y-6">
      <EnhancedGoalsForm
        formData={formData}
        updateFormData={updateFormData}
        handleArrayInput={handleArrayInput}
        onSave={saveGoalsAndActivity}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default ProfileGoalsTab;
