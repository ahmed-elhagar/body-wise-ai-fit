
# User Management & Authentication Database Schema

Comprehensive database structure for user management, authentication, and profile management in React Native/Expo app.

## 👤 Core User Tables

### `profiles` - Extended User Profiles
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  
  -- Basic Information
  email text,
  first_name text,
  last_name text,
  bio text,
  
  -- Demographics
  age integer,
  gender text, -- 'male', 'female', 'other'
  height numeric, -- in cm
  weight numeric, -- in kg
  nationality text,
  location text,
  timezone text DEFAULT 'UTC',
  preferred_language text DEFAULT 'en',
  
  -- Fitness Profile
  fitness_goal text, -- 'weight_loss', 'muscle_gain', 'endurance', 'strength'
  activity_level text, -- 'sedentary', 'lightly_active', 'moderately_active'
  body_shape text, -- 'ectomorph', 'mesomorph', 'endomorph'
  body_fat_percentage numeric,
  
  -- Health Information
  health_conditions text[],
  allergies text[],
  dietary_restrictions text[],
  preferred_foods text[],
  
  -- Life Phase Context
  pregnancy_trimester smallint, -- 1, 2, 3
  breastfeeding_level text, -- 'exclusive', 'partial'
  fasting_type text, -- 'intermittent', 'ramadan', 'none'
  condition_start_date date,
  special_conditions jsonb DEFAULT '[]',
  
  -- Platform Settings
  ai_generations_remaining integer DEFAULT 5,
  role user_role DEFAULT 'normal',
  profile_visibility text DEFAULT 'private',
  profile_completion_score integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  last_health_assessment_date date,
  
  -- Status & Activity
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_activity_level ON profiles(activity_level);
CREATE INDEX idx_profiles_fitness_goal ON profiles(fitness_goal);
CREATE INDEX idx_profiles_online_status ON profiles(is_online, last_seen);
```

### `user_preferences` - User Settings & Preferences
```sql
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) UNIQUE,
  
  -- Language & Localization
  preferred_language text DEFAULT 'en',
  measurement_units text DEFAULT 'metric', -- 'metric', 'imperial'
  theme_preference text DEFAULT 'light', -- 'light', 'dark', 'auto'
  
  -- Notifications
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  marketing_emails boolean DEFAULT false,
  
  -- Reminders
  meal_reminder_times jsonb DEFAULT '{"breakfast": "08:00", "lunch": "12:00", "dinner": "18:00"}',
  workout_reminder_time time DEFAULT '18:00',
  progress_reminders boolean DEFAULT true,
  
  -- AI Features
  ai_suggestions boolean DEFAULT true,
  automatic_meal_planning boolean DEFAULT true,
  automatic_exercise_planning boolean DEFAULT true,
  
  -- Privacy
  profile_visibility text DEFAULT 'private', -- 'private', 'friends', 'public'
  data_sharing_research boolean DEFAULT false,
  data_sharing_analytics boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `onboarding_progress` - User Onboarding Tracking
```sql
CREATE TABLE onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) UNIQUE,
  
  -- Progress Tracking
  current_step integer DEFAULT 1,
  total_steps integer DEFAULT 5,
  completion_percentage integer DEFAULT 0,
  
  -- Step Completion Status
  basic_info_completed boolean DEFAULT false,
  health_assessment_completed boolean DEFAULT false,
  goals_setup_completed boolean DEFAULT false,
  preferences_completed boolean DEFAULT false,
  profile_review_completed boolean DEFAULT false,
  
  -- Completion Timestamps
  basic_info_completed_at timestamptz,
  health_assessment_completed_at timestamptz,
  goals_setup_completed_at timestamptz,
  preferences_completed_at timestamptz,
  profile_review_completed_at timestamptz,
  
  -- Overall Progress
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);
```

### `user_roles` - Role-Based Access Control
```sql
-- Custom enum for user roles
CREATE TYPE user_role AS ENUM ('normal', 'coach', 'admin');

-- Role assignments table (for multiple role support)
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, role)
);
```

