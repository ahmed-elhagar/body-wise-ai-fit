
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

  // Enhanced sync with profile data - ensure ALL signup data is properly mapped
  useEffect(() => {
    if (profile) {
      console.log('useProfileFormData - Full profile sync starting:', {
        profileId: profile.id?.substring(0, 8) + '...',
        allFields: Object.keys(profile).length
      });

      // Create a comprehensive mapping of all profile fields
      const mappedData: ProfileFormData = {
        // Basic Info - ensure proper type conversion and fallbacks
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age ? String(profile.age) : '',
        gender: profile.gender || '',
        height: profile.height ? String(profile.height) : '',
        weight: profile.weight ? String(profile.weight) : '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        
        // Goals & Activity - ensure these match exactly what was set during signup
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        
        // Arrays - ensure they are properly handled as arrays, not strings
        health_conditions: Array.isArray(profile.health_conditions) 
          ? profile.health_conditions 
          : profile.health_conditions 
            ? [profile.health_conditions].flat() 
            : [],
        allergies: Array.isArray(profile.allergies) 
          ? profile.allergies 
          : profile.allergies 
            ? [profile.allergies].flat() 
            : [],
        preferred_foods: Array.isArray(profile.preferred_foods) 
          ? profile.preferred_foods 
          : profile.preferred_foods 
            ? [profile.preferred_foods].flat() 
            : [],
        dietary_restrictions: Array.isArray(profile.dietary_restrictions) 
          ? profile.dietary_restrictions 
          : profile.dietary_restrictions 
            ? [profile.dietary_restrictions].flat() 
            : [],
        special_conditions: Array.isArray(profile.special_conditions) 
          ? profile.special_conditions 
          : profile.special_conditions 
            ? [profile.special_conditions].flat() 
            : [],
      };

      console.log('useProfileFormData - Mapped form data:', {
        basicInfo: {
          firstName: mappedData.first_name,
          lastName: mappedData.last_name,
          age: mappedData.age,
          gender: mappedData.gender,
          height: mappedData.height,
          weight: mappedData.weight,
          nationality: mappedData.nationality,
          bodyShape: mappedData.body_shape
        },
        goals: {
          fitnessGoal: mappedData.fitness_goal,
          activityLevel: mappedData.activity_level
        },
        arrays: {
          healthConditions: mappedData.health_conditions.length,
          allergies: mappedData.allergies.length,
          preferredFoods: mappedData.preferred_foods.length,
          dietaryRestrictions: mappedData.dietary_restrictions.length,
          specialConditions: mappedData.special_conditions.length
        }
      });

      setFormData(mappedData);
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    console.log('useProfileFormData - Updating field:', field, 'with value:', value, 'type:', typeof value);
    
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('useProfileFormData - Form data after update:', {
        field,
        newValue: value,
        updatedFieldValue: updated[field]
      });
      return updated;
    });
    
    // Clear validation error when user starts editing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    // Enhanced array handling - support both comma and newline separation
    const arrayValue = value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
    
    console.log('useProfileFormData - Converting array input:', {
      field,
      inputValue: value,
      parsedArray: arrayValue,
      arrayLength: arrayValue.length
    });
    
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
    
    // Clear validation error
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    validationErrors,
    setValidationErrors,
  };
};
