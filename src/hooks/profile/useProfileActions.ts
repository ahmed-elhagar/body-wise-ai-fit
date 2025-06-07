
import { useState } from 'react';
import { useProfile } from '../useProfile';
import { ProfileFormData } from './types';

export const useProfileActions = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateProfile } = useProfile();

  const saveProfile = async (formData: ProfileFormData) => {
    setIsUpdating(true);
    try {
      const profileData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        nationality: formData.nationality.trim(),
        body_shape: formData.body_shape,
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        dietary_restrictions: formData.dietary_restrictions.filter(Boolean),
        allergies: formData.allergies.filter(Boolean),
        health_conditions: formData.health_conditions.filter(Boolean),
        preferred_foods: formData.preferred_foods.filter(Boolean),
        special_conditions: formData.special_conditions.filter(Boolean),
        updated_at: new Date().toISOString()
      };

      const result = await updateProfile(profileData);
      
      if (result?.error) {
        throw new Error(result.error.message || 'Profile update failed');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Profile save error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    saveProfile,
    isUpdating
  };
};
