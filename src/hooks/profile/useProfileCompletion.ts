
import { useMemo } from 'react';
import type { ProfileFormData } from './types';

export const useProfileCompletion = (formData: ProfileFormData) => {
  const completionPercentage = useMemo(() => {
    let score = 0;
    const totalFields = 15;

    // Basic info (40% of total)
    if (formData.first_name?.trim()) score += 4;
    if (formData.last_name?.trim()) score += 4;
    if (formData.age && parseInt(formData.age) > 0) score += 3;
    if (formData.gender) score += 3;
    if (formData.height && parseFloat(formData.height) > 0) score += 3;
    if (formData.weight && parseFloat(formData.weight) > 0) score += 3;

    // Body composition (20% of total)
    if (formData.body_fat_percentage && parseFloat(formData.body_fat_percentage) > 0) score += 10;
    if (formData.body_shape) score += 10;

    // Goals and activity (30% of total)
    if (formData.fitness_goal) score += 15;
    if (formData.activity_level) score += 15;

    // Optional fields (10% of total)
    if (formData.nationality?.trim()) score += 2;
    if (formData.health_conditions?.length > 0) score += 2;
    if (formData.allergies?.length > 0) score += 2;
    if (formData.dietary_restrictions?.length > 0) score += 2;
    if (formData.preferred_foods?.length > 0) score += 2;

    return Math.min(score, 100);
  }, [formData]);

  return {
    completionPercentage,
  };
};
