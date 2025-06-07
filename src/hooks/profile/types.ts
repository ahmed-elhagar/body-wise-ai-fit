
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
  special_conditions: string[];
}

export interface ValidationErrors {
  [key: string]: string;
}
