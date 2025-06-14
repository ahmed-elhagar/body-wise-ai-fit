
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { useProfileValidation } from './useProfileValidation';
import type { ProfileFormData } from './types';
import { toast } from 'sonner';

export const useProfileActions = () => {
  const { updateProfile } = useProfile();
  const { validateBasicInfo, validateGoalsAndActivity } = useProfileValidation();
  const [isUpdating, setIsUpdating] = useState(false);

  const saveProfile = async (formData: ProfileFormData, validateGoals = false) => {
    setIsUpdating(true);
    
    try {
      // Validate form data
      const validationErrors = validateGoals 
        ? { ...validateBasicInfo(formData), ...validateGoalsAndActivity(formData) }
        : validateBasicInfo(formData);

      if (Object.keys(validationErrors).length > 0) {
        // Show first validation error
        const firstError = Object.values(validationErrors)[0];
        toast.error(firstError);
        return { success: false, errors: validationErrors };
      }

      // Prepare data for database with proper type conversion
      const profileUpdates = {
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        nationality: formData.nationality?.trim() || null,
        body_shape: formData.body_shape || null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        fitness_goal: formData.fitness_goal || null,
        activity_level: formData.activity_level || null,
        health_conditions: formData.health_conditions || [],
        allergies: formData.allergies || [],
        dietary_restrictions: formData.dietary_restrictions || [],
        preferred_foods: formData.preferred_foods || [],
        updated_at: new Date().toISOString(),
      };

      // Remove null/undefined values to avoid database issues
      const cleanedUpdates = Object.fromEntries(
        Object.entries(profileUpdates).filter(([_, value]) => value !== null && value !== undefined)
      );

      console.log('Attempting to save profile with updates:', cleanedUpdates);

      const result = await updateProfile(cleanedUpdates);

      if (result.error) {
        console.error('Profile update error:', result.error);
        toast.error('Failed to save profile. Please try again.');
        return { success: false, error: result.error };
      }

      console.log('Profile saved successfully');
      toast.success('Profile updated successfully!');
      return { success: true, data: result.data };

    } catch (error: any) {
      console.error('Unexpected error saving profile:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    saveProfile,
    isUpdating,
  };
};
