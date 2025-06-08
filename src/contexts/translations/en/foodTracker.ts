
export const foodTracker = {
  // Main Navigation
  tabs: {
    today: "Today",
    history: "History",
    search: "Search Food"
  },
  
  // Today Tab
  today: {
    title: "Today's Nutrition",
    subtitle: "Track your daily intake",
    noMeals: "No meals logged today",
    addFirstMeal: "Add your first meal",
    totalCalories: "Total Calories",
    targetCalories: "Target",
    remaining: "Remaining",
    over: "Over target",
    macros: {
      protein: "Protein",
      carbs: "Carbs", 
      fat: "Fat",
      fiber: "Fiber"
    }
  },
  
  // History Tab
  history: {
    title: "Nutrition History",
    subtitle: "View your past nutrition data",
    noHistory: "No nutrition history yet",
    startTracking: "Start tracking to see your progress",
    dailyAverage: "Daily Average",
    weeklyTrend: "Weekly Trend",
    export: "Export Data",
    filter: {
      title: "Filter by Date",
      thisWeek: "This Week",
      lastWeek: "Last Week", 
      thisMonth: "This Month",
      custom: "Custom Range"
    }
  },
  
  // Add Food Dialog
  addFood: {
    title: "Add Food",
    searchPlaceholder: "Search for food...",
    noResults: "No food items found",
    tryDifferent: "Try a different search term",
    quantity: "Quantity",
    unit: "Unit",
    add: "Add Food",
    adding: "Adding...",
    tabs: {
      search: "Search",
      scan: "Scan Barcode",
      manual: "Manual Entry"
    }
  },
  
  // Manual Entry
  manual: {
    title: "Manual Food Entry",
    foodName: "Food Name",
    brand: "Brand (optional)",
    servingSize: "Serving Size",
    calories: "Calories",
    protein: "Protein (g)",
    carbs: "Carbohydrates (g)",
    fat: "Fat (g)",
    fiber: "Fiber (g)",
    sugar: "Sugar (g)",
    sodium: "Sodium (mg)",
    save: "Save Food Item",
    saving: "Saving..."
  },
  
  // Barcode Scanner
  scanner: {
    title: "Scan Barcode",
    instruction: "Point your camera at the barcode",
    scanning: "Scanning...",
    notFound: "Product not found",
    tryManual: "Try manual entry instead",
    permission: "Camera permission required",
    enable: "Enable Camera"
  },
  
  // Food Item Card
  foodItem: {
    per100g: "per 100g",
    perServing: "per serving",
    edit: "Edit",
    delete: "Delete",
    duplicate: "Duplicate",
    addToMeal: "Add to Meal",
    nutrition: "Nutrition Facts"
  },
  
  // Meal Types
  mealTypes: {
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner",
    snacks: "Snacks",
    other: "Other"
  },
  
  // Quick Add
  quickAdd: {
    title: "Quick Add",
    recentFoods: "Recent Foods",
    favoritesFoods: "Favorite Foods",
    commonFoods: "Common Foods"
  },
  
  // Photo Analysis
  photoAnalysis: {
    title: "Photo Analysis",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    analyzing: "Analyzing photo...",
    results: "Analysis Results",
    confidence: "Confidence",
    addDetected: "Add Detected Items"
  },
  
  // Nutrition Goals
  goals: {
    title: "Nutrition Goals",
    setGoals: "Set Goals",
    calories: "Daily Calories",
    protein: "Protein Goal",
    carbs: "Carbs Goal", 
    fat: "Fat Goal",
    fiber: "Fiber Goal",
    save: "Save Goals",
    reset: "Reset to Defaults"
  },
  
  // Messages
  messages: {
    foodAdded: "Food added successfully",
    foodDeleted: "Food removed",
    goalsSaved: "Goals updated successfully",
    photoUploaded: "Photo uploaded successfully",
    analysisComplete: "Photo analysis complete",
    error: "Something went wrong",
    networkError: "Network error. Please try again."
  }
} as const;
