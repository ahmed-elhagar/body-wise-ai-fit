
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useHealthAssessment } from './useHealthAssessment';
import { useOnboardingProgress } from './useOnboardingProgress';
import { toast } from 'sonner';

export interface OptimizedProfileData {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  fitness_goal: string;
  activity_level: string;
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useOptimizedProfile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, isUpdating } = useProfile();
  const { assessment, isAssessmentComplete, isSaving: isSavingAssessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();
  
  const [formData, setFormData] = useState<OptimizedProfileData>({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Memoized completion calculations
  const completionMetrics = useMemo(() => {
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    const goalFields = ['fitness_goal', 'activity_level'];
    
    const completedBasicFields = basicFields.filter(field => {
      const value = formData[field as keyof OptimizedProfileData];
      return value !== null && value !== undefined && value !== '';
    });
    
    const completedGoalFields = goalFields.filter(field => {
      const value = formData[field as keyof OptimizedProfileData];
      return value && value !== '';
    });

    const basicScore = (completedBasicFields.length / basicFields.length) * 40;
    const goalScore = (completedGoalFields.length / goalFields.length) * 20;
    const assessmentScore = isAssessmentComplete ? 30 : 0;
    const preferencesScore = progress?.preferences_completed ? 10 : 0;
    
    const totalScore = Math.round(basicScore + goalScore + assessmentScore + preferencesScore);
    
    return {
      completionPercentage: totalScore,
      basicInfo: {
        completed: completedBasicFields.length,
        total: basicFields.length,
        fields: completedBasicFields,
      },
      goals: {
        completed: completedGoalFields.length,
        total: goalFields.length,
        fields: completedGoalFields,
      },
      healthAssessment: {
        completed: isAssessmentComplete ? 1 : 0,
        total: 1,
        fields: isAssessmentComplete ? ['health_assessment'] : [],
      },
      preferences: {
        completed: progress?.preferences_completed ? 1 : 0,
        total: 1,
      },
    };
  }, [formData, isAssessmentComplete, progress?.preferences_completed]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
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
      });
    }
  }, [profile]);

  // Optimized form data updater
  const updateFormData = useCallback((field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Optimized array input handler
  const handleArrayInput = useCallback((field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, arrayValue);
  }, [updateFormData]);

  // Basic info validation
  const validateBasicInfo = useCallback(() => {
    const errors: ValidationErrors = {};
    
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      errors.age = 'Please enter a valid age between 13 and 120';
    }
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      errors.height = 'Please enter a valid height between 100-250 cm';
    }
    if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 500) {
      errors.weight = 'Please enter a valid weight between 30-500 kg';
    }
    
    return errors;
  }, [formData]);

  // Goals validation
  const validateGoals = useCallback(() => {
    const errors: ValidationErrors = {};
    
    if (!formData.fitness_goal) errors.fitness_goal = 'Fitness goal is required';
    if (!formData.activity_level) errors.activity_level = 'Activity level is required';
    
    return errors;
  }, [formData]);

  // Optimized save basic info
  const saveBasicInfo = useCallback(async () => {
    try {
      const errors = validateBasicInfo();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix the validation errors');
        return false;
      }

      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        nationality: formData.nationality,
        body_shape: formData.body_shape,
      };
      
      const result = await updateProfile(profileData);
      if (result.error) {
        toast.error('Failed to save basic information');
        return false;
      }
      
      toast.success('Basic information saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Failed to save basic information');
      return false;
    }
  }, [formData, validateBasicInfo, updateProfile]);

  // Optimized save goals and activity
  const saveGoalsAndActivity = useCallback(async () => {
    try {
      const errors = validateGoals();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
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
      };
      
      const result = await updateProfile(profileData);
      if (result.error) {
        toast.error('Failed to save goals and activity');
        return false;
      }
      
      toast.success('Goals and activity saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving goals and activity:', error);
      toast.error('Failed to save goals and activity');
      return false;
    }
  }, [formData, validateGoals, updateProfile]);

  return {
    // Form data
    formData,
    updateFormData,
    handleArrayInput,
    
    // Actions
    saveBasicInfo,
    saveGoalsAndActivity,
    
    // State
    isUpdating: isUpdating || isSavingAssessment,
    validationErrors,
    
    // Completion metrics
    ...completionMetrics,
    
    // Profile data
    profile,
    assessment,
    progress,
    
    // User
    user,
  };
};
