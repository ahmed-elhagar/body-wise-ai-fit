import { LucideIcon } from "lucide-react";
import { BookOpen, ChefHat, Shuffle, Utensils } from "lucide-react";
import { LanguageContextType } from "@/contexts/LanguageContext";

export interface LoadingStep {
  id: string;
  text: string;
  icon: LucideIcon;
  duration: number;
}

export const getGenerationSteps = (t: LanguageContextType['t']): LoadingStep[] => [
  {
    id: "analyzingProfile",
    text: t('mealPlan.loading.analyzingProfile'),
    icon: BookOpen,
    duration: 2000,
  },
  {
    id: "selectingMeals",
    text: t('mealPlan.loading.selectingMeals'),
    icon: Utensils,
    duration: 3000,
  },
  {
    id: "finalizingPlan",
    text: t('mealPlan.loading.finalizingPlan'),
    icon: ChefHat,
    duration: 2500,
  },
];

export const getShuffleSteps = (t: LanguageContextType['t']): LoadingStep[] => [
  {
    id: "shufflingMeals",
    text: t('mealPlan.loading.shufflingMeals'),
    icon: Shuffle,
    duration: 2000,
  },
  {
    id: "adjustingNutrition",
    text: t('mealPlan.loading.adjustingNutrition'),
    icon: Utensils,
    duration: 3000,
  },
  {
    id: "finalizingShuffle",
    text: t('mealPlan.loading.finalizingShuffle'),
    icon: ChefHat,
    duration: 2500,
  },
];
