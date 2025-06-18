import type { ProfileFormData } from '../types';

export const validateBasicInfo = (formData: ProfileFormData) => {
  const errors: Record<string, string> = {};

  if (!formData.first_name?.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
    errors.age = 'Please enter a valid age between 13 and 120';
  }

  if (!formData.gender) {
    errors.gender = 'Gender is required';
  }

  if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
    errors.height = 'Please enter a valid height between 100-250 cm';
  }

  if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
    errors.weight = 'Please enter a valid weight between 30-300 kg';
  }

  if (!formData.nationality?.trim()) {
    errors.nationality = 'Nationality is required';
  }

  return errors;
};

export const validateGoalsAndActivity = (formData: ProfileFormData) => {
  const errors: Record<string, string> = {};

  if (!formData.fitness_goal) {
    errors.fitness_goal = 'Please select a fitness goal';
  }

  if (!formData.activity_level) {
    errors.activity_level = 'Please select your activity level';
  }

  return errors;
};

export const calculateProfileCompletion = (formData: ProfileFormData): number => {
  let completedFields = 0;
  const totalFields = 12; // Total number of important fields

  // Basic info fields (6 fields)
  if (formData.first_name?.trim()) completedFields++;
  if (formData.last_name?.trim()) completedFields++;
  if (formData.age) completedFields++;
  if (formData.gender) completedFields++;
  if (formData.height) completedFields++;
  if (formData.weight) completedFields++;

  // Additional info fields (3 fields)
  if (formData.nationality?.trim()) completedFields++;
  if (formData.body_shape) completedFields++;
  if (formData.body_fat_percentage) completedFields++;

  // Goals and activity fields (2 fields)
  if (formData.fitness_goal) completedFields++;
  if (formData.activity_level) completedFields++;

  // Health information (1 field - at least one should be filled)
  if (formData.health_conditions?.length || formData.allergies?.length || formData.dietary_restrictions?.length) {
    completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
};
