
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

// Legacy exports for backward compatibility - these are deprecated
export { EmptyWeekState as MealPlanEmptyState };
export { DayOverview as MealCard };
export { LoadingState as MealPlanLoadingState };
export { ErrorState as MealPlanErrorState };
export { MealPlanViewToggle as ViewModeToggle };
