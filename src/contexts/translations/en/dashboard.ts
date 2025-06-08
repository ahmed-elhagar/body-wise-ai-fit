
export const dashboard = {
  // Page title and headers
  title: "Dashboard",
  welcome: "Welcome back",
  overview: "Overview",
  
  // Stats and metrics
  stats: {
    totalCalories: "Total Calories",
    caloriesConsumed: "Calories Consumed",
    caloriesRemaining: "Calories Remaining",
    calorieGoal: "Calorie Goal",
    proteinIntake: "Protein Intake",
    carbIntake: "Carb Intake",
    fatIntake: "Fat Intake",
    waterIntake: "Water Intake",
    workoutsCompleted: "Workouts Completed",
    currentWeight: "Current Weight",
    weightGoal: "Weight Goal",
    bmi: "BMI",
    bodyFatPercentage: "Body Fat %",
    muscleGain: "Muscle Gain",
    weightLoss: "Weight Loss",
    weeklyProgress: "Weekly Progress",
    monthlyProgress: "Monthly Progress"
  },
  
  // Quick actions
  quickActions: {
    title: "Quick Actions",
    logMeal: "Log Meal",
    addSnack: "Add Snack", 
    startWorkout: "Start Workout",
    logWeight: "Log Weight",
    viewMealPlan: "View Meal Plan",
    trackWater: "Track Water",
    setGoal: "Set Goal",
    viewProgress: "View Progress"
  },
  
  // Recent activity
  recentActivity: {
    title: "Recent Activity",
    noActivity: "No recent activity",
    viewAll: "View All",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week"
  },
  
  // Charts and analytics
  analytics: {
    calorieChart: "Calorie Trends",
    weightChart: "Weight Progress",
    workoutChart: "Workout Frequency",
    nutritionBreakdown: "Nutrition Breakdown",
    weeklyOverview: "Weekly Overview",
    monthlyTrends: "Monthly Trends"
  },
  
  // Goals and achievements
  goals: {
    currentGoals: "Current Goals",
    achievements: "Achievements",
    streaks: "Streaks",
    milestones: "Milestones",
    weeklyGoal: "Weekly Goal",
    monthlyGoal: "Monthly Goal",
    inProgress: "In Progress",
    completed: "Completed",
    daysStreak: "day streak",
    workoutStreak: "Workout Streak",
    logginstreak: "Logging Streak"
  },
  
  // Meal plan preview
  mealPlan: {
    todaysMeals: "Today's Meals",
    upcomingMeals: "Upcoming Meals",
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner",
    snacks: "Snacks",
    viewFullPlan: "View Full Plan",
    generateNewPlan: "Generate New Plan"
  },
  
  // Exercise preview
  exercise: {
    todaysWorkout: "Today's Workout",
    nextWorkout: "Next Workout",
    restDay: "Rest Day",
    workoutCompleted: "Workout Completed",
    exercisesRemaining: "exercises remaining",
    startWorkout: "Start Workout",
    viewExercises: "View Exercises"
  },
  
  // Progress indicators
  progress: {
    dailyProgress: "Daily Progress",
    weeklyProgress: "Weekly Progress", 
    caloriesProgress: "Calories Progress",
    macrosProgress: "Macros Progress",
    workoutProgress: "Workout Progress",
    onTrack: "On Track",
    behindGoal: "Behind Goal",
    exceedingGoal: "Exceeding Goal"
  },
  
  // Loading states
  loading: {
    dashboard: "Loading dashboard...",
    stats: "Loading stats...",
    activities: "Loading activities...",
    charts: "Loading charts..."
  },
  
  // Empty states
  empty: {
    noMealPlan: "No meal plan generated yet",
    noWorkouts: "No workouts scheduled",
    noProgress: "No progress data available",
    noGoals: "No goals set"
  }
} as const;
