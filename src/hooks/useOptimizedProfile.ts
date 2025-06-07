
import { useMemo } from 'react';
import { useProfile } from './useProfile';
import { useAuth } from './useAuth';
import { useProfileFormData } from './profile/useProfileFormData';
import { useProfileActions } from './profile/useProfileActions';
import { useProfileCompletion } from './profile/useProfileCompletion';

export const useOptimizedProfile = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, refetch } = useProfile();
  
  // Add the missing form data and actions
  const { 
    formData, 
    updateFormData, 
    handleArrayInput, 
    validationErrors, 
    setValidationErrors 
  } = useProfileFormData();
  
  const { saveProfile, isUpdating } = useProfileActions();
  const { completionPercentage } = useProfileCompletion(formData);

  const profileMetrics = useMemo(() => {
    if (!profile) return null;

    return {
      completionScore: profile.profile_completion_score || 0,
      hasBasicInfo: !!(profile.first_name && profile.last_name && profile.age),
      hasPhysicalInfo: !!(profile.height && profile.weight),
      hasGoals: !!(profile.fitness_goal && profile.activity_level),
      isProfileComplete: (profile.profile_completion_score || 0) >= 80
    };
  }, [profile]);

  const isProfileComplete = useMemo(() => {
    return profileMetrics?.completionScore >= 80;
  }, [profileMetrics]);

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
    user,
    profile,
    profileMetrics,
    isProfileComplete,
    isLoading,
    updateProfile,
    refetch,
    // Form data and actions
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
