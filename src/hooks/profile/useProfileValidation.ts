
import type { ProfileFormData, ValidationErrors } from './types';

export const useProfileValidation = () => {
  const validateBasicInfo = (formData: ProfileFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 120)) {
      errors.age = 'Age must be between 13 and 120';
    }

    if (formData.height && (parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250)) {
      errors.height = 'Height must be between 100 and 250 cm';
    }

    if (formData.weight && (parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300)) {
      errors.weight = 'Weight must be between 30 and 300 kg';
    }

    return errors;
  };

  const validateGoalsAndActivity = (formData: ProfileFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.fitness_goal) {
      errors.fitness_goal = 'Fitness goal is required';
    }

    if (!formData.activity_level) {
      errors.activity_level = 'Activity level is required';
    }

    return errors;
  };

  return {
    validateBasicInfo,
    validateGoalsAndActivity,
  };
};
