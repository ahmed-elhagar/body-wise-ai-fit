
# FitFatta Feature Map

## Core Features Overview

### 1. Authentication & User Management
**Files:**
- `src/hooks/useAuth.ts` - Main authentication hook
- `src/hooks/useProfile.ts` - User profile management
- `src/components/ProtectedRoute.tsx` - Route protection

**Edge Functions:**
- `handle_new_user()` - Database function for user creation

**Key Functionality:**
- Email/password authentication
- Profile completion scoring
- Role-based access (normal, coach, admin)

### 2. Meal Plan Management
**Core Components:**
- `src/features/meal-plan/components/MealPlanContainer.tsx`
- `src/features/meal-plan/components/CleanMealCard.tsx`
- `src/components/meal-plan/MealCard.tsx`

**Hooks:**
- `src/hooks/useMealPlanState.ts` - Complete meal plan state management
- `src/hooks/useMealPlanData.ts` - Data fetching and caching
- `src/hooks/useMealPlanActions.ts` - AI generation actions
- `src/hooks/useEnhancedMealPlan.ts` - AI meal plan generation
- `src/hooks/useMealExchange.ts` - Meal exchange functionality

**Edge Functions:**
- `supabase/functions/generate-meal-plan/` - AI meal plan generation
- `supabase/functions/generate-meal-alternatives/` - Meal exchange options

**Database Tables:**
- `weekly_meal_plans` - Weekly meal plan containers
- `daily_meals` - Individual meal entries
- `meal_ingredients` - Ingredient lists
- `food_items` - Unified food database

### 3. Exercise Management
**Core Components:**
- `src/features/exercise/components/ExerciseListEnhanced.tsx`
- `src/features/exercise/components/InteractiveExerciseCard.tsx`
- `src/features/exercise/components/AnimatedProgressRing.tsx`
- `src/components/exercise/CompactProgressSidebar.tsx`

**Hooks:**
- `src/hooks/useOptimizedExercise.ts` - Exercise program management
- `src/hooks/useExerciseProgress.ts` - Progress tracking

**Edge Functions:**
- `supabase/functions/exchange-exercise/` - Exercise exchange with AI
- `supabase/functions/generate-exercise-program/` - AI program generation

**Database Tables:**
- `weekly_exercise_programs` - Exercise program containers
- `daily_workouts` - Daily workout sessions
- `exercises` - Individual exercise entries

### 4. AI Credit System
**Files:**
- `src/hooks/useCentralizedCredits.ts` - Credit management
- `src/hooks/useCreditSystem.ts` - Credit validation

**Database Functions:**
- `check_and_use_ai_generation()` - Credit validation and usage
- `complete_ai_generation()` - Generation completion logging

**Database Tables:**
- `ai_generation_logs` - AI usage tracking
- `profiles.ai_generations_remaining` - User credit balance

### 5. Life Phase Support
**Files:**
- `src/hooks/useLifePhaseProfile.ts` - Life phase management
- `src/hooks/useLifePhaseNutrition.ts` - Nutrition context
- `src/components/meal-plan/LifePhaseRibbon.tsx` - UI component

**Edge Function Support:**
- `supabase/functions/generate-meal-plan/lifePhaseProcessor.ts` - AI prompt enhancement

**Supported Conditions:**
- Pregnancy (trimesters with calorie adjustments)
- Breastfeeding (exclusive/partial)
- Islamic fasting (Ramadan/general)

### 6. Food Database & Analysis
**Files:**
- `src/components/FoodDatabaseSearch.tsx` - Food search interface
- `src/services/foodDatabaseService.ts` - Food data operations

**Edge Functions:**
- `supabase/functions/analyze-food-image/` - AI food image analysis

**Database Tables:**
- `food_items` - Unified food database with nutrition facts
- `food_database` - Legacy food entries

### 7. Real-time Features
**Components:**
- `src/components/RecentActivity.tsx` - Activity feed
- Typing indicators for chat features

**Database Tables:**
- `typing_indicators` - Real-time typing status
- `user_notifications` - In-app notifications

### 8. Admin Features
**Components:**
- `src/components/admin/` - Admin dashboard components
- User role management
- AI model configuration

**Database Tables:**
- `ai_models` - AI model configurations
- `ai_feature_models` - Feature-specific model assignments

### 9. Internationalization
**Files:**
- `src/contexts/LanguageContext.tsx` - Language context
- `src/hooks/useLanguage.ts` - Language hook
- `public/locales/` - Translation files (en, ar)

**Features:**
- English/Arabic support
- RTL layout support
- AI-generated content in user language

### 10. Navigation & Routing
**Files:**
- `src/components/AppSidebar.tsx` - Main navigation
- `src/components/LazyPages.tsx` - Route definitions
- `src/components/Layout.tsx` - App layout wrapper

**Routes:**
- `/` - Dashboard
- `/meal-plan` - Meal planning
- `/exercise` - Exercise programs
- `/profile` - User profile
- `/admin` - Admin panel
