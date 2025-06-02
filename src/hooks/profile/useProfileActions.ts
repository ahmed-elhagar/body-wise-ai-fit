
import { useProfile } from "../useProfile";
import { useOnboardingProgress } from "../useOnboardingProgress";
import { toast } from "sonner";
import { useProfileValidation } from "./useProfileValidation";
import type { ProfileFormData, ValidationErrors } from "./types";

export const useProfileActions = () => {
  const { updateProfile, isUpdating } = useProfile();
  const { markStepComplete } = useOnboardingProgress();
  const { validateBasicInfo, validateGoalsAndActivity } = useProfileValidation();

  const saveBasicInfo = async (
    formData: ProfileFormData, 
    setValidationErrors: (errors: ValidationErrors) => void
  ) => {
    try {
      const errors = validateBasicInfo(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix the validation errors');
        return false;
      }

      const profileData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nationality: formData.nationality.trim(),
        body_shape: formData.body_shape,
      };
      
      await updateProfile(profileData);
      markStepComplete('basic_info');
      toast.success('Basic information saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Failed to save basic information. Please try again.');
      return false;
    }
  };

  const saveGoalsAndActivity = async (
    formData: ProfileFormData, 
    setValidationErrors: (errors: ValidationErrors) => void
  ) => {
    try {
      const errors = validateGoalsAndActivity(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix the validation errors');
        return false;
      }

      const profileData = {
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions,
        special_conditions: formData.special_conditions,
      };
      
      await updateProfile(profileData);
      markStepComplete('goals_setup');
      toast.success('Goals and preferences saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals and preferences. Please try again.');
      return false;
    }
  };

  return {
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
  };
};
