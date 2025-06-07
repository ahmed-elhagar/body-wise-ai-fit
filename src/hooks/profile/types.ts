
export interface ProfileFormData {
  // Basic Info
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  
  // Goals & Activity
  fitness_goal: string;
  activity_level: string;
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
  special_conditions: any[];
}

export interface ValidationErrors {
  [key: string]: string;
}

// Valid activity levels that match database constraint
export const VALID_ACTIVITY_LEVELS = [
  'sedentary',
  'lightly_active', 
  'moderately_active',
  'very_active',
  'extremely_active'
] as const;

export type ActivityLevel = typeof VALID_ACTIVITY_LEVELS[number];
