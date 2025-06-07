
import { useProfile } from './useProfile';
import { useProfileForm } from './useProfileForm';
import { useMemo } from 'react';

export const useProfileData = () => {
  const { profile, isLoading, updateProfile, refetch } = useProfile();
  const { 
    formData, 
    updateFormData, 
    handleArrayInput, 
    handleSave, 
    isUpdating, 
    validationErrors 
  } = useProfileForm();

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
    return await handleSave();
  };

  const saveGoalsAndActivity = async () => {
    return await handleSave();
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
    updateProfile,
    refetch,
  };
};
