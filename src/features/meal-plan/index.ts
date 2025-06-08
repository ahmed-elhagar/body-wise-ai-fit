
// Main components
export { MealPlanContainer } from './components/MealPlanContainer';

// Core hooks
export { useMealPlanData } from './hooks/useMealPlanData';
export { useMealPlanState } from './hooks/useMealPlanState';
export { useMealPlanActions } from './hooks/useMealPlanActions';
export { useMealPlanPage } from './hooks/useMealPlanPage';
export { useMealPlanCore } from './hooks/useMealPlanCore';
export { useMealPlanNavigation } from './hooks/useMealPlanNavigation';
export { useMealPlanCalculations } from './hooks/useMealPlanCalculations';
export { useMealPlanDialogs } from './hooks/useMealPlanDialogs';
export { useOptimizedMealPlanCore } from './hooks/useOptimizedMealPlanCore';

// Components
export { DayOverview } from './components/DayOverview';
export { WeeklyMealPlanView } from './components/WeeklyMealPlanView';
export { MealPlanContent } from './components/MealPlanContent';
export { ViewModeToggle } from './components/ViewModeToggle';
export { MealPlanViewToggle } from './components/MealPlanViewToggle';
export { WeekNavigation } from './components/WeekNavigation';
export { DaySelector } from './components/DaySelector';
export { MealRow } from './components/MealRow';
export { EnhancedMealCard } from './components/EnhancedMealCard';
export { AddMealCard } from './components/AddMealCard';
export { CompactDailyProgress } from './components/CompactDailyProgress';
export { EmptyWeekState } from './components/EmptyWeekState';
export { UnifiedNavigation } from './components/navigation/UnifiedNavigation';

// Services
export { fetchMealPlanData } from './services/mealPlanService';

// Types
export type * from './types';

// Utils
export * from './utils';
