
import { commonTranslations } from './en/common';
import { navigationTranslations } from './en/navigation';
import { dashboardTranslations } from './en/dashboard';
import { exercise } from './en/exercise';
import { mealPlanTranslations } from './en/mealPlan';
import { lifePhase } from './en/lifePhase';
import { profile } from './en/profile';

export const enTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...dashboardTranslations,
  exercise: exercise,
  mealPlan: mealPlanTranslations,
  profile: profile,
  
  // Navigation items
  navigation: {
    appName: "FitFatta",
    menu: "Menu",
    dashboard: "Dashboard",
    mealPlan: "Meal Plan",
    exercise: "Exercise",
    progress: "Progress", 
    profile: "Profile",
    account: "Account",
    settings: "Settings",
    signOut: "Sign Out"
  },
  
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
