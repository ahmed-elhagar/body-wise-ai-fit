
export interface SignupFormData {
  // Step 1: Account Creation
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  
  // Step 2: Physical Info
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  
  // Step 3: Body Composition
  bodyFatPercentage: number;
  
  // Step 4: Goals & Activity
  fitnessGoal: string;
  activityLevel: string;
  
  // Step 5: Health & Diet (Optional)
  healthConditions: string[];
  allergies: string[];
  preferredFoods: string[];
  dietaryRestrictions: string[];
  specialConditions: string[];
}

export interface SignupStep {
  id: number;
  title: string;
  description: string;
  isOptional?: boolean;
}

export const SIGNUP_STEPS: SignupStep[] = [
  { id: 1, title: "Create Account", description: "Basic account information" },
  { id: 2, title: "Physical Info", description: "Your body measurements" },
  { id: 3, title: "Body Type", description: "Body composition details" },
  { id: 4, title: "Goals", description: "Fitness goals and activity level" },
  { id: 5, title: "Health Info", description: "Health and dietary preferences", isOptional: true }
];
