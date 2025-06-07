
import { useProfile } from './useProfile';
import { useOptimizedProfile } from './useOptimizedProfile';

export const useProfileForm = () => {
  const { profile } = useProfile();
  const { formData, updateFormData, handleArrayInput, saveBasicInfo, isUpdating } = useOptimizedProfile();

  const handleSave = async () => {
    return await saveBasicInfo();
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    handleSave,
    isUpdating,
    profile
  };
};
