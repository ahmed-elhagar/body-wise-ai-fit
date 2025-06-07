
import { useProfile } from './useProfile';
import { useProfileFormData } from './profile/useProfileFormData';
import { useProfileActions } from './profile/useProfileActions';
import { useProfileCompletion } from './profile/useProfileCompletion';

export const useEnhancedProfile = () => {
  const { profile } = useProfile();
  const { formData, updateFormData, handleArrayInput, validationErrors } = useProfileFormData();
  const { saveProfile, isUpdating } = useProfileActions();
  const { completionPercentage } = useProfileCompletion(formData);

  const saveBasicInfo = async () => {
    const result = await saveProfile(formData);
    return result.success;
  };

  const saveGoalsAndActivity = async () => {
    const result = await saveProfile(formData);
    return result.success;
  };

  return {
    profile,
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage,
  };
};
