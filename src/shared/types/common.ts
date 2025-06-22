// Shared Types Across All Features
// Common interfaces and types used throughout the application

// User and Authentication
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  success: boolean;
  message?: string;
}

// Date and Time
export interface DateRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  label?: string;
}

// Nutrition Common Types
export interface NutritionMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface NutritionTarget extends NutritionMacros {
  user_id: string;
  daily_goal: boolean;
}

// Form and UI Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: string[];
  options?: { value: string; label: string }[];
}

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
  stage?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  details?: any;
}

// Feature Status Types
export type FeatureStatus = 'active' | 'inactive' | 'maintenance' | 'beta';

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  status: FeatureStatus;
  rollout_percentage?: number;
  user_segments?: string[];
}

// Subscription and Credits
export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deduct' | 'refund' | 'purchase' | 'bonus';
  feature: string;
  description: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  credits_included: number;
  popular?: boolean;
}

// AI and Generation
export interface AIGenerationOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  user_context?: any;
  feature_context?: any;
}

export interface AIGenerationResult {
  content: string;
  tokens_used: number;
  credits_consumed: number;
  generation_time: number;
  model_used: string;
  success: boolean;
  error?: string;
}

// File and Media
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  name: string;
  user_id: string;
  feature?: string;
  created_at: string;
}

// Notification Types
export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  feature?: string;
  action_url?: string;
  read: boolean;
  created_at: string;
}

// Analytics and Metrics
export interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  feature: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, any>;
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Database Table Names (for consistency)
export const TABLE_NAMES = {
  PROFILES: 'profiles',
  MEAL_PLANS: 'meal_plans',
  FOOD_ENTRIES: 'food_entries',
  EXERCISES: 'exercises',
  WORKOUTS: 'workouts',
  COACH_TASKS: 'coach_tasks',
  COACH_MESSAGES: 'coach_messages',
  NOTIFICATIONS: 'notifications',
  CREDITS: 'credits',
  SUBSCRIPTIONS: 'subscriptions'
} as const;

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, ValidationError[]>;
  touched: Record<string, boolean>;
}

// Component State Types
export interface ComponentState<T = any> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  lastUpdated: Date | null;
}

export interface MealType {
  id: string;
  name: string;
  displayName: string;
  order: number;
  defaultCalories?: number;
}

export interface WorkoutMetrics {
  duration: number; // minutes
  estimatedCalories: number;
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
  muscleGroups: string[];
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: SearchFilters;
  executionTime: number;
}

// User Preference Types
export interface UserPreferences {
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    temperature: 'celsius' | 'fahrenheit';
  };
}

// Analytics and Tracking Types
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
} 