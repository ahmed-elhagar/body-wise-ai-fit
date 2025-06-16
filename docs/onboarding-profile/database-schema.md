
# Onboarding & Profile Management Database Schema

Comprehensive database structure for user onboarding, profile completion, and preference management in React Native/Expo app.

## 👤 Core Profile Tables

### `profiles` - Main User Profile (Extended)
```sql
-- Core profile table with comprehensive user data
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  
  -- Basic Information
  email text,
  first_name text,
  last_name text,
  display_name text, -- Optional custom display name
  bio text,
  avatar_url text,
  
  -- Demographics
  age integer,
  date_of_birth date,
  gender text, -- 'male', 'female', 'other', 'prefer_not_to_say'
  height numeric, -- in cm
  weight numeric, -- in kg
  nationality text,
  location text,
  timezone text DEFAULT 'UTC',
  preferred_language text DEFAULT 'en',
  
  -- Fitness Profile
  fitness_goal text, -- 'weight_loss', 'muscle_gain', 'endurance', 'strength', 'maintenance'
  activity_level text, -- 'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'
  body_shape text, -- 'ectomorph', 'mesomorph', 'endomorph'
  body_fat_percentage numeric,
  fitness_experience text, -- 'beginner', 'intermediate', 'advanced'
  preferred_workout_time text, -- 'morning', 'afternoon', 'evening', 'flexible'
  workout_duration_preference integer, -- preferred workout duration in minutes
  
  -- Health Information
  health_conditions text[],
  allergies text[],
  dietary_restrictions text[],
  preferred_foods text[],
  disliked_foods text[],
  cooking_skill_level text, -- 'none', 'basic', 'intermediate', 'advanced'
  
  -- Life Phase Context
  pregnancy_trimester smallint, -- 1, 2, 3
  breastfeeding_level text, -- 'exclusive', 'partial', 'none'
  fasting_type text, -- 'intermittent', 'ramadan', 'none'
  condition_start_date date,
  special_conditions jsonb DEFAULT '[]',
  
  -- Platform Settings
  ai_generations_remaining integer DEFAULT 5,
  role user_role DEFAULT 'normal',
  profile_visibility text DEFAULT 'private',
  profile_completion_score integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  
  -- Health Assessment
  last_health_assessment_date date,
  health_assessment_score numeric,
  fitness_readiness_score numeric,
  
  -- Privacy & Marketing
  marketing_consent boolean DEFAULT false,
  data_sharing_consent boolean DEFAULT false,
  newsletter_subscription boolean DEFAULT true,
  
  -- Status & Activity
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  account_status text DEFAULT 'active', -- 'active', 'suspended', 'deactivated'
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_completion_score ON profiles(profile_completion_score);
CREATE INDEX idx_profiles_onboarding_status ON profiles(onboarding_completed);
CREATE INDEX idx_profiles_language ON profiles(preferred_language);
CREATE INDEX idx_profiles_fitness_goal ON profiles(fitness_goal);
```

