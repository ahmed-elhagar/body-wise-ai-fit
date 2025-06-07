
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
      console.log('useProfileFormData - Full profile data received:', {
        profileId: profile.id?.substring(0, 8) + '...',
        firstName: profile.first_name,
        lastName: profile.last_name,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        nationality: profile.nationality,
        bodyShape: profile.body_shape,
        bodyFatPercentage: profile.body_fat_percentage,
        fitnessGoal: profile.fitness_goal,
        activityLevel: profile.activity_level,
        healthConditions: profile.health_conditions,
        allergies: profile.allergies,
        preferredFoods: profile.preferred_foods,
        dietaryRestrictions: profile.dietary_restrictions,
        specialConditions: profile.special_conditions
      });

      setFormData({
        // Basic Info - ensure proper type conversion
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age ? profile.age.toString() : '',
        gender: profile.gender || '',
        height: profile.height ? profile.height.toString() : '',
        weight: profile.weight ? profile.weight.toString() : '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        
        // Goals & Activity
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        
        // Arrays - ensure they are arrays, not strings
        health_conditions: Array.isArray(profile.health_conditions) ? profile.health_conditions : [],
        allergies: Array.isArray(profile.allergies) ? profile.allergies : [],
        preferred_foods: Array.isArray(profile.preferred_foods) ? profile.preferred_foods : [],
        dietary_restrictions: Array.isArray(profile.dietary_restrictions) ? profile.dietary_restrictions : [],
        special_conditions: Array.isArray(profile.special_conditions) ? profile.special_conditions : [],
      });

      console.log('useProfileFormData - Form data updated:', {
        firstName: profile.first_name,
        lastName: profile.last_name,
        age: profile.age,
        fitnessGoal: profile.fitness_goal,
        activityLevel: profile.activity_level,
        bodyShape: profile.body_shape
      });
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    console.log('useProfileFormData - Updating field:', field, 'with value:', value);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('useProfileFormData - Updated form data:', updated);
      return updated;
    });
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    console.log('useProfileFormData - Converting array input:', field, 'from:', value, 'to:', arrayValue);
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
