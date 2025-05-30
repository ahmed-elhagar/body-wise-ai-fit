
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
  signInRequired: "Please sign in to access this feature",

  // Food Tracker specific
  "Food Tracker": "Food Tracker",
  "Track your nutrition and maintain healthy eating habits": "Track your nutrition and maintain healthy eating habits",
  "Today": "Today",
  "History": "History",
  "Daily Nutrition": "Daily Nutrition",
  "Today's Food Log": "Today's Food Log",
  "Add Food": "Add Food",
  "No food logged today": "No food logged today",
  "Start tracking your nutrition by adding your first meal!": "Start tracking your nutrition by adding your first meal!",
  "Calories": "Calories",
  "Protein": "Protein",
  "Carbs": "Carbs",
  "Fat": "Fat",
  "cal": "cal",
  "Breakfast": "Breakfast",
  "Lunch": "Lunch",
  "Dinner": "Dinner",
  "Snack": "Snack",
  "AI Scanned": "AI Scanned",
  "Are you sure you want to delete this food log entry?": "Are you sure you want to delete this food log entry?",
  "Nutrition Calendar": "Nutrition Calendar",
  "Meals": "Meals",
  "Search": "Search",
  "Scan": "Scan",
  "Manual": "Manual",
  "Search for food items...": "Search for food items...",
  "Search Results": "Search Results",
  "No food items found": "No food items found",
  "Verified": "Verified",
  "Add to Log": "Add to Log",
  "Adding...": "Adding...",
  "AI Credits": "AI Credits",
  "Unlimited": "Unlimited",
  "Scan Food Image": "Scan Food Image",
  "Upload Image": "Upload Image",
  "Analyzing...": "Analyzing...",
  "No AI credits remaining. Upgrade to Pro for unlimited scans.": "No AI credits remaining. Upgrade to Pro for unlimited scans.",
  "Uploaded Image": "Uploaded Image",
  "Analyzing image...": "Analyzing image...",
  "Detected Food Items": "Detected Food Items",
  "AI Detected": "AI Detected",
  "AI Suggestions": "AI Suggestions",
  "Add Food Manually": "Add Food Manually",
  "Food Name": "Food Name",
  "Brand": "Brand",
  "optional": "optional",
  "Enter food name...": "Enter food name...",
  "Enter brand name...": "Enter brand name...",
  "Category": "Category",
  "general": "General",
  "protein": "Protein",
  "vegetables": "Vegetables",
  "fruits": "Fruits",
  "grains": "Grains",
  "dairy": "Dairy",
  "nuts": "Nuts",
  "beverages": "Beverages",
  "snacks": "Snacks",
  "Calories per 100g": "Calories per 100g",
  "Protein per 100g": "Protein per 100g",
  "Carbs per 100g": "Carbs per 100g",
  "Fat per 100g": "Fat per 100g",
  "Nutrition Preview": "Nutrition Preview",
  "Please fill in food name and calories": "Please fill in food name and calories",
  "Quantity": "Quantity",
  "grams": "grams",
  "Meal Type": "Meal Type",
  "Notes": "Notes",
  "Add any notes about this food...": "Add any notes about this food...",
  "Less": "Less",
  "More": "More",
  "days with logged food this month": "days with logged food this month"
};
