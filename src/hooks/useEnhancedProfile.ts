
import { useProfileFormData } from "./profile/useProfileFormData";
import { useProfileActions } from "./profile/useProfileActions";
import { useProfileCompletion } from "./profile/useProfileCompletion";
import { useHealthAssessment } from "./useHealthAssessment";

export const useEnhancedProfile = () => {
  const { 
    formData, 
    updateFormData, 
    handleArrayInput, 
    validationErrors, 
    setValidationErrors 
  } = useProfileFormData();
  
  const { saveProfile, isUpdating } = useProfileActions();
  const { completionPercentage, assessment } = useProfileCompletion(formData);
  const { isSaving: isSavingAssessment } = useHealthAssessment();

  // Create save functions that match expected signatures
  const saveBasicInfo = async () => {
    const result = await saveProfile(formData);
    return result.success;
  };

  const saveGoalsAndActivity = async () => {
    const result = await saveProfile(formData);
    return result.success;
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating: isUpdating || isSavingAssessment,
    validationErrors,
    completionPercentage,
    assessment,
  };
};
