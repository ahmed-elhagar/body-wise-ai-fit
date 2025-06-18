
import { useOptimizedProfile } from '@/hooks/useOptimizedProfile';

export const useProfileData = () => {
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

  return {
    // User and profile data
    user,
    profile,
    profileMetrics,
    isProfileComplete,
    isLoading,
    
    // Profile operations
    updateProfile,
    refetch,
    
    // Form data and operations
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
