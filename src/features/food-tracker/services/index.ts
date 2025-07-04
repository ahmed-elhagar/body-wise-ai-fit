
// Food Tracker Services Exports
export { type FoodEntry, type NutritionGoals, type FoodSearchResult } from './foodTrackerApi';

// New Unified Service Layer
export { 
  foodTrackerService, 
  type FoodAnalysisResult,
  type WaterIntakeRecord,
  type FoodTrackerFilters
} from './foodTrackerService';
