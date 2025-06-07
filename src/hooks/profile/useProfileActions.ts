
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';

export const useProfileActions = () => {
  const { updateProfile, refetch } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const saveProfile = async (formData: any) => {
    setIsUpdating(true);
    try {
      console.log('useProfileActions - Starting profile save with data:', {
        fieldsCount: Object.keys(formData).length,
        hasBasicInfo: !!(formData.first_name && formData.last_name),
        hasPhysicalInfo: !!(formData.height && formData.weight),
        hasGoals: !!(formData.fitness_goal && formData.activity_level),
        arrayFields: {
          healthConditions: formData.health_conditions?.length || 0,
          allergies: formData.allergies?.length || 0,
          preferredFoods: formData.preferred_foods?.length || 0,
          dietaryRestrictions: formData.dietary_restrictions?.length || 0
        }
      });
      
      // Enhanced data conversion with proper type handling
      const profileUpdateData = {
        // Basic Info - ensure proper type conversion
        first_name: formData.first_name?.trim() || null,
        last_name: formData.last_name?.trim() || null,
        age: formData.age ? parseInt(String(formData.age)) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(String(formData.height)) : null,
        weight: formData.weight ? parseFloat(String(formData.weight)) : null,
        nationality: formData.nationality?.trim() || null,
        body_shape: formData.body_shape || null,
        
        // Goals & Activity
        fitness_goal: formData.fitness_goal || null,
        activity_level: formData.activity_level || null,
        
        // Arrays - ensure they are properly handled as arrays
        health_conditions: Array.isArray(formData.health_conditions) 
          ? formData.health_conditions.filter(Boolean) 
          : [],
        allergies: Array.isArray(formData.allergies) 
          ? formData.allergies.filter(Boolean) 
          : [],
        preferred_foods: Array.isArray(formData.preferred_foods) 
          ? formData.preferred_foods.filter(Boolean) 
          : [],
        dietary_restrictions: Array.isArray(formData.dietary_restrictions) 
          ? formData.dietary_restrictions.filter(Boolean) 
          : [],
        special_conditions: Array.isArray(formData.special_conditions) 
          ? formData.special_conditions.filter(Boolean) 
          : [],
        
        // Update timestamp
        updated_at: new Date().toISOString(),
      };

      console.log('useProfileActions - Processed data for database:', {
        basicInfo: {
          firstName: profileUpdateData.first_name,
          lastName: profileUpdateData.last_name,
          age: profileUpdateData.age,
          gender: profileUpdateData.gender,
          height: profileUpdateData.height,
          weight: profileUpdateData.weight
        },
        goals: {
          fitnessGoal: profileUpdateData.fitness_goal,
          activityLevel: profileUpdateData.activity_level
        },
        arrays: {
          healthConditions: profileUpdateData.health_conditions.length,
          allergies: profileUpdateData.allergies.length,
          preferredFoods: profileUpdateData.preferred_foods.length,
          dietaryRestrictions: profileUpdateData.dietary_restrictions.length
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
        originalData: formData
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