### `onboarding_progress` - Detailed Onboarding Tracking
```sql
CREATE TABLE onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) UNIQUE,
  
  -- Overall Progress
  current_step integer DEFAULT 1,
  total_steps integer DEFAULT 8,
  completion_percentage integer DEFAULT 0,
  
  -- Step Completion Status
  welcome_viewed boolean DEFAULT false,
  basic_info_completed boolean DEFAULT false,
  demographics_completed boolean DEFAULT false,
  health_assessment_completed boolean DEFAULT false,
  fitness_goals_completed boolean DEFAULT false,
  dietary_preferences_completed boolean DEFAULT false,
  lifestyle_assessment_completed boolean DEFAULT false,
  preferences_setup_completed boolean DEFAULT false,
  profile_review_completed boolean DEFAULT false,
  
  -- Step Completion Timestamps
  welcome_viewed_at timestamptz,
  basic_info_completed_at timestamptz,
  demographics_completed_at timestamptz,
  health_assessment_completed_at timestamptz,
  fitness_goals_completed_at timestamptz,
  dietary_preferences_completed_at timestamptz,
  lifestyle_assessment_completed_at timestamptz,
  preferences_setup_completed_at timestamptz,
  profile_review_completed_at timestamptz,
  
  -- Onboarding Flow Metadata
  onboarding_source text, -- 'direct', 'referral', 'social', 'marketing'
  device_info jsonb DEFAULT '{}',
  utm_data jsonb DEFAULT '{}',
  referral_code text,
  
  -- Skip Tracking
  skipped_steps text[] DEFAULT '{}',
  skip_reasons jsonb DEFAULT '{}',
  
  -- Overall Progress
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_active_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `profile_completion_steps` - Dynamic Step Configuration
```sql
CREATE TABLE profile_completion_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_key text NOT NULL UNIQUE,
  step_name text NOT NULL,
  step_description text,
  step_order integer NOT NULL,
  is_required boolean DEFAULT true,
  points_value integer DEFAULT 10,
  category text, -- 'basic', 'health', 'preferences', 'goals'
  
  -- Step Configuration
  form_schema jsonb, -- JSON schema for validation
  validation_rules jsonb DEFAULT '{}',
  dependencies text[], -- Other steps that must be completed first
  
  -- Localization
  localized_content jsonb DEFAULT '{}',
  
  -- Status
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Default completion steps
INSERT INTO profile_completion_steps (step_key, step_name, step_order, points_value, category) VALUES
('basic_info', 'Basic Information', 1, 15, 'basic'),
('demographics', 'Demographics', 2, 10, 'basic'),
('health_assessment', 'Health Assessment', 3, 20, 'health'),
('fitness_goals', 'Fitness Goals', 4, 15, 'goals'),
('dietary_preferences', 'Dietary Preferences', 5, 10, 'preferences'),
('lifestyle_assessment', 'Lifestyle Assessment', 6, 15, 'health'),
('preferences_setup', 'App Preferences', 7, 10, 'preferences'),
('profile_review', 'Profile Review', 8, 5, 'basic');
```

### `user_preferences` - Enhanced User Preferences
```sql
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) UNIQUE,
  
  -- Language & Localization
  preferred_language text DEFAULT 'en',
  secondary_language text,
  measurement_units text DEFAULT 'metric', -- 'metric', 'imperial'
  date_format text DEFAULT 'DD/MM/YYYY',
  time_format text DEFAULT '24h', -- '12h', '24h'
  currency text DEFAULT 'USD',
  
  -- Theme & Display
  theme_preference text DEFAULT 'light', -- 'light', 'dark', 'auto'
  color_scheme text DEFAULT 'default',
  font_size text DEFAULT 'medium', -- 'small', 'medium', 'large'
  reduce_motion boolean DEFAULT false,
  high_contrast boolean DEFAULT false,
  
  -- Notifications
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  marketing_emails boolean DEFAULT false,
  newsletter_subscription boolean DEFAULT true,
  in_app_notifications boolean DEFAULT true,
  
  -- Notification Categories
  meal_reminders boolean DEFAULT true,
  workout_reminders boolean DEFAULT true,
  progress_updates boolean DEFAULT true,
  coach_messages boolean DEFAULT true,
  achievement_notifications boolean DEFAULT true,
  social_notifications boolean DEFAULT true,
  
  -- Reminder Timing
  meal_reminder_times jsonb DEFAULT '{"breakfast": "08:00", "lunch": "12:00", "dinner": "18:00"}',
  workout_reminder_time time DEFAULT '18:00',
  bedtime_reminder_time time DEFAULT '22:00',
  water_reminder_interval integer DEFAULT 120, -- minutes
  
  -- AI Features
  ai_suggestions boolean DEFAULT true,
  automatic_meal_planning boolean DEFAULT true,
  automatic_exercise_planning boolean DEFAULT true,
  ai_coaching boolean DEFAULT true,
  personalized_content boolean DEFAULT true,
  
  -- Privacy & Data
  profile_visibility text DEFAULT 'private', -- 'private', 'friends', 'public'
  data_sharing_research boolean DEFAULT false,
  data_sharing_analytics boolean DEFAULT true,
  location_tracking boolean DEFAULT false,
  crash_reporting boolean DEFAULT true,
  
  -- Content Preferences
  content_difficulty text DEFAULT 'adaptive', -- 'beginner', 'intermediate', 'advanced', 'adaptive'
  motivation_style text DEFAULT 'encouraging', -- 'encouraging', 'challenging', 'neutral'
  communication_tone text DEFAULT 'friendly', -- 'formal', 'friendly', 'casual'
  
  -- Accessibility
  screen_reader_support boolean DEFAULT false,
  voice_commands boolean DEFAULT false,
  gesture_navigation boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `onboarding_analytics` - Onboarding Performance Tracking
