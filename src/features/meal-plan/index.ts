
// Main container component
export { default as MealPlanContainer } from './components/MealPlanContainer';

// Core hooks
export {
  useMealPlanState,
  useMealPlanData,
  useMealPlanActions,
  useEnhancedMealPlan,
  useDynamicMealPlan,
  useMealPlanPage,
  useMealPlanCore,
  useEnhancedMealShuffle,
  useAIMealExchange,
  useEnhancedMealRecipe
} from './hooks';

// Core components
export {
  MealPlanHeader,
  MealPlanContent,
  MealPlanViewToggle,
  DayOverview,
  WeeklyMealPlanView,
  EmptyWeekState,
  LoadingState,
  ErrorState
} from './components';

// Types
export type {
  DailyMeal,
  WeeklyMealPlan,
  MealPlanFetchResult,
  MealPlanPreferences,
  MealIngredient
} from './types';
