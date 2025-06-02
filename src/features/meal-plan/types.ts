
export interface MealPlanPreferences {
  duration?: string;
  cuisine?: string;
  maxPrepTime?: string;
  includeSnacks?: boolean;
  mealTypes?: string;
  language?: string;
  weekOffset?: number;
}

export interface NutritionContext {
  fastingType?: string;
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  extraCalories: number;
  needsHydrationReminders: boolean;
  isRamadan: boolean;
  isMuslimFasting: boolean;
  fastingStartDate?: string;
  fastingEndDate?: string;
}
