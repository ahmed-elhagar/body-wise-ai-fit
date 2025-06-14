
// Main meal plan components
export { default as MealPlanContainer } from './MealPlanContainer';
export { default as MealPlanHeader } from './MealPlanHeader';
export { MealPlanContent } from './MealPlanContent';
export { MealPlanViewToggle } from './MealPlanViewToggle';

// Core view components
export { default as DayOverview } from './DayOverview';
export { WeeklyMealPlanView } from './WeeklyMealPlanView';
export { EmptyWeekState } from './EmptyWeekState';

// State components
export { default as LoadingState } from './LoadingState';
export { default as ErrorState } from './ErrorState';

// Dialog components
export { EnhancedRecipeDialog } from './EnhancedRecipeDialog';
export { MealPlanAILoadingDialog } from './dialogs/MealPlanAILoadingDialog';
export { MealExchangeDialog } from './dialogs/MealExchangeDialog';
export { AIGenerationDialog } from './dialogs/AIGenerationDialog';
export { default as EnhancedAddSnackDialog } from './dialogs/EnhancedAddSnackDialog';

// Legacy exports for backward compatibility
export { default as MealPlanLoadingBackdrop } from './MealPlanHeader'; // Deprecated
export { default as MealPlanPageTitle } from './MealPlanHeader'; // Deprecated
export { default as MealPlanEmptyState } from './EmptyWeekState'; // Deprecated
export { default as MealCard } from './DayOverview'; // Deprecated
export { EnhancedMealCard } from './DayOverview'; // Deprecated
export { MealRow } from './DayOverview'; // Deprecated
export { AddMealCard } from './DayOverview'; // Deprecated
export { CompactDailyProgress } from './DayOverview'; // Deprecated
export { default as MealPlanLoadingState } from './LoadingState'; // Deprecated
export { default as MealPlanErrorState } from './ErrorState'; // Deprecated
export { DaySelector } from './MealPlanViewToggle'; // Deprecated
export { WeekNavigation } from './MealPlanViewToggle'; // Deprecated
export { ViewModeToggle } from './MealPlanViewToggle'; // Deprecated
