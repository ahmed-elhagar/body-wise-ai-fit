
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

  // Enhanced sync with profile data - comprehensive field mapping with proper type handling
  useEffect(() => {
    if (profile) {
      console.log('useProfileFormData - Syncing profile data:', {
        profileId: profile.id?.substring(0, 8) + '...',
        allFields: Object.keys(profile),
        criticalFields: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          nationality: profile.nationality,
          bodyShape: profile.body_shape,
          fitnessGoal: profile.fitness_goal,
          activityLevel: profile.activity_level
        },
        arrayFields: {
          healthConditions: profile.health_conditions,
          allergies: profile.allergies,
          preferredFoods: profile.preferred_foods,
          dietaryRestrictions: profile.dietary_restrictions,
          specialConditions: profile.special_conditions
        }
      });

      // Safe string conversion function
      const safeStringConvert = (value: any): string => {
        if (value === null || value === undefined) return '';
        return String(value);
      };

      // Safe array conversion function
      const safeArrayConvert = (value: any): string[] => {
        if (Array.isArray(value)) {
          return value.filter(Boolean).map(item => String(item));
        }
        if (value && typeof value === 'string') {
          return [value];
        }
        return [];
      };

      // Comprehensive mapping with proper type conversion and null safety
      const mappedData: ProfileFormData = {
        // Basic Info - handle all data types properly with safe conversion
        first_name: safeStringConvert(profile.first_name),
        last_name: safeStringConvert(profile.last_name),
        age: profile.age ? String(profile.age) : '',
        gender: safeStringConvert(profile.gender),
        height: profile.height ? String(profile.height) : '',
        weight: profile.weight ? String(profile.weight) : '',
        nationality: safeStringConvert(profile.nationality),
        body_shape: safeStringConvert(profile.body_shape),
        
        // Goals & Activity - ensure exact matching with safe conversion
        fitness_goal: safeStringConvert(profile.fitness_goal),
        activity_level: safeStringConvert(profile.activity_level),
        
        // Arrays - robust array handling with safe conversion
        health_conditions: safeArrayConvert(profile.health_conditions),
        allergies: safeArrayConvert(profile.allergies),
        preferred_foods: safeArrayConvert(profile.preferred_foods),
        dietary_restrictions: safeArrayConvert(profile.dietary_restrictions),
        special_conditions: safeArrayConvert(profile.special_conditions),
      };

      console.log('useProfileFormData - Mapped form data result:', {
        basicInfoSuccess: !!(mappedData.first_name && mappedData.last_name),
        physicalInfoSuccess: !!(mappedData.age && mappedData.gender && mappedData.height && mappedData.weight),
        goalsSuccess: !!(mappedData.fitness_goal && mappedData.activity_level),
        arrayFieldsSizes: {
          healthConditions: mappedData.health_conditions.length,
          allergies: mappedData.allergies.length,
          preferredFoods: mappedData.preferred_foods.length,
          dietaryRestrictions: mappedData.dietary_restrictions.length,
          specialConditions: mappedData.special_conditions.length
        },
        finalMappedData: mappedData
      });

      setFormData(mappedData);
    } else {
      console.log('useProfileFormData - No profile data available yet');
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    console.log('useProfileFormData - Updating field:', field, 'with value:', value, 'type:', typeof value);
    
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('useProfileFormData - Form data after update:', {
        field,
        newValue: value,
        updatedFieldValue: updated[field as keyof ProfileFormData]
      });
      return updated;
    });
    
    // Clear validation error when user starts editing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    // Enhanced array handling - support multiple separators and clean data
    const arrayValue = value
      .split(/[,\n;]/) // Support comma, newline, and semicolon separators
      .map(item => item.trim())
      .filter(Boolean) // Remove empty strings
      .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
    
    console.log('useProfileFormData - Converting array input:', {
      field,
      inputValue: value,
      parsedArray: arrayValue,
      arrayLength: arrayValue.length,
      uniqueItems: arrayValue.length
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
