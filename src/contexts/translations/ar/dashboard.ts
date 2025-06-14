
export const dashboard = {
  // Page title and headers
  title: "لوحة التحكم",
  welcome: "مرحباً بك مرة أخرى",
  overview: "نظرة عامة",
  
  // Stats and metrics
  stats: {
    totalCalories: "إجمالي السعرات",
    caloriesConsumed: "السعرات المستهلكة",
    caloriesRemaining: "السعرات المتبقية",
    calorieGoal: "هدف السعرات",
    proteinIntake: "تناول البروتين",
    carbIntake: "تناول الكربوهيدرات",
    fatIntake: "تناول الدهون",
    waterIntake: "تناول الماء",
    workoutsCompleted: "التمارين المكتملة",
    currentWeight: "الوزن الحالي",
    weightGoal: "هدف الوزن",
    bmi: "مؤشر كتلة الجسم",
    bodyFatPercentage: "نسبة دهون الجسم",
    muscleGain: "اكتساب العضلات",
    weightLoss: "فقدان الوزن",
    weeklyProgress: "التقدم الأسبوعي",
    monthlyProgress: "التقدم الشهري"
  },
  
  // Quick actions
  quickActions: {
    title: "الإجراءات السريعة",
    logMeal: "تسجيل وجبة",
    addSnack: "إضافة وجبة خفيفة", 
    startWorkout: "بدء التمرين",
    logWeight: "تسجيل الوزن",
    viewMealPlan: "عرض خطة الوجبات",
    trackWater: "تتبع الماء",
    setGoal: "تحديد هدف",
    viewProgress: "عرض التقدم"
  },
  
  // Recent activity
  recentActivity: {
    title: "النشاط الأخير",
    noActivity: "لا يوجد نشاط حديث",
    viewAll: "عرض الكل",
    today: "اليوم",
    yesterday: "أمس",
    thisWeek: "هذا الأسبوع"
  },
  
  // Charts and analytics
  analytics: {
    calorieChart: "اتجاهات السعرات",
    weightChart: "تقدم الوزن",
    workoutChart: "تكرار التمارين",
    nutritionBreakdown: "تحليل التغذية",
    weeklyOverview: "نظرة أسبوعية",
    monthlyTrends: "الاتجاهات الشهرية"
  },
  
  // Goals and achievements
  goals: {
    currentGoals: "الأهداف الحالية",
    achievements: "الإنجازات",
    streaks: "المتتاليات",
    milestones: "المعالم",
    weeklyGoal: "الهدف الأسبوعي",
    monthlyGoal: "الهدف الشهري",
    inProgress: "قيد التقدم",
    completed: "مكتمل",
    daysStreak: "يوم متتالي",
    workoutStreak: "متتالية التمارين",
    logginstreak: "متتالية التسجيل"
  },
  
  // Meal plan preview
  mealPlan: {
    todaysMeals: "وجبات اليوم",
    upcomingMeals: "الوجبات القادمة",
    breakfast: "الإفطار",
    lunch: "الغداء", 
    dinner: "العشاء",
    snacks: "الوجبات الخفيفة",
    viewFullPlan: "عرض الخطة الكاملة",
    generateNewPlan: "توليد خطة جديدة"
  },
  
  // Exercise preview
  exercise: {
    todaysWorkout: "تمرين اليوم",
    nextWorkout: "التمرين التالي",
    restDay: "يوم راحة",
    workoutCompleted: "تم إكمال التمرين",
    exercisesRemaining: "تمارين متبقية",
    startWorkout: "بدء التمرين",
    viewExercises: "عرض التمارين"
  },
  
  // Progress indicators
  progress: {
    dailyProgress: "التقدم اليومي",
    weeklyProgress: "التقدم الأسبوعي", 
    caloriesProgress: "تقدم السعرات",
    macrosProgress: "تقدم المغذيات الكبرى",
    workoutProgress: "تقدم التمارين",
    onTrack: "على المسار الصحيح",
    behindGoal: "متأخر عن الهدف",
    exceedingGoal: "يتجاوز الهدف"
  },
  
  // Loading states
  loading: {
    dashboard: "جاري تحميل لوحة التحكم...",
    stats: "جاري تحميل الإحصائيات...",
    activities: "جاري تحميل الأنشطة...",
    charts: "جاري تحميل الرسوم البيانية..."
  },
  
  // Empty states
  empty: {
    noMealPlan: "لم يتم توليد خطة وجبات بعد",
    noWorkouts: "لم يتم جدولة تمارين",
    noProgress: "لا تتوفر بيانات التقدم",
    noGoals: "لم يتم تحديد أهداف"
  }
} as const;
