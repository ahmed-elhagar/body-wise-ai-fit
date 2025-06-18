
export interface SignupFormData {
  // Account creation
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  
  // Physical info
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality?: string;
  
  // Body composition
  targetWeight?: string;
  bodyShape: string;
  bodyFatPercentage?: string | number;
  muscleMass?: string;
  
  // Goals and activity
  fitnessGoal: string;
  activityLevel: string;
  
  // Health info
  healthConditions?: string[];
  allergies?: string[];
  preferredFoods?: string[];
  dietaryRestrictions?: string[];
  specialConditions?: string[];
}

export const SIGNUP_STEPS = [
  {
    title: "Create Account",
    description: "Let's start with your basic information"
  },
  {
    title: "Physical Information",
    description: "Tell us about your physical characteristics"
  },
  {
    title: "Body Composition",
    description: "Help us understand your current body state"
  },
  {
    title: "Goals & Activity",
    description: "What are your fitness goals and activity level?"
  },
  {
    title: "Health Information",
    description: "Any health conditions or allergies we should know about?"
  }
];