### `active_sessions` - Session Management
```sql
CREATE TABLE active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  session_id text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  last_activity timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for session cleanup
CREATE INDEX idx_active_sessions_last_activity 
ON active_sessions(last_activity);
```

## 📊 User Analytics & Tracking

### `user_achievements` - Gamification
```sql
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  achievement_id text NOT NULL, -- 'first_workout', 'week_streak', etc.
  earned_at timestamptz NOT NULL DEFAULT now(),
  progress_data jsonb DEFAULT '{}'
);

-- Index for user achievements
CREATE INDEX idx_user_achievements_user_id 
ON user_achievements(user_id, earned_at DESC);
```

### `user_goals` - Personal Goal Tracking
```sql
CREATE TABLE user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Goal Details
  title text NOT NULL,
  description text,
  category text NOT NULL, -- 'fitness', 'nutrition', 'health'
  goal_type text NOT NULL, -- 'weight_loss', 'muscle_gain', 'habit'
  
  -- Target & Progress
  target_value numeric,
  target_unit text, -- 'kg', 'lbs', 'days', 'reps'
  current_value numeric DEFAULT 0,
  
  -- Timeline
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  target_date date,
  
  -- Status & Priority
  status text NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused'
  priority text DEFAULT 'medium', -- 'low', 'medium', 'high'
  difficulty text DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  
  -- Additional Data
  milestones jsonb DEFAULT '[]',
  tags text[],
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `user_notifications` - In-App Notifications
```sql
CREATE TABLE user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Notification Content
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL, -- 'info', 'success', 'warning', 'error'
  
  -- Action & Metadata
  action_url text,
  metadata jsonb DEFAULT '{}',
  
  -- Status
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for efficient notification queries
CREATE INDEX idx_user_notifications_user_unread 
ON user_notifications(user_id, is_read, created_at DESC);
```

## 🏥 Health & Assessment

### `health_assessments` - Comprehensive Health Tracking
```sql
CREATE TABLE health_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  assessment_type text NOT NULL DEFAULT 'onboarding',
  completed_at timestamptz DEFAULT now(),
  
  -- Physical Health
  chronic_conditions text[],
  medications text[],
  injuries text[],
  physical_limitations text[],
  
  -- Lifestyle Assessment
  stress_level integer, -- 1-10 scale
  sleep_quality integer, -- 1-10 scale
  energy_level integer, -- 1-10 scale
  exercise_history text, -- 'none', 'beginner', 'intermediate', 'advanced'
  
  -- Nutrition & Cooking
  cooking_skills text, -- 'none', 'basic', 'intermediate', 'advanced'
  nutrition_knowledge text, -- 'limited', 'basic', 'good', 'expert'
  
  -- Goals & Motivation
  primary_motivation text[],
  specific_goals text[],
  timeline_expectation text, -- '1_month', '3_months', '6_months', '1_year'
  commitment_level integer, -- 1-10 scale
  
  -- Availability & Constraints
  time_availability text, -- 'very_limited', 'limited', 'moderate', 'flexible'
  work_schedule text, -- 'regular', 'shift', 'irregular', 'flexible'
  
  -- Calculated Scores
  health_score numeric,
  readiness_score numeric,
  risk_score numeric,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 📱 React Native Data Structures

### TypeScript Interfaces
```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  
  // Demographics
  age?: number;
  gender?: 'male' | 'female' | 'other';
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
  
  // Health
  healthConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  preferredFoods: string[];
  
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
  
  // Status
  isOnline: boolean;
  lastSeen: string;
  
  createdAt: string;
  updatedAt: string;
}

interface UserPreferences {
  id: string;
  userId: string;
  
  // Localization
  preferredLanguage: 'en' | 'ar';
  measurementUnits: 'metric' | 'imperial';
  themePreference: 'light' | 'dark' | 'auto';
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  
  // Reminders
  mealReminderTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  workoutReminderTime: string;
  progressReminders: boolean;
  
  // AI Features
  aiSuggestions: boolean;
  automaticMealPlanning: boolean;
  automaticExercisePlanning: boolean;
  
  // Privacy
  profileVisibility: 'private' | 'friends' | 'public';
  dataSharingResearch: boolean;
  dataSharingAnalytics: boolean;
}

interface OnboardingProgress {
  id: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  
  // Step Status
  basicInfoCompleted: boolean;
  healthAssessmentCompleted: boolean;
  goalsSetupCompleted: boolean;
  preferencesCompleted: boolean;
  profileReviewCompleted: boolean;
  
  // Timestamps
  basicInfoCompletedAt?: string;
  healthAssessmentCompletedAt?: string;
  goalsSetupCompletedAt?: string;
  preferencesCompletedAt?: string;
  profileReviewCompletedAt?: string;
  
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
}
```

