
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedProfile = () => {
  const { user } = useAuth();
  const { profile, refetch } = useProfile();
  const [formData, setFormData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleArrayInput = useCallback((field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFormData(field, array);
  }, [updateFormData]);

  const saveBasicInfo = useCallback(async () => {
    if (!user) return false;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          nationality: formData.nationality,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Basic information updated successfully');
      await refetch();
      return true;
    } catch (error) {
      console.error('Error updating basic info:', error);
      toast.error('Failed to update basic information');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user, formData, refetch]);

  const saveGoalsAndActivity = useCallback(async () => {
    if (!user) return false;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          fitness_goal: formData.fitness_goal,
          activity_level: formData.activity_level,
          target_weight: formData.target_weight,
          body_fat_percentage: formData.body_fat_percentage,
          health_conditions: formData.health_conditions,
          allergies: formData.allergies,
          dietary_restrictions: formData.dietary_restrictions,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Goals and activity updated successfully');
      await refetch();
      return true;
    } catch (error) {
      console.error('Error updating goals and activity:', error);
      toast.error('Failed to update goals and activity');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user, formData, refetch]);

  const completionPercentage = useCallback(() => {
    if (!formData) return 0;
    
    const requiredFields = [
      'first_name', 'last_name', 'age', 'gender', 
      'height', 'weight', 'fitness_goal', 'activity_level'
    ];
    
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field] !== ''
    );
    
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }, [formData]);

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage: completionPercentage(),
  };
};
