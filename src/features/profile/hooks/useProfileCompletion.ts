
import { useMemo } from 'react';
import type { ProfileFormData } from './types';

export const useProfileCompletion = (formData: ProfileFormData) => {
  const completionPercentage = useMemo(() => {
    const fields = [
      formData.first_name,
      formData.last_name,
      formData.age,
      formData.gender,
      formData.height,
      formData.weight,
      formData.fitness_goal,
      formData.activity_level,
      formData.nationality,
      formData.body_shape
    ];

    const completedFields = fields.filter(field => 
      field !== null && field !== undefined && field !== ''
    ).length;
    const totalFields = fields.length;

    return Math.round((completedFields / totalFields) * 100);
  }, [formData]);

  return {
    completionPercentage,
  };
};
