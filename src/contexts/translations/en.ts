
import { commonTranslations } from './en/common';
import { navigationTranslations } from './en/navigation';
import { dashboardTranslations } from './en/dashboard';
import { exerciseTranslations } from './en/exercise';
import { mealPlan } from './en/mealPlan';

export const enTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...dashboardTranslations,
  ...exerciseTranslations,
  mealPlan: mealPlan,
  
  // Days of week
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday", 
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  
  // Diet types
  balanced: "Balanced",
  vegetarian: "Vegetarian",
  keto: "Keto",
  highProtein: "High Protein",
};
