import { useMemo } from 'react';
import { useProfile } from './useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfileFormData } from '@/features/profile/hooks/useProfileFormData';
import { useProfileActions } from '@/features/profile/hooks/useProfileActions';
import { useProfileCompletion } from '@/features/profile/hooks/useProfileCompletion';

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

    // Calculate completion based on actual profile data
    let score = 0;
    if (profile.first_name) score += 15;
    if (profile.last_name) score += 15;
    if (profile.age) score += 10;
    if (profile.gender) score += 10;
    if (profile.height) score += 10;
    if (profile.weight) score += 10;
    if (profile.body_fat_percentage) score += 10;
    if (profile.fitness_goal) score += 10;
    if (profile.activity_level) score += 10;

    return {
      completionScore: Math.min(score, 100),
      hasBasicInfo: !!(profile.first_name && profile.last_name && profile.age),
      hasPhysicalInfo: !!(profile.height && profile.weight),
      hasBodyComposition: !!(profile.body_fat_percentage && profile.body_shape),
      hasGoals: !!(profile.fitness_goal && profile.activity_level),
      isProfileComplete: score >= 80
    };
  }, [profile]);

  const isProfileComplete = useMemo(() => {
    return (profileMetrics?.completionScore || 0) >= 80;
  }, [profileMetrics]);

  // Create save functions that match expected signatures
  const saveBasicInfo = async () => {
    const result = await saveProfile(formData);
    if (result.success) {
      await refetch(); // Refresh profile data after save
    }
    return result.success;
  };

  const saveGoalsAndActivity = async () => {
    const result = await saveProfile(formData);
    if (result.success) {
      await refetch(); // Refresh profile data after save
    }
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
    completionPercentage: profileMetrics?.completionScore || 0,
  };
};
