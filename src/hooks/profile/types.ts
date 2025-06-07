
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
  
  // Health & Diet Information (arrays)
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
  special_conditions: string[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface SignupProfileData {
  // Basic Info - mapped from signup form
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  nationality: string;
  
  // Body composition
  body_fat_percentage: number;
  body_shape: string;
  
  // Goals & Activity
  fitness_goal: string;
  activity_level: string;
  
  // Health & Diet arrays
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
  special_conditions: string[];
  
  // System fields
  ai_generations_remaining: number;
  profile_completion_score: number;
  updated_at: string;
}
