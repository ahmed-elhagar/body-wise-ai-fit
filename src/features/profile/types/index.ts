
// Profile feature types
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal_weight?: number;
  activity_level: string;
  fitness_goal: string;
  dietary_restrictions: string[];
  health_conditions: string[];
  life_phase?: 'pregnancy' | 'breastfeeding' | 'fasting';
}

export interface ProfileCompletionScore {
  score: number;
  maxScore: number;
  missingFields: string[];
}
