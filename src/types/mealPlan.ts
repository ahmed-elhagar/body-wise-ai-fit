
// Re-export from features to maintain consistency
export type { 
  MealIngredient, 
  DailyMeal, 
  WeeklyMealPlan, 
  MealPlanFetchResult, 
  MealPlanPreferences,
  AddSnackDialogProps
} from '@/features/meal-plan/types';

// Add ViewMode type definition
export type ViewMode = 'daily' | 'weekly';

// Legacy interface for backward compatibility
export interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}
