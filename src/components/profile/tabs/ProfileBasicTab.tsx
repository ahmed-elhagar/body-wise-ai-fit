
import EnhancedBasicInfoForm from "../enhanced/EnhancedBasicInfoForm";

interface ProfileBasicTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  saveBasicInfo: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileBasicTab = ({ 
  formData, 
  updateFormData, 
  saveBasicInfo, 
  isUpdating, 
  validationErrors 
}: ProfileBasicTabProps) => {
  return (
    <div className="space-y-6">
      <EnhancedBasicInfoForm
        formData={formData}
        updateFormData={updateFormData}
        onSave={saveBasicInfo}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default ProfileBasicTab;
