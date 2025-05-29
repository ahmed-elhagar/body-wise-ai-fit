
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
  
  // Days of week (global level for reuse)
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday", 
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  
  // Diet types (global level for reuse)
  balanced: "Balanced",
  vegetarian: "Vegetarian",
  keto: "Keto",
  highProtein: "High Protein",
  
  // Global common terms
  minutes: "minutes",
  cuisine: "Cuisine",
  mixed: "Mixed",
  all: "All",
  cancel: "Cancel",
  apply: "Apply",
  reset: "Reset",
  generating: "Generating...",
  
  // Auth related
  authRequired: "Please sign in to continue",
  signInRequired: "Please sign in to access this feature"
};