## 🏗️ Database Functions

### Profile Completion Calculation
```sql
CREATE OR REPLACE FUNCTION calculate_profile_completion_score(
  user_id_param uuid
) RETURNS integer AS $$
DECLARE
  score INTEGER := 0;
  profile_data RECORD;
  onboarding_data RECORD;
BEGIN
  -- Get profile data
  SELECT * INTO profile_data FROM profiles WHERE id = user_id_param;
  
  -- Get onboarding progress
  SELECT * INTO onboarding_data FROM onboarding_progress WHERE user_id = user_id_param;
  
  -- Calculate score based on profile completeness
  IF profile_data.first_name IS NOT NULL AND profile_data.first_name != '' THEN score := score + 10; END IF;
  IF profile_data.last_name IS NOT NULL AND profile_data.last_name != '' THEN score := score + 10; END IF;
  IF profile_data.age IS NOT NULL THEN score := score + 10; END IF;
  IF profile_data.gender IS NOT NULL THEN score := score + 10; END IF;
  IF profile_data.height IS NOT NULL THEN score := score + 10; END IF;
  IF profile_data.weight IS NOT NULL THEN score := score + 10; END IF;
  IF profile_data.fitness_goal IS NOT NULL THEN score := score + 10; END IF;
  IF profile_data.activity_level IS NOT NULL THEN score := score + 10; END IF;
  
  -- Bonus points for onboarding completion
  IF onboarding_data.basic_info_completed THEN score := score + 5; END IF;
  IF onboarding_data.health_assessment_completed THEN score := score + 10; END IF;
  IF onboarding_data.goals_setup_completed THEN score := score + 10; END IF;
  IF onboarding_data.preferences_completed THEN score := score + 5; END IF;
  
  RETURN LEAST(score, 100); -- Cap at 100%
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### User Role Management
```sql
CREATE OR REPLACE FUNCTION has_role(
  _user_id uuid, 
  _role user_role
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_user_role(
  target_user_id uuid,
  new_role user_role
) RETURNS void AS $$
BEGIN
  -- Check if current user is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can update user roles';
  END IF;
  
  UPDATE profiles
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Session Management
```sql
CREATE OR REPLACE FUNCTION update_user_online_status(
  user_id uuid,
  is_online boolean
) RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    is_online = update_user_online_status.is_online,
    last_seen = CASE 
      WHEN update_user_online_status.is_online = false THEN now() 
      ELSE last_seen 
    END,
    updated_at = now()
  WHERE id = update_user_online_status.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cleanup_old_sessions() RETURNS void AS $$
BEGIN
  DELETE FROM active_sessions 
  WHERE last_activity < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔐 Security & Triggers

### Automatic Profile Creation
```sql
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  -- Insert profile with default values
  INSERT INTO profiles (id, email, first_name, last_name, ai_generations_remaining, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    5,
    'normal'
  );
  
  -- Create onboarding progress record
  INSERT INTO onboarding_progress (user_id)
  VALUES (NEW.id);
  
  -- Create user preferences with defaults
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Profile Completion Score Trigger
```sql
CREATE OR REPLACE FUNCTION update_profile_completion_score() RETURNS trigger AS $$
BEGIN
  UPDATE profiles 
  SET profile_completion_score = calculate_profile_completion_score(NEW.user_id),
      updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for onboarding progress updates
CREATE TRIGGER update_profile_completion_on_onboarding_change
  AFTER UPDATE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_profile_completion_score();
```

This comprehensive user management schema provides a robust foundation for authentication, profiles, preferences, and role-based access control in React Native with proper security and performance optimizations.
