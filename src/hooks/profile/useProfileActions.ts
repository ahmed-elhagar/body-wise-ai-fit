
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';

export const useProfileActions = () => {
  const { updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const saveProfile = async (formData: any) => {
    setIsUpdating(true);
    try {
      console.log('useProfileActions - Saving profile with data:', formData);
      
      // Convert string values to appropriate types for database
      const profileUpdateData = {
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        nationality: formData.nationality || null,
        body_shape: formData.body_shape || null,
        fitness_goal: formData.fitness_goal || null,
        activity_level: formData.activity_level || null,
        health_conditions: Array.isArray(formData.health_conditions) ? formData.health_conditions : [],
        allergies: Array.isArray(formData.allergies) ? formData.allergies : [],
        preferred_foods: Array.isArray(formData.preferred_foods) ? formData.preferred_foods : [],
        dietary_restrictions: Array.isArray(formData.dietary_restrictions) ? formData.dietary_restrictions : [],
        special_conditions: Array.isArray(formData.special_conditions) ? formData.special_conditions : [],
      };

      console.log('useProfileActions - Converted data for database:', profileUpdateData);
      
      const result = await updateProfile(profileUpdateData);
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      console.log('useProfileActions - Profile save successful');
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error: any) {
      console.error('useProfileActions - Profile update error:', error);
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
