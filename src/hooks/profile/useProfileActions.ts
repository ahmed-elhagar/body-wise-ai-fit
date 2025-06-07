
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';
import type { ProfileFormData } from './types';

export const useProfileActions = () => {
  const { updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const saveProfile = async (formData: ProfileFormData) => {
    try {
      setIsUpdating(true);
      
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        nationality: formData.nationality,
        body_shape: formData.body_shape,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions,
      };

      const result = await updateProfile(profileData);
      
      if (result.error) {
        toast.error('Failed to save profile');
        return { success: false, error: result.error };
      }

      toast.success('Profile saved successfully');
      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
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