```sql
CREATE TABLE onboarding_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Event Tracking
  event_type text NOT NULL, -- 'step_started', 'step_completed', 'step_skipped', 'error', 'drop_off'
  step_key text NOT NULL,
  event_timestamp timestamptz DEFAULT now(),
  
  -- Performance Metrics
  time_spent_seconds integer,
  interactions_count integer DEFAULT 0,
  errors_count integer DEFAULT 0,
  
  -- Context Data
  device_info jsonb DEFAULT '{}',
  app_version text,
  platform text, -- 'ios', 'android', 'web'
  screen_resolution text,
  
  -- User Behavior
  input_method text, -- 'touch', 'voice', 'keyboard'
  completion_method text, -- 'normal', 'skip', 'auto_fill'
  user_agent text,
  
  -- Drop-off Analysis
  exit_reason text, -- 'user_exit', 'app_crash', 'timeout', 'error'
  last_interaction_timestamp timestamptz,
  
  created_at timestamptz DEFAULT now()
);
```

## 🔗 React Native Integration

### TypeScript Interfaces
```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  
  // Demographics
  age?: number;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number; // cm
  weight?: number; // kg
  nationality?: string;
  location?: string;
  timezone: string;
  preferredLanguage: 'en' | 'ar';
  
  // Fitness
  fitnessGoal?: string;
  activityLevel?: string;
  bodyShape?: string;
  bodyFatPercentage?: number;
  fitnessExperience?: string;
  preferredWorkoutTime?: string;
  workoutDurationPreference?: number;
  
  // Health
  healthConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  preferredFoods: string[];
  dislikedFoods: string[];
  cookingSkillLevel?: string;
  
  // Life Phase
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  fastingType?: string;
  conditionStartDate?: string;
  specialConditions: any[];
  
  // Platform
  aiGenerationsRemaining: number;
  role: 'normal' | 'coach' | 'admin';
  profileVisibility: string;
  profileCompletionScore: number;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Consent
  marketingConsent: boolean;
  dataSharingConsent: boolean;
  newsletterSubscription: boolean;
  
  // Status
  isOnline: boolean;
  lastSeen: string;
  accountStatus: string;
  
  createdAt: string;
  updatedAt: string;
}

interface OnboardingProgress {
  id: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  
  // Step completion status
  welcomeViewed: boolean;
  basicInfoCompleted: boolean;
  demographicsCompleted: boolean;
  healthAssessmentCompleted: boolean;
  fitnessGoalsCompleted: boolean;
  dietaryPreferencesCompleted: boolean;
  lifestyleAssessmentCompleted: boolean;
  preferencesSetupCompleted: boolean;
  profileReviewCompleted: boolean;
  
  // Metadata
  onboardingSource?: string;
  deviceInfo: any;
  utmData: any;
  referralCode?: string;
  skippedSteps: string[];
  skipReasons: any;
  
  startedAt: string;
  completedAt?: string;
  lastActiveAt: string;
  updatedAt: string;
}

interface UserPreferences {
  id: string;
  userId: string;
  
  // Localization
  preferredLanguage: 'en' | 'ar';
  secondaryLanguage?: string;
  measurementUnits: 'metric' | 'imperial';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  
  // Theme
  themePreference: 'light' | 'dark' | 'auto';
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  highContrast: boolean;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  newsletterSubscription: boolean;
  inAppNotifications: boolean;
  
  // Notification categories
  mealReminders: boolean;
  workoutReminders: boolean;
  progressUpdates: boolean;
  coachMessages: boolean;
  achievementNotifications: boolean;
  socialNotifications: boolean;
  
  // Reminders
  mealReminderTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  workoutReminderTime: string;
  bedtimeReminderTime: string;
  waterReminderInterval: number;
  
  // AI Features
  aiSuggestions: boolean;
  automaticMealPlanning: boolean;
  automaticExercisePlanning: boolean;
  aiCoaching: boolean;
  personalizedContent: boolean;
  
  // Privacy
  profileVisibility: 'private' | 'friends' | 'public';
  dataSharingResearch: boolean;
  dataSharingAnalytics: boolean;
  locationTracking: boolean;
  crashReporting: boolean;
  
  // Content
  contentDifficulty: string;
  motivationStyle: string;
  communicationTone: string;
  
  // Accessibility
  screenReaderSupport: boolean;
  voiceCommands: boolean;
  gestureNavigation: boolean;
}
```

