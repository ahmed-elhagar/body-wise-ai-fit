
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';

export const useProfileActions = () => {
  const { updateProfile, refetch } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const saveProfile = async (formData: any) => {
    setIsUpdating(true);
    try {
      console.log('useProfileActions - Starting comprehensive profile save:', {
        fieldsCount: Object.keys(formData).length,
        basicInfo: {
          firstName: formData.first_name,
          lastName: formData.last_name,
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          nationality: formData.nationality,
          bodyShape: formData.body_shape
        },
        goalsActivity: {
          fitnessGoal: formData.fitness_goal,
          activityLevel: formData.activity_level
        },
        arrayFieldsStatus: {
          healthConditions: Array.isArray(formData.health_conditions) ? formData.health_conditions.length : 'not array',
          allergies: Array.isArray(formData.allergies) ? formData.allergies.length : 'not array',
          preferredFoods: Array.isArray(formData.preferred_foods) ? formData.preferred_foods.length : 'not array',
          dietaryRestrictions: Array.isArray(formData.dietary_restrictions) ? formData.dietary_restrictions.length : 'not array',
          specialConditions: Array.isArray(formData.special_conditions) ? formData.special_conditions.length : 'not array'
        }
      });
      
      // Comprehensive data conversion with enhanced validation and type safety
      const profileUpdateData = {
        // Basic Info - robust type conversion with validation
        first_name: formData.first_name?.toString().trim() || null,
        last_name: formData.last_name?.toString().trim() || null,
        age: (() => {
          const ageValue = formData.age;
          if (!ageValue) return null;
          const parsed = parseInt(String(ageValue));
          return !isNaN(parsed) && parsed > 0 && parsed < 150 ? parsed : null;
        })(),
        gender: formData.gender?.toString().trim() || null,
        height: (() => {
          const heightValue = formData.height;
          if (!heightValue) return null;
          const parsed = parseFloat(String(heightValue));
          return !isNaN(parsed) && parsed > 0 && parsed < 300 ? parsed : null;
        })(),
        weight: (() => {
          const weightValue = formData.weight;
          if (!weightValue) return null;
          const parsed = parseFloat(String(weightValue));
          return !isNaN(parsed) && parsed > 0 && parsed < 500 ? parsed : null;
        })(),
        nationality: formData.nationality?.toString().trim() || null,
        body_shape: formData.body_shape?.toString().trim() || null,
        
        // Goals & Activity - ensure proper string values
        fitness_goal: formData.fitness_goal?.toString().trim() || null,
        activity_level: formData.activity_level?.toString().trim() || null,
        
        // Arrays - comprehensive array handling with validation
        health_conditions: (() => {
          if (Array.isArray(formData.health_conditions)) {
            return formData.health_conditions
              .map(item => item?.toString().trim())
              .filter(Boolean)
              .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
          }
          return [];
        })(),
        
        allergies: (() => {
          if (Array.isArray(formData.allergies)) {
            return formData.allergies
              .map(item => item?.toString().trim())
              .filter(Boolean)
              .filter((item, index, arr) => arr.indexOf(item) === index);
          }
          return [];
        })(),
        
        preferred_foods: (() => {
          if (Array.isArray(formData.preferred_foods)) {
            return formData.preferred_foods
              .map(item => item?.toString().trim())
              .filter(Boolean)
              .filter((item, index, arr) => arr.indexOf(item) === index);
          }
          return [];
        })(),
        
        dietary_restrictions: (() => {
          if (Array.isArray(formData.dietary_restrictions)) {
            return formData.dietary_restrictions
              .map(item => item?.toString().trim())
              .filter(Boolean)
              .filter((item, index, arr) => arr.indexOf(item) === index);
          }
          return [];
        })(),
        
        special_conditions: (() => {
          if (Array.isArray(formData.special_conditions)) {
            return formData.special_conditions
              .map(item => item?.toString().trim())
              .filter(Boolean)
              .filter((item, index, arr) => arr.indexOf(item) === index);
          }
          return [];
        })(),
        
        // System fields
        updated_at: new Date().toISOString(),
      };

      console.log('useProfileActions - Final processed data for database:', {
        basicInfoProcessed: {
          firstName: profileUpdateData.first_name,
          lastName: profileUpdateData.last_name,
          age: profileUpdateData.age,
          ageType: typeof profileUpdateData.age,
          gender: profileUpdateData.gender,
          height: profileUpdateData.height,
          heightType: typeof profileUpdateData.height,
          weight: profileUpdateData.weight,
          weightType: typeof profileUpdateData.weight,
          nationality: profileUpdateData.nationality,
          bodyShape: profileUpdateData.body_shape
        },
        goalsProcessed: {
          fitnessGoal: profileUpdateData.fitness_goal,
          activityLevel: profileUpdateData.activity_level
        },
        arraysProcessed: {
          healthConditions: profileUpdateData.health_conditions,
          allergies: profileUpdateData.allergies,
          preferredFoods: profileUpdateData.preferred_foods,
          dietaryRestrictions: profileUpdateData.dietary_restrictions,
          specialConditions: profileUpdateData.special_conditions
        },
        dataTypes: {
          ageIsNumber: typeof profileUpdateData.age === 'number',
          heightIsNumber: typeof profileUpdateData.height === 'number',
          weightIsNumber: typeof profileUpdateData.weight === 'number',
          arraysAreArrays: {
            healthConditions: Array.isArray(profileUpdateData.health_conditions),
            allergies: Array.isArray(profileUpdateData.allergies),
            preferredFoods: Array.isArray(profileUpdateData.preferred_foods),
            dietaryRestrictions: Array.isArray(profileUpdateData.dietary_restrictions),
            specialConditions: Array.isArray(profileUpdateData.special_conditions)
          }
        }
      });
      
      const result = await updateProfile(profileUpdateData);
      
      if (result.error) {
        console.error('useProfileActions - Database update error:', result.error);
        throw new Error(result.error.message || 'Database update failed');
      }
      
      console.log('useProfileActions - Profile save successful, refreshing data...');
      
      // Force refresh of profile data to ensure UI is in sync
      await refetch();
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error: any) {
      console.error('useProfileActions - Profile update error:', {
        message: error.message,
        stack: error.stack,
        originalFormData: formData
      });
      toast.error(error.message || 'Failed to update profile');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    saveProfile,
    isUpdating
  };
};
