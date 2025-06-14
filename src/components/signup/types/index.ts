
export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: string | number;
  gender: string;
  height: string | number;
  weight: string | number;
  nationality?: string;
  activity_level: string;
  activityLevel: string;
  health_goal: string;
  fitnessGoal: string;
  bodyFatPercentage: number;
  bodyShape: string;
  dietary_preferences: string[];
  food_allergies: string[];
  special_conditions: string[];
  healthConditions: string[];
  allergies: string[];
  preferredFoods: string[];
  dietaryRestrictions: string[];
  specialConditions: string[];
}

export const SIGNUP_STEPS = [
  { title: "Create Account", description: "Let's start with your basic information" },
  { title: "Physical Info", description: "Tell us about your body metrics" },
  { title: "Body Composition", description: "Help us understand your current fitness level" },
  { title: "Goals & Activity", description: "What are your fitness objectives?" },
  { title: "Health & Diet", description: "Optional health and dietary information" }
];
