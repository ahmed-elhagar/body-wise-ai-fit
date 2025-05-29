
import { ChefHat, Brain, Target, Calendar, Utensils } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: number;
}

export const getGenerationSteps = (t: (key: string) => string): Step[] => [
  {
    icon: Brain,
    title: t('mealPlan.analyzingProfile'),
    description: t('mealPlan.analyzingProfileDesc'),
    duration: 2000
  },
  {
    icon: Target,
    title: t('mealPlan.calculatingNutrition'),
    description: t('mealPlan.calculatingNutritionDesc'),
    duration: 2500
  },
  {
    icon: ChefHat,
    title: t('mealPlan.selectingMeals'),
    description: t('mealPlan.selectingMealsDesc'),
    duration: 3000
  },
  {
    icon: Calendar,
    title: t('mealPlan.creatingWeeklyPlan'),
    description: t('mealPlan.creatingWeeklyPlanDesc'),
    duration: 2000
  },
  {
    icon: Utensils,
    title: t('mealPlan.finalizingMealPlan'),
    description: t('mealPlan.finalizingMealPlanDesc'),
    duration: 1500
  }
];

export const getShuffleSteps = (t: (key: string) => string): Step[] => [
  {
    icon: Target,
    title: t('mealPlan.analyzingCurrentPlan'),
    description: t('mealPlan.analyzingCurrentPlanDesc'),
    duration: 1500
  },
  {
    icon: ChefHat,
    title: t('mealPlan.selectingAlternatives'),
    description: t('mealPlan.selectingAlternativesDesc'),
    duration: 2000
  },
  {
    icon: Calendar,
    title: t('mealPlan.reorganizingWeek'),
    description: t('mealPlan.reorganizingWeekDesc'),
    duration: 1500
  }
];
