
import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { useHealthAssessment } from "./useHealthAssessment";
import { useOnboardingProgress } from "./useOnboardingProgress";
import { toast } from "sonner";

export const useEnhancedProfile = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  const { assessment, saveAssessment, isSaving: isSavingAssessment } = useHealthAssessment();
  const { markStepComplete } = useOnboardingProgress();
  
  const [formData, setFormData] = useState({
    // Basic Info
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    
    // Goals & Activity
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        health_conditions: profile.health_conditions || [],
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || [],
      }));
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const saveBasicInfo = async () => {
    try {
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nationality: formData.nationality,
        body_shape: formData.body_shape,
      };
      
      await updateProfile(profileData);
      markStepComplete('basic_info');
      toast.success('Basic information saved successfully!');
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Failed to save basic information');
    }
  };

  const saveGoalsAndActivity = async () => {
    try {
      const profileData = {
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions,
      };
      
      await updateProfile(profileData);
      markStepComplete('goals_setup');
      toast.success('Goals and preferences saved successfully!');
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals and preferences');
    }
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating: isUpdating || isSavingAssessment,
  };
};
