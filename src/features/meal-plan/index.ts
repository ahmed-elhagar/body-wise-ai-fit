
// Main exports for meal plan feature
export { default as MealPlanContainer } from './components/MealPlanContainer';

// Feature components
export { 
  MealPlanLoadingBackdrop,
  MealPlanPageTitle,
  MealPlanEmptyState,
  MealPlanErrorState,
  MealPlanLoadingState,
  MealPlanContent,
  MealCard,
  DayOverview,
  EnhancedRecipeDialog,
  MealPlanAILoadingDialog,
  MealExchangeDialog,
  AIGenerationDialog,
  EnhancedAddSnackDialog
} from './components';

// Export types
export type * from './types';

// Export hooks
export * from './hooks';

// Export services
export * from './services';
