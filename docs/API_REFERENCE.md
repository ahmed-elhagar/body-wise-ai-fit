
# FitFatta API Reference

## Core Hooks

### Authentication
- `useAuth()` - User authentication and session management
- `useProfile()` - User profile data and updates

### Meal Planning
- `useMealPlanState()` - Complete meal plan management
- `useEnhancedMealPlan()` - AI meal plan generation
- `useMealPlanData()` - Optimized data fetching

### Exercise
- `useOptimizedExercise()` - Exercise program management
- `useExerciseProgramData()` - Exercise data fetching

### Internationalization
- `useI18n()` - Translation and RTL support

### Admin
- `useAdmin()` - Admin panel functionality
- `useCentralizedCredits()` - AI credit management

## Key Components

### Layout
- `Layout` - Main app layout with sidebar
- `AppSidebar` - Navigation sidebar
- `LanguageToggle` - Language switching

### Meal Planning
- `MealPlanPage` - Main meal planning interface
- `MealCard` - Individual meal display
- `MealPlanAIDialog` - AI generation interface

### Exercise
- `ExercisePage` - Exercise program interface
- `ExerciseCard` - Exercise display
- `WorkoutSession` - Active workout tracking

### Profile
- `ProfilePage` - User profile management
- `OnboardingFlow` - New user setup

## Translation Keys

### Common
- `common:save`, `common:cancel`, `common:loading`
- `common:error`, `common:success`

### Navigation
- `navigation:dashboard`, `navigation:mealPlan`
- `navigation:exercise`, `navigation:profile`

### Dashboard
- `dashboard:title`, `dashboard:welcome`
- `dashboard:stats.*` - Statistics labels

### Meal Plan
- `mealPlan:title`, `mealPlan:generateAIMealPlan`
- `mealPlan:mealTypes.*` - Meal type labels

See `docs/LOCALIZATION_GUIDE.md` for complete translation structure.