## 🏗️ Database Functions

### Calculate Profile Completion Score
```sql
CREATE OR REPLACE FUNCTION calculate_profile_completion_score(
  user_id_param uuid
) RETURNS integer AS $$
DECLARE
  score INTEGER := 0;
  total_possible INTEGER := 0;
  step_record RECORD;
  profile_data RECORD;
  onboarding_data RECORD;
BEGIN
  -- Get profile data
  SELECT * INTO profile_data FROM profiles WHERE id = user_id_param;
  
  -- Get onboarding progress
  SELECT * INTO onboarding_data FROM onboarding_progress WHERE user_id = user_id_param;
  
  -- Calculate score based on completion steps
  FOR step_record IN 
    SELECT step_key, points_value, is_required 
    FROM profile_completion_steps 
    WHERE is_active = true 
    ORDER BY step_order
  LOOP
    total_possible := total_possible + step_record.points_value;
    
    -- Check if step is completed
    CASE step_record.step_key
      WHEN 'basic_info' THEN
        IF profile_data.first_name IS NOT NULL AND profile_data.last_name IS NOT NULL THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'demographics' THEN
        IF profile_data.age IS NOT NULL AND profile_data.gender IS NOT NULL THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'health_assessment' THEN
        IF onboarding_data.health_assessment_completed THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'fitness_goals' THEN
        IF profile_data.fitness_goal IS NOT NULL AND profile_data.activity_level IS NOT NULL THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'dietary_preferences' THEN
        IF onboarding_data.dietary_preferences_completed THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'lifestyle_assessment' THEN
        IF onboarding_data.lifestyle_assessment_completed THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'preferences_setup' THEN
        IF onboarding_data.preferences_setup_completed THEN
          score := score + step_record.points_value;
        END IF;
      WHEN 'profile_review' THEN
        IF onboarding_data.profile_review_completed THEN
          score := score + step_record.points_value;
        END IF;
    END CASE;
  END LOOP;
  
  -- Return percentage score
  IF total_possible > 0 THEN
    RETURN ROUND((score::numeric / total_possible) * 100);
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Update Onboarding Step
```sql
CREATE OR REPLACE FUNCTION update_onboarding_step(
  user_id_param uuid,
  step_key_param text,
  completion_data_param jsonb DEFAULT '{}'
) RETURNS void AS $$
DECLARE
  step_column text;
  timestamp_column text;
  current_progress RECORD;
BEGIN
  -- Get current progress
  SELECT * INTO current_progress FROM onboarding_progress WHERE user_id = user_id_param;
  
  -- Map step key to column names
  step_column := step_key_param || '_completed';
  timestamp_column := step_key_param || '_completed_at';
  
  -- Update the specific step
  EXECUTE format('
    UPDATE onboarding_progress 
    SET %I = true, %I = NOW(), last_active_at = NOW(), updated_at = NOW()
    WHERE user_id = $1
  ', step_column, timestamp_column) 
  USING user_id_param;
  
  -- Calculate and update completion percentage
  UPDATE onboarding_progress 
  SET completion_percentage = calculate_profile_completion_score(user_id_param)
  WHERE user_id = user_id_param;
  
  -- Check if onboarding is complete
  UPDATE onboarding_progress 
  SET completed_at = NOW()
  WHERE user_id = user_id_param 
  AND completion_percentage >= 80 
  AND completed_at IS NULL;
  
  -- Update profile onboarding status
  UPDATE profiles 
  SET 
    onboarding_completed = (
      SELECT completion_percentage >= 80 
      FROM onboarding_progress 
      WHERE user_id = user_id_param
    ),
    profile_completion_score = calculate_profile_completion_score(user_id_param),
    updated_at = NOW()
  WHERE id = user_id_param;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This comprehensive onboarding and profile management schema provides detailed user tracking, customizable completion steps, and robust analytics for optimizing the user onboarding experience in React Native.
