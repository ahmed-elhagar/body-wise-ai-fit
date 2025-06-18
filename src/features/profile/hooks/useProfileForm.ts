
import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useProfileForm = () => {
  const { profile, updateProfile, isLoading } = useProfile();
  const [formData, setFormData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, arrayValue);
  };

  const saveBasicInfo = async () => {
    setIsUpdating(true);
    try {
      const basicFields = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        nationality: formData.nationality
      };

      await updateProfile(basicFields);
      toast.success('Basic information updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating basic info:', error);
      toast.error('Failed to update basic information');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const saveGoalsAndActivity = async () => {
    setIsUpdating(true);
    try {
      const goalsFields = {
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        allergies: formData.allergies,
        dietary_restrictions: formData.dietary_restrictions
      };

      await updateProfile(goalsFields);
      toast.success('Goals and activity updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating goals:', error);
      toast.error('Failed to update goals and activity');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    isLoading
  };
};
