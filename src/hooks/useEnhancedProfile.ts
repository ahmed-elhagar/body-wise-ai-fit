
import { useProfile } from './useProfile';
import { useProfileFormState } from './useProfileFormState';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const useEnhancedProfile = () => {
  const { profile, isLoading, refetch } = useProfile();
  const { 
    formData, 
    updateFormData, 
    handleArrayInput, 
    saveProfile,
    isUpdating, 
    validationErrors 
  } = useProfileFormState();

  const completionPercentage = useMemo(() => {
    if (!profile) return 0;
    
    let completed = 0;
    let total = 10;

    if (profile.first_name) completed++;
    if (profile.last_name) completed++;
    if (profile.age) completed++;
    if (profile.gender) completed++;
    if (profile.height) completed++;
    if (profile.weight) completed++;
    if (profile.nationality) completed++;
    if (profile.body_shape) completed++;
    if (profile.fitness_goal) completed++;
    if (profile.activity_level) completed++;

    return Math.round((completed / total) * 100);
  }, [profile]);

  const saveBasicInfo = async () => {
    const success = await saveProfile();
    if (success) {
      toast.success('Basic information saved successfully!');
      refetch();
    } else {
      toast.error('Failed to save basic information');
    }
    return success;
  };

  const saveGoalsAndActivity = async () => {
    const success = await saveProfile();
    if (success) {
      toast.success('Goals and health information saved successfully!');
      refetch();
    } else {
      toast.error('Failed to save goals and health information');
    }
    return success;
  };

  return {
    profile,
    isLoading,
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage,
    refetch,
  };
};
