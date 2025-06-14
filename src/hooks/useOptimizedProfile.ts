
import { useState } from 'react';
import { ProfileFormData, ValidationErrors } from './profile/types';

export const useOptimizedProfile = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    body_fat_percentage: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    dietary_restrictions: [],
    preferred_foods: []
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInput = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  const saveBasicInfo = async (): Promise<boolean> => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error saving basic info:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const saveGoalsAndActivity = async (): Promise<boolean> => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error saving goals and activity:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const profileMetrics = {
    completionScore: 75
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    profileMetrics
  };
};
