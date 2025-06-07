
import { useState, useEffect } from "react";
import { useProfile } from "../useProfile";
import type { ProfileFormData, ValidationErrors } from "./types";

export const useProfileFormData = () => {
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState<ProfileFormData>({
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

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Sync with profile data - ensure all signup data is properly mapped
  useEffect(() => {
    if (profile) {
      console.log('useProfileFormData - Syncing profile data:', {
        hasProfile: !!profile,
        firstName: profile.first_name,
        lastName: profile.last_name,
        age: profile.age,
        bodyFatPercentage: profile.body_fat_percentage,
        bodyShape: profile.body_shape
      });

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
        health_conditions: Array.isArray(profile.health_conditions) ? profile.health_conditions : [],
        allergies: Array.isArray(profile.allergies) ? profile.allergies : [],
        preferred_foods: Array.isArray(profile.preferred_foods) ? profile.preferred_foods : [],
        dietary_restrictions: Array.isArray(profile.dietary_restrictions) ? profile.dietary_restrictions : [],
        special_conditions: Array.isArray(profile.special_conditions) ? profile.special_conditions : [],
      }));
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    console.log('useProfileFormData - Updating field:', field, 'with value:', value);
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

  return {
    formData,
    updateFormData,
    handleArrayInput,
    validationErrors,
    setValidationErrors,
  };
};
