
// Food Tracker feature exports
export type * from './types';
export * from './components';
export * from './hooks';
export * from './services';
export * from './utils';

// Main entry point for food tracker feature
export { default as FoodTrackerPage } from './components/FoodTrackerContainer';

// Rename the nutrition summary to avoid conflicts
export type { FoodTrackerNutritionSummary as NutritionSummary } from './types';
