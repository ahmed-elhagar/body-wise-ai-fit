
import { useState, useCallback } from 'react';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useProfileForm = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const formData = {
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    age: profile?.age?.toString() || '',
    gender: profile?.gender || '',
    height: profile?.height?.toString() || '',
    weight: profile?.weight?.toString() || '',
    nationality: profile?.nationality || '',
    body_shape: profile?.body_shape || '',
    body_fat_percentage: profile?.body_fat_percentage?.toString() || '',
    fitness_goal: profile?.fitness_goal || '',
    activity_level: profile?.activity_level || '',
    health_conditions: profile?.health_conditions || [],
    allergies: profile?.allergies || [],
    dietary_restrictions: profile?.dietary_restrictions || [],
    preferred_foods: profile?.preferred_foods || [],
  };

  const updateFormData = useCallback((field: string, value: any) => {
    // This would normally update local form state
    console.log('Updating form data:', field, value);
  }, []);

  const handleArrayInput = useCallback((field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, arrayValue);
  }, [updateFormData]);

  const handleSave = useCallback(async () => {
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
        return false;
      }
      
      toast.success('Profile saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
      return false;
    }
  }, [formData, updateProfile]);

  return {
    formData,
    updateFormData,
    handleArrayInput,
    handleSave,
    isUpdating,
    validationErrors,
  };
};
