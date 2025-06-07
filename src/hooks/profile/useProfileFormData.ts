
import { useState, useCallback, useMemo } from 'react';
import { useProfile } from '../useProfile';
import type { ProfileFormData, ValidationErrors } from './types';

export const useProfileFormData = () => {
  const { profile } = useProfile();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Create form data from profile with proper type conversion
  const formData: ProfileFormData = useMemo(() => ({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    age: profile?.age?.toString() || '',
    gender: profile?.gender || '',
    height: profile?.height?.toString() || '',
    weight: profile?.weight?.toString() || '',
    nationality: profile?.nationality || '',
    body_shape: profile?.body_shape || '',
    body_fat_percentage: profile?.body_fat_percentage?.toString() || '',
    fitness_goal: profile?.fitness_goal || '',
    activity_level: profile?.activity_level || '',
    health_conditions: profile?.health_conditions || [],
    allergies: profile?.allergies || [],
    dietary_restrictions: profile?.dietary_restrictions || [],
    preferred_foods: profile?.preferred_foods || [],
  }), [profile]);

  const updateFormData = useCallback((field: string, value: any) => {
    console.log('Updating form data:', field, value);
    
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
