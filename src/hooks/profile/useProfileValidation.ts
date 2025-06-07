
import type { ProfileFormData, ValidationErrors } from "./types";

export const useProfileValidation = () => {
  const validateBasicInfo = (formData: ProfileFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // First name validation
    if (!formData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      errors.first_name = 'First name must be at least 2 characters';
    } else if (formData.first_name.trim().length > 50) {
      errors.first_name = 'First name cannot exceed 50 characters';
    }

    // Last name validation
    if (!formData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      errors.last_name = 'Last name must be at least 2 characters';
    } else if (formData.last_name.trim().length > 50) {
      errors.last_name = 'Last name cannot exceed 50 characters';
    }

    // Age validation
    const age = parseInt(formData.age);
    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (isNaN(age) || age < 13) {
      errors.age = 'Age must be at least 13 years';
    } else if (age > 120) {
      errors.age = 'Age cannot exceed 120 years';
    }

    // Gender validation
    if (!formData.gender) {
      errors.gender = 'Please select your gender';
    }

    // Height validation
    const height = parseFloat(formData.height);
    if (!formData.height) {
      errors.height = 'Height is required';
    } else if (isNaN(height) || height < 100) {
      errors.height = 'Height must be at least 100 cm';
    } else if (height > 250) {
      errors.height = 'Height cannot exceed 250 cm';
    }

    // Weight validation
    const weight = parseFloat(formData.weight);
    if (!formData.weight) {
      errors.weight = 'Weight is required';
    } else if (isNaN(weight) || weight < 30) {
      errors.weight = 'Weight must be at least 30 kg';
    } else if (weight > 300) {
      errors.weight = 'Weight cannot exceed 300 kg';
    }

    // Body fat percentage validation
    if (formData.body_fat_percentage) {
      const bodyFat = parseFloat(formData.body_fat_percentage);
      if (isNaN(bodyFat) || bodyFat < 3) {
        errors.body_fat_percentage = 'Body fat percentage must be at least 3%';
      } else if (bodyFat > 50) {
        errors.body_fat_percentage = 'Body fat percentage cannot exceed 50%';
      }
    }

    // Nationality validation
    if (!formData.nationality?.trim()) {
      errors.nationality = 'Nationality is required';
    } else if (formData.nationality.trim().length < 2) {
      errors.nationality = 'Nationality must be at least 2 characters';
    }

    return errors;
  };

  const validateGoalsAndActivity = (formData: ProfileFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Fitness goal validation
    if (!formData.fitness_goal) {
      errors.fitness_goal = 'Please select your fitness goal';
    }

    // Activity level validation
    if (!formData.activity_level) {
      errors.activity_level = 'Please select your activity level';
    }

    return errors;
  };

  return {
    validateBasicInfo,
    validateGoalsAndActivity,
  };
};
