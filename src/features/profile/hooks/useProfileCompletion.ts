
import { useMemo } from 'react';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  age?: string | number;
  gender?: string;
  height?: string | number;
  weight?: string | number;
  fitness_goal?: string;
  activity_level?: string;
  nationality?: string;
  body_shape?: string;
  health_conditions?: string[];
  allergies?: string[];
  dietary_restrictions?: string[];
  preferred_foods?: string[];
  body_fat_percentage?: string | number;
}

export const useProfileCompletion = (profile: ProfileData | null) => {
  const { completionPercentage, missingFields } = useMemo(() => {
    if (!profile) {
      return { 
        completionPercentage: 0, 
        missingFields: ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'fitness_goal', 'activity_level'] 
      };
    }

    const requiredFields = [
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'age', label: 'Age' },
      { key: 'gender', label: 'Gender' },
      { key: 'height', label: 'Height' },
      { key: 'weight', label: 'Weight' },
      { key: 'fitness_goal', label: 'Fitness Goal' },
      { key: 'activity_level', label: 'Activity Level' }
    ];

    const optionalFields = [
      { key: 'nationality', label: 'Nationality' },
      { key: 'body_shape', label: 'Body Shape' }
    ];

    const allFields = [...requiredFields, ...optionalFields];
    
    const completedFields = allFields.filter(field => {
      const value = profile[field.key as keyof ProfileData];
      return value !== null && value !== undefined && value !== '';
    });

    const missing = allFields.filter(field => {
      const value = profile[field.key as keyof ProfileData];
      return value === null || value === undefined || value === '';
    }).map(field => field.label);

    const completionPercentage = Math.round((completedFields.length / allFields.length) * 100);

    return {
      completionPercentage,
      missingFields: missing
    };
  }, [profile]);

  return {
    completionPercentage,
    missingFields
  };
};
