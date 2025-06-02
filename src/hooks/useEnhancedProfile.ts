
import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { useHealthAssessment } from "./useHealthAssessment";
import { useOnboardingProgress } from "./useOnboardingProgress";
import { toast } from "sonner";

export const useEnhancedProfile = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  const { assessment, saveAssessment, isSaving: isSavingAssessment } = useHealthAssessment();
  const { markStepComplete, progress } = useOnboardingProgress();
  
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
    special_conditions: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
        special_conditions: profile.special_conditions || [],
      }));
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const validateBasicInfo = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      errors.age = 'Please enter a valid age between 13 and 120';
    }
    if (!formData.gender) errors.gender = 'Please select your gender';
    if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      errors.height = 'Please enter a valid height between 100-250 cm';
    }
    if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
      errors.weight = 'Please enter a valid weight between 30-300 kg';
    }
    if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';
    if (!formData.body_shape) errors.body_shape = 'Please select your body shape';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateGoalsAndActivity = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fitness_goal) errors.fitness_goal = 'Please select your fitness goal';
    if (!formData.activity_level) errors.activity_level = 'Please select your activity level';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveBasicInfo = async () => {
    try {
      if (!validateBasicInfo()) {
        toast.error('Please fix the validation errors');
        return false;
      }

      const profileData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nationality: formData.nationality.trim(),
        body_shape: formData.body_shape,
      };
      
      await updateProfile(profileData);
      markStepComplete('basic_info');
      toast.success('Basic information saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Failed to save basic information. Please try again.');
      return false;
    }
  };

  const saveGoalsAndActivity = async () => {
    try {
      if (!validateGoalsAndActivity()) {
        toast.error('Please fix the validation errors');
        return false;
      }

      const profileData = {
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions,
        special_conditions: formData.special_conditions,
      };
      
      await updateProfile(profileData);
      markStepComplete('goals_setup');
      toast.success('Goals and preferences saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals and preferences. Please try again.');
      return false;
    }
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 0;

    // Basic info fields (8 required)
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      total++;
      if (formData[field as keyof typeof formData] && formData[field as keyof typeof formData] !== '') {
        completed++;
      }
    });

    // Goals fields (2 required)
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      total++;
      if (formData[field as keyof typeof formData] && formData[field as keyof typeof formData] !== '') {
        completed++;
      }
    });

    // Health assessment
    if (assessment) {
      total += 4; // Key assessment fields
      if (assessment.stress_level !== null) completed++;
      if (assessment.sleep_quality !== null) completed++;
      if (assessment.energy_level !== null) completed++;
      if (assessment.work_schedule) completed++;
    } else {
      total += 4;
    }

    // Onboarding progress
    if (progress) {
      total += 1;
      if (progress.preferences_completed) completed++;
    } else {
      total += 1;
    }

    return Math.round((completed / total) * 100);
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating: isUpdating || isSavingAssessment,
    validationErrors,
    completionPercentage: getCompletionPercentage(),
    progress,
    assessment,
  };
};
