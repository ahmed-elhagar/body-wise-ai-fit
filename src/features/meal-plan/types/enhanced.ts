
export interface StrictDailyMeal {
  readonly id: string;
  readonly weekly_plan_id: string;
  readonly day_number: number;
  readonly meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  readonly name: string;
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly fiber: number;
  readonly sugar: number;
  readonly prep_time: number;
  readonly cook_time: number;
  readonly servings: number;
  readonly youtube_search_term?: string;
  readonly image_url?: string;
  readonly recipe_fetched: boolean;
  readonly ingredients: ReadonlyArray<{
    readonly name: string;
    readonly quantity: string;
    readonly unit: string;
    readonly category?: string;
  }>;
  readonly instructions: ReadonlyArray<string>;
  readonly alternatives: ReadonlyArray<string>;
}

export interface StrictWeeklyMealPlan {
  readonly id: string;
  readonly user_id: string;
  readonly week_start_date: string;
  readonly total_calories: number;
  readonly total_protein: number;
  readonly total_carbs: number;
  readonly total_fat: number;
  readonly preferences: Record<string, any>;
  readonly created_at: string;
  readonly updated_at: string;
  readonly life_phase_context?: Record<string, any>;
}

export interface StrictMealPlanFetchResult {
  readonly weeklyPlan: StrictWeeklyMealPlan;
  readonly dailyMeals: ReadonlyArray<StrictDailyMeal>;
}

export interface OptimizedQueryParams {
  readonly userId: string;
  readonly weekStartDate: string;
  readonly mealTypes?: ReadonlyArray<string>;
  readonly includeIngredients?: boolean;
  readonly includeInstructions?: boolean;
}

export interface DatabaseQueryResult<T> {
  readonly data: T | null;
  readonly error: Error | null;
  readonly fromCache: boolean;
  readonly queryTime: number;
}
