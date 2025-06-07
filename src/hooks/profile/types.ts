
export interface ProfileFormData {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  body_fat_percentage: string;
  fitness_goal: string;
  activity_level: string;
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
}

export interface ValidationErrors {
  [key: string]: string;
  first_name?: string;
  last_name?: string;
  age?: string;
  gender?: string;
  height?: string;
  weight?: string;
  nationality?: string;
  body_shape?: string;
  fitness_goal?: string;
  activity_level?: string;
}
