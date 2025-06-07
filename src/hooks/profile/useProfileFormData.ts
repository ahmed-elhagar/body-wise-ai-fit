
import { useState } from 'react';
import { ProfileFormData, ValidationErrors } from './types';

export const useProfileFormData = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
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
    dietary_restrictions: [],
    allergies: [],
    health_conditions: [],
    preferred_foods: [],
    special_conditions: []
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const updateFormData = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: keyof ProfileFormData, value: string) => {
    const arrayValue = value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    validationErrors,
    setValidationErrors
  };
};
