
import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { toast } from "sonner";

export const useProfileForm = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        health_conditions: profile.health_conditions || [],
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || [],
      });
    }
  }, [profile]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSave = async () => {
    try {
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      };
      
      updateProfile(profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    handleSave,
    isUpdating,
  };
};
