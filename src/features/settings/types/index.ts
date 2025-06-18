
// Settings feature types
export interface UserPreferences {
  id?: string;
  user_id: string;
  theme_preference: 'light' | 'dark' | 'auto';
  preferred_language: string;
  measurement_units: 'metric' | 'imperial';
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  data_sharing_analytics: boolean;
  data_sharing_research: boolean;
  ai_suggestions: boolean;
  automatic_meal_planning: boolean;
  automatic_exercise_planning: boolean;
  progress_reminders: boolean;
  meal_reminder_times: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  workout_reminder_time: string;
  profile_visibility: 'private' | 'public' | 'friends';
  created_at?: string;
  updated_at?: string;
}

export interface FoodPreferences {
  preferredCuisines: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isKeto: boolean;
  isPaleo: boolean;
  isHalal: boolean;
  isKosher: boolean;
  dietaryRestrictions: string[];
  allergies: string[];
}

export interface HealthCondition {
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  diagnosed_date?: string;
  notes?: string;
}

export interface SpecialCondition {
  type: 'muslim_fasting' | 'vacation_mood' | 'injury';
  startDate: string;
  endDate: string;
  details?: string;
}

export interface SettingsFormData {
  general: Partial<UserPreferences>;
  foodPreferences: FoodPreferences;
  healthConditions: string[];
  specialConditions: SpecialCondition[];
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}
