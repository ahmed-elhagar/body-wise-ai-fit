
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import type { ProfileFormData, ValidationErrors } from './types';

export const useProfileFormData = () => {
  const { profile } = useProfile();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    body_fat_percentage: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    dietary_restrictions: [],
    preferred_foods: [],
  });

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
        body_fat_percentage: profile.body_fat_percentage?.toString() || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        health_conditions: profile.health_conditions || [],
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || [],
        preferred_foods: profile.preferred_foods || [],
      });
    }
  }, [profile]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, arrayValue);
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    validationErrors,
    setValidationErrors,
  };
};
