
import type { ProfileFormData, ValidationErrors } from "./types";

export const useProfileValidation = () => {
  const validateBasicInfo = (formData: ProfileFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      errors.age = 'Please enter a valid age between 13 and 120';
    }
    if (!formData.gender) errors.gender = 'Please select your gender';
    if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      errors.height = 'Please enter a valid height between 100-250 cm';
    }
    if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
      errors.weight = 'Please enter a valid weight between 30-300 kg';
    }
    if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';
    if (!formData.body_shape) errors.body_shape = 'Please select your body shape';

    return errors;
  };

  const validateGoalsAndActivity = (formData: ProfileFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!formData.fitness_goal) errors.fitness_goal = 'Please select your fitness goal';
    if (!formData.activity_level) errors.activity_level = 'Please select your activity level';

    return errors;
  };

  return {
    validateBasicInfo,
    validateGoalsAndActivity,
  };
};
