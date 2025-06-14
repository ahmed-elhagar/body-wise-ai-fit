
// Export the main container component for external use
export { default as MealPlanContainer } from './components/MealPlanContainer';

// Export individual components for internal use within the feature
export { default as MealPlanHeader } from './components/MealPlanHeader';
export { default as MealPlanNavigation } from './components/MealPlanNavigation';
export { default as MealPlanLoadingOverlay } from './components/MealPlanLoadingOverlay';

// Export existing components
export { MealPlanContent } from './components/MealPlanContent';
export { MealPlanViewToggle } from './components/MealPlanViewToggle';
export { ModernShoppingListDrawer } from './components/dialogs/ModernShoppingListDrawer';
export { MealExchangeDialog } from './components/dialogs/MealExchangeDialog';
export { AIGenerationDialog } from './components/dialogs/AIGenerationDialog';
export { EnhancedRecipeDialog } from './components/EnhancedRecipeDialog';

// Export types
export type * from './types';

// Export hooks
export { useMealPlanState } from './hooks/useMealPlanState';
