
import { useState, useCallback, useMemo } from 'react';
import { useProfile } from '../useProfile';
import type { ProfileFormData, ValidationErrors } from './types';

export const useProfileFormData = () => {
  const { profile } = useProfile();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [localFormData, setLocalFormData] = useState<Partial<ProfileFormData>>({});

  // Create form data from profile with proper type conversion, merged with local changes
  const formData: ProfileFormData = useMemo(() => ({
    first_name: localFormData.first_name ?? profile?.first_name ?? '',
    last_name: localFormData.last_name ?? profile?.last_name ?? '',
    age: localFormData.age ?? profile?.age?.toString() ?? '',
    gender: localFormData.gender ?? profile?.gender ?? '',
    height: localFormData.height ?? profile?.height?.toString() ?? '',
    weight: localFormData.weight ?? profile?.weight?.toString() ?? '',
    nationality: localFormData.nationality ?? profile?.nationality ?? '',
    body_shape: localFormData.body_shape ?? profile?.body_shape ?? '',
    body_fat_percentage: localFormData.body_fat_percentage ?? profile?.body_fat_percentage?.toString() ?? '',
    fitness_goal: localFormData.fitness_goal ?? profile?.fitness_goal ?? '',
    activity_level: localFormData.activity_level ?? profile?.activity_level ?? '',
    health_conditions: localFormData.health_conditions ?? profile?.health_conditions ?? [],
    allergies: localFormData.allergies ?? profile?.allergies ?? [],
    dietary_restrictions: localFormData.dietary_restrictions ?? profile?.dietary_restrictions ?? [],
    preferred_foods: localFormData.preferred_foods ?? profile?.preferred_foods ?? [],
  }), [profile, localFormData]);

  const updateFormData = useCallback((field: string, value: any) => {
    console.log('Updating form data:', field, value);
    
    // Update local form data state
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for the field being updated
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const handleArrayInput = useCallback((field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, arrayValue);
  }, [updateFormData]);

  return {
    formData,
    updateFormData,
    handleArrayInput,
    validationErrors,
    setValidationErrors,
  };
};
