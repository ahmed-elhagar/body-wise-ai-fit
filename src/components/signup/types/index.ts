
export interface SignupFormData {
  email: string;
  password: string;
  age: string | number;
  gender: string;
  height: string | number;
  weight: string | number;
  activity_level: string;
  health_goal: string;
  bodyFatPercentage: number;
  bodyShape: string;
  dietary_preferences: string[];
  food_allergies: string[];
  special_conditions: string[];
}
