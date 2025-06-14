
import { useOptimizedProfile } from './useOptimizedProfile';

export const useEnhancedProfile = () => {
  const {
    user,
    profile,
    profileMetrics,
    isProfileComplete,
    isLoading,
    updateProfile,
    refetch,
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage,
  } = useOptimizedProfile();

  console.log('Enhanced Profile Hook - Current Data:', {
    hasProfile: !!profile,
    formData: {
      body_shape: formData.body_shape,
      gender: formData.gender,
      nationality: formData.nationality
    },
    isLoading,
    completionPercentage
  });

  return {
    user,
    profile,
    profileMetrics,
    isProfileComplete,
    isLoading,
    updateProfile,
    refetch,
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
