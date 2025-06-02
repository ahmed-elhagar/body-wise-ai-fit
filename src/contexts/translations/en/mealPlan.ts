
export const mealPlan = {
  // Core functionality
  title: "Meal Plan",
  generateAIMealPlan: "Generate AI Meal Plan",
  generateMealPlan: "Generate Meal Plan",
  generateNewPlan: "Generate New Plan",
  generateAI: "Generate AI",
  regenerate: "Regenerate",
  shuffleMeals: "Shuffle Meals",
  viewRecipe: "View Recipe",
  exchangeMeal: "Exchange Meal",
  addSnack: "Add Snack",
  
  // Navigation & Time
  currentWeek: "Current Week",
  futureWeek: "Future Week",
  dailyOverview: "Daily Overview",
  weeklyView: "Weekly View",
  dailyView: "Daily View",
  selectDay: "Select Day",
  today: "Today",
  
  // Nutrition & Stats
  totalCalories: "Total Calories",
  totalProtein: "Total Protein",
  weeklyCalories: "Weekly Calories",
  weeklyProtein: "Weekly Protein",
  cal: "cal",
  calories: "calories", 
  protein: "protein",
  carbs: "carbs",
  fat: "fat",
  calPerDay: "cal/day",
  
  // UI Elements
  items: "items",
  item: "item", 
  meals: "meals",
  servings: "servings",
  minutes: "minutes",
  of: "of",
  target: "target",
  recipe: "Recipe",
  exchange: "Exchange",
  shoppingList: "Shopping List",
  
  // States & Messages
  noMealPlan: "No Meal Plan Found",
  generateFirstPlan: "Generate your personalized weekly meal plan with AI",
  noMealsPlanned: "No meals planned",
  personalizedPlan: "Personalized Plan",
  aiPowered: "AI Powered",
  aiPoweredNutrition: "AI Powered Nutrition",
  smartMealPlanning: "Smart Meal Planning",
  personalizedNutrition: "Get personalized nutrition plans tailored to your goals",
  loading: "Loading...",
  loadingDescription: "Please wait while we fetch your personalized meal plan...",
  generating: "Generating...",
  
  // Error handling
  errorLoadingMealPlan: "Error Loading Meal Plan",
  somethingWentWrong: "Something went wrong",
  tryAgain: "Try Again",
  goToDashboard: "Go to Dashboard",
  authenticationRequired: "Authentication Required",
  pleaseSignIn: "Please sign in to continue",
  signIn: "Sign In",
  
  // Success/Error Messages
  snackAddedSuccess: "Snack added successfully!",
  shoppingListUpdated: "Shopping list updated!",
  planGeneratedSuccess: "Meal plan generated successfully!",
  planGenerationFailed: "Failed to generate meal plan",
  
  // Stats
  dailyProgress: "Daily Progress",
  calorieProgress: "Calorie Progress",
  consumed: "Consumed",
  mealsToday: "Meals Today",
  complete: "Complete",
  
  // Meal Types
  breakfast: "Breakfast",
  lunch: "Lunch", 
  dinner: "Dinner",
  snack: "Snack",
  snack1: "Morning Snack",
  snack2: "Evening Snack",
  
  // Meal types object
  mealTypes: {
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner",
    snack: "Snack"
  },
  
  // Credits
  aiCredits: "AI Credits",
  
  // Cuisine Types
  cuisine: "Cuisine",
  mixed: "Mixed",
  mediterranean: "Mediterranean",
  asian: "Asian",
  mexican: "Mexican",
  italian: "Italian",
  indian: "Indian",
  middleEastern: "Middle Eastern",
  american: "American",
  french: "French",
  chinese: "Chinese",
  japanese: "Japanese",
  korean: "Korean",
  thai: "Thai",
  
  // Preferences & Settings
  maxPrepTime: "Max Prep Time",
  includeSnacks: "Include Snacks",
  generateSevenDayPlan: "Generate 7-Day Plan",
  leaveEmptyNationality: "Leave empty for mixed cuisine",
  
  // Days of the week (lowercase for consistency)
  monday: "Monday",
  tuesday: "Tuesday", 
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  
  // Day names with numbers
  dayNames: {
    1: "Saturday",
    2: "Sunday",
    3: "Monday",
    4: "Tuesday",
    5: "Wednesday",
    6: "Thursday",
    7: "Friday"
  },
  
  // Additional terms
  description: "Description",
  dayOverview: "Day Overview",
  
  // Add Snack specific translations
  addSnackDialog: {
    title: "Add Healthy Snack",
    subtitle: "Perfect snack for your remaining calories",
    generateSnack: "Generate AI Snack",
    perfectFit: "Perfect fit for your remaining calories",
    caloriesAvailable: "calories available",
    generatingAISnack: "Generating AI Snack",
    generateAISnack: "Generate AI Snack",
    cancel: "Cancel",
    targetReached: "Daily target reached!",
    targetReachedDesc: "You've reached your calorie goal for today. Great job!",
    close: "Close",
    analyzing: "Analyzing your nutrition needs...",
    creating: "Creating perfect snack...",
    saving: "Saving to your meal plan...",
    pleaseWait: "Please wait while we create the perfect snack for you...",
    error: "Error generating snack",
    failed: "Failed to generate snack",
    notEnoughCalories: "Not enough calories remaining for a snack"
  },
  
  // Common actions
  calAvailable: "cal available",
  targetReached: "Daily calorie target reached!",
  excellentProgress: "Excellent progress! You've reached your daily nutrition goals.",
  perfectDay: "Perfect Day",
  considerLightSnack: "Consider a light snack or some water to complete your day.",
  close: "Close",
  cancel: "Cancel"
} as const;
