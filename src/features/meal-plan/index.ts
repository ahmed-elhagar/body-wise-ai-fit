
// Main exports for meal plan feature
export { MealPlanContainer } from './components/MealPlanContainer';
export { default as MealPlanPage } from './components/MealPlanPage';

// Export types
export type * from './types';

// Export hooks - ensure we import from the correct location
export { useMealPlanCore } from './hooks/useMealPlanCore';
export { useMealPlanNavigation } from './hooks/useMealPlanNavigation';
export { useMealPlanCalculations } from './hooks/useMealPlanCalculations';
export { useMealPlanDialogs } from './hooks/useMealPlanDialogs';
