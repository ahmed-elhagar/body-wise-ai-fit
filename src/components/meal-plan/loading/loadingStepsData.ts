
import { LucideIcon } from "lucide-react";
import { BookOpen, ChefHat, Shuffle, Utensils } from "lucide-react";

export interface LoadingStep {
  id: string;
  text: string;
  icon: LucideIcon;
  duration: number;
  title: string;
  description: string;
}

export const getGenerationSteps = (t: any): LoadingStep[] => [
  {
    id: "analyzingProfile",
    text: t('mealPlan.loading.analyzingProfile') || 'Analyzing your profile...',
    title: 'Profile Analysis',
    description: 'Understanding your preferences and dietary needs',
    icon: BookOpen,
    duration: 2000,
  },
  {
    id: "selectingMeals",
    text: t('mealPlan.loading.selectingMeals') || 'Selecting perfect meals...',
    title: 'Meal Selection',
    description: 'Choosing meals that match your goals',
    icon: Utensils,
    duration: 3000,
  },
  {
    id: "finalizingPlan",
    text: t('mealPlan.loading.finalizingPlan') || 'Finalizing your plan...',
    title: 'Plan Finalization',
    description: 'Creating your personalized meal plan',
    icon: ChefHat,
    duration: 2500,
  },
];

export const getShuffleSteps = (t: any): LoadingStep[] => [
  {
    id: "shufflingMeals",
    text: t('mealPlan.loading.shufflingMeals') || 'Shuffling meals...',
    title: 'Meal Shuffling',
    description: 'Finding new meal combinations',
    icon: Shuffle,
    duration: 2000,
  },
  {
    id: "adjustingNutrition",
    text: t('mealPlan.loading.adjustingNutrition') || 'Adjusting nutrition...',
    title: 'Nutrition Adjustment',
    description: 'Balancing nutritional values',
    icon: Utensils,
    duration: 3000,
  },
  {
    id: "finalizingShuffle",
    text: t('mealPlan.loading.finalizingShuffle') || 'Finalizing shuffle...',
    title: 'Shuffle Finalization',
    description: 'Completing your new meal arrangement',
    icon: ChefHat,
    duration: 2500,
  },
];
