
export interface ProfileFormData {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  fitness_goal: string;
  activity_level: string;
  dietary_restrictions: string[];
  allergies: string[];
  health_conditions: string[];
  preferred_foods: string[];
  special_conditions: string[];
}

export interface ValidationErrors {
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
