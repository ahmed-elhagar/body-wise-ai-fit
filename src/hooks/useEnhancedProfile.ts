
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
  
  const { 
    saveBasicInfo: saveBasicInfoAction, 
    saveGoalsAndActivity: saveGoalsAndActivityAction, 
    isUpdating 
  } = useProfileActions();
  
  const { completionPercentage, progress, assessment } = useProfileCompletion(formData);
  const { isSaving: isSavingAssessment } = useHealthAssessment();

  const saveBasicInfo = async () => {
    return await saveBasicInfoAction(formData, setValidationErrors);
  };

  const saveGoalsAndActivity = async () => {
    return await saveGoalsAndActivityAction(formData, setValidationErrors);
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
    progress,
    assessment,
  };
};
