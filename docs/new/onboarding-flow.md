
# FitFatta Onboarding Flow

## Overview
FitFatta uses a progressive onboarding system that guides users through essential profile completion while allowing them to start using the app immediately.

## Onboarding Stages

### Stage 1: Account Creation
**Location:** `/auth` page
**Required Fields:**
- Email address
- Password (minimum 8 characters)
- First name
- Last name

**Database Operations:**
- Create user in `auth.users`
- Create profile in `profiles` table
- Initialize `onboarding_progress` record
- Grant 5 AI generations initially

**Completion Trigger:** Successful user registration

### Stage 2: Basic Information
**Location:** `/profile` page (redirected after first login)
**Required Fields:**
- Age (integer, 13-120)
- Gender (male/female)
- Weight (kg, 30-300)
- Height (cm, 100-250)

**Optional Fields:**
- Profile picture upload
- Phone number
- Preferred language (en/ar)

**Validation Rules:**
```typescript
const basicInfoSchema = {
  age: { min: 13, max: 120, required: true },
  gender: { enum: ['male', 'female'], required: true },
  weight: { min: 30, max: 300, required: true },
  height: { min: 100, max: 250, required: true }
};
```

**Completion Score:** +40 points
**Completion Trigger:** All required fields filled

### Stage 3: Health Assessment
**Location:** `/profile` health assessment section
**Required Fields:**
- Activity level (sedentary/lightly_active/moderately_active/very_active/extra_active)
- Primary fitness goal (lose_weight/gain_weight/maintain_weight/build_muscle/improve_fitness)

**Optional Fields:**
- Current health conditions (array)
- Medications (array)
- Exercise experience level
- Injuries or limitations

**Health Conditions Options:**
- Diabetes
- Hypertension
- Heart disease
- Arthritis
- Other (custom input)

**Completion Score:** +30 points
**Completion Trigger:** Activity level and fitness goal selected

### Stage 4: Dietary Preferences
**Location:** `/profile` dietary section
**Required Fields:**
- Dietary restrictions (array, can be empty)
- Food allergies (array, can be empty)

**Dietary Restrictions Options:**
- Vegetarian
- Vegan
- Gluten-free
- Dairy-free
- Keto
- Low-carb
- Halal
- Kosher
- Paleo
- Mediterranean

**Common Allergies:**
- Nuts
- Shellfish
- Eggs
- Dairy
- Soy
- Wheat/Gluten
- Fish
- Seeds

**Completion Score:** +20 points
**Completion Trigger:** Dietary preferences reviewed (even if empty)

### Stage 5: Life Phase Assessment (Optional)
**Location:** `/profile` life phase section
**Applicable Fields:**
- Pregnancy status (trimester 1-3)
- Breastfeeding status (exclusive/partial)
- Islamic fasting periods
- Special dietary needs

**Calorie Adjustments:**
- Pregnancy Trimester 2: +340 calories
- Pregnancy Trimester 3: +450 calories
- Exclusive Breastfeeding: +400 calories
- Partial Breastfeeding: +250 calories

**Special Conditions Tracking:**
```typescript
interface SpecialCondition {
  type: 'pregnancy' | 'breastfeeding' | 'muslim_fasting';
  startDate: string;
  endDate: string;
  details: {
    trimester?: number;
    level?: 'exclusive' | 'partial';
    fastingType?: 'ramadan' | 'general';
  };
}
```

**Completion Score:** +10 points
**Completion Trigger:** Life phase section reviewed

## Profile Completion Scoring

### Scoring System
```typescript
const calculateCompletionScore = (profile: UserProfile) => {
  let score = 0;
  
  // Basic info (50 points total)
  if (profile.first_name) score += 10;
  if (profile.last_name) score += 10;
  if (profile.age) score += 10;
  if (profile.gender) score += 10;
  if (profile.height && profile.weight) score += 10;
  
  // Health assessment (30 points total)
  if (profile.activity_level) score += 15;
  if (profile.fitness_goal) score += 15;
  
  // Preferences (20 points total)
  if (profile.dietary_restrictions !== null) score += 10;
  if (profile.allergies !== null) score += 10;
  
  return Math.min(score, 100);
};
```

### Completion Thresholds
- **0-30%:** Critical (blocks meal plan generation)
- **31-60%:** Basic (limited features)
- **61-80%:** Good (most features available)
- **81-100%:** Complete (all features unlocked)

## Onboarding UI Components

### Progress Indicator
```typescript
interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  stepsCompleted: {
    basicInfo: boolean;
    healthAssessment: boolean;
    dietaryPreferences: boolean;
    lifePhaseAssessment: boolean;
  };
}
```

### Profile Completion Banner
**Display Conditions:**
- Show when completion < 80%
- Hide after user dismisses (with 24h cooldown)
- Priority display on dashboard

**Banner Content:**
- Current completion percentage
- Next recommended step
- "Complete Profile" CTA button
- Progress bar visualization

### Skip Options
**Allowed Skips:**
- Life phase assessment (always optional)
- Health conditions (can be added later)
- Profile picture (cosmetic only)

**Required for Core Features:**
- Basic info (age, gender, weight, height) - Required for meal plans
- Activity level - Required for calorie calculations
- Dietary restrictions - Required for safe meal planning

## Onboarding Triggers

### First Login Flow
1. Check `onboarding_progress.basic_info_completed`
2. If false, redirect to `/profile` with guided tour
3. Show step-by-step completion guide
4. Celebrate milestone completions

### Return User Flow
1. Check profile completion score
2. If < 60%, show completion banner
3. If < 30%, show blocking modal for meal plan features
4. Track completion improvements over time

### Feature-Specific Prompts
**Meal Plan Generation:**
- Requires: Basic info + Activity level (minimum 60% completion)
- Blocks access with completion prompt if insufficient

**Exercise Program:**
- Requires: Basic info + Fitness goal (minimum 50% completion)
- Shows recommendations based on available data

## Database Schema

### Onboarding Progress Tracking
```sql
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  basic_info_completed BOOLEAN DEFAULT FALSE,
  health_assessment_completed BOOLEAN DEFAULT FALSE,
  goals_setup_completed BOOLEAN DEFAULT FALSE,
  preferences_completed BOOLEAN DEFAULT FALSE,
  last_completed_step INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Profile Completion Scoring
```sql
-- Function to calculate and update completion score
CREATE OR REPLACE FUNCTION calculate_profile_completion_score(user_id_param UUID)
RETURNS INTEGER AS $$
-- Implementation in database functions
$$;
```

## Mobile Onboarding Adaptations

### React Native Specific
- Welcome screen with app benefits
- Swipeable onboarding cards
- Native form inputs with validation
- Progress indicators in tab bar
- Push notification permissions request

### Platform-Specific Features
- **iOS:** Face ID/Touch ID setup prompt
- **Android:** Biometric authentication setup
- **Both:** Calendar integration for meal planning
- **Both:** Health kit integration (future)

## Analytics & Optimization

### Tracking Metrics
- Step completion rates
- Drop-off points
- Time to complete each step
- Feature adoption after completion
- Return user engagement

### A/B Testing Opportunities
- Onboarding step order
- Required vs optional fields
- Progress indicator styles
- Completion reward mechanisms
- Skip vs mandatory flows
