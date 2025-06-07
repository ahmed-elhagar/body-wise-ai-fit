
import { useCallback } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';

export const useProfileActions = () => {
  const { updateProfile, isUpdating } = useProfile();

  const saveProfile = useCallback(async (formData: any) => {
    try {
      const updates = {
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
        dietary_restrictions: formData.dietary_restrictions,
        preferred_foods: formData.preferred_foods,
      };

      const result = await updateProfile(updates);
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
    }
  }, [updateProfile]);

  return {
    saveProfile,
    isUpdating,
  };
};
