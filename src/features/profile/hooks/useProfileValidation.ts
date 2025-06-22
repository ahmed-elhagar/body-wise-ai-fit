
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

    if (formData.age && (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)) {
      errors.age = 'Age must be between 1 and 120';
    }

    if (formData.height && (parseFloat(formData.height) < 50 || parseFloat(formData.height) > 300)) {
      errors.height = 'Height must be between 50 and 300 cm';
    }

    if (formData.weight && (parseFloat(formData.weight) < 20 || parseFloat(formData.weight) > 500)) {
      errors.weight = 'Weight must be between 20 and 500 kg';
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
