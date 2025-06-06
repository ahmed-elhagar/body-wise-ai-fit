
export const mealPlan = {
  // Core functionality
  title: "خطة الوجبات",
  generateAIMealPlan: "إنشاء خطة وجبات بالذكاء الاصطناعي",
  generateMealPlan: "إنشاء خطة وجبات",
  generateNewPlan: "إنشاء خطة جديدة",
  regenerate: "إعادة إنتاج",
  shuffleMeals: "خلط الوجبات",
  viewRecipe: "عرض الوصفة",
  exchangeMeal: "استبدال الوجبة",
  addSnack: "إضافة وجبة خفيفة",
  
  // Navigation & Time
  currentWeek: "الأسبوع الحالي",
  futureWeek: "الأسبوع القادم",
  dailyOverview: "نظرة عامة يومية",
  weeklyView: "العرض الأسبوعي",
  dailyView: "العرض اليومي",
  selectDay: "اختر اليوم",
  today: "اليوم",
  
  // Nutrition & Stats
  totalCalories: "إجمالي السعرات",
  totalProtein: "إجمالي البروتين",
  weeklyCalories: "السعرات الأسبوعية",
  weeklyProtein: "البروتين الأسبوعي",
  cal: "سعرة",
  calories: "سعرات حرارية",
  protein: "بروتين",
  carbs: "كربوهيدرات",
  fat: "دهون",
  calPerDay: "سعرة/يوم",
  
  // UI Elements
  items: "عناصر",
  item: "عنصر",
  meals: "وجبات",
  servings: "حصص",
  minutes: "دقائق",
  of: "من",
  target: "الهدف",
  recipe: "الوصفة",
  exchange: "استبدال",
  shoppingList: "قائمة التسوق",
  
  // States & Messages
  noMealPlan: "لم يتم العثور على خطة وجبات",
  generateFirstPlan: "أنشئ خطة وجباتك الأسبوعية المخصصة بالذكاء الاصطناعي",
  noMealsPlanned: "لا توجد وجبات مخططة",
  personalizedPlan: "خطة مخصصة",
  aiPowered: "مدعوم بالذكاء الاصطناعي",
  aiPoweredNutrition: "تغذية مدعومة بالذكاء الاصطناعي",
  smartMealPlanning: "تخطيط وجبات ذكي",
  personalizedNutrition: "احصل على خطط تغذية مخصصة تناسب أهدافك",
  loading: "جارٍ التحميل...",
  generating: "جارٍ الإنشاء...",
  
  // Success/Error Messages
  snackAddedSuccess: "تم إضافة الوجبة الخفيفة بنجاح!",
  shoppingListUpdated: "تم تحديث قائمة التسوق!",
  planGeneratedSuccess: "تم إنشاء خطة الوجبات بنجاح!",
  planGenerationFailed: "فشل في إنشاء خطة الوجبات",
  
  // Stats
  dailyProgress: "التقدم اليومي",
  calorieProgress: "تقدم السعرات",
  consumed: "مستهلك",
  mealsToday: "وجبات اليوم",
  complete: "مكتمل",
  
  // Meal Types
  breakfast: "الإفطار",
  lunch: "الغداء",
  dinner: "العشاء", 
  snack: "وجبة خفيفة",
  snack1: "وجبة خفيفة صباحية",
  snack2: "وجبة خفيفة مسائية",
  
  // Credits
  aiCredits: "رصيد الذكاء الاصطناعي",
  
  // Cuisine Types
  cuisine: "المطبخ",
  mixed: "مختلط",
  mediterranean: "متوسطي",
  asian: "آسيوي",
  mexican: "مكسيكي",
  italian: "إيطالي",
  indian: "هندي",
  middleEastern: "شرق أوسطي",
  american: "أمريكي",
  french: "فرنسي",
  chinese: "صيني",
  japanese: "ياباني",
  korean: "كوري",
  thai: "تايلندي",
  
  // Preferences & Settings
  maxPrepTime: "الحد الأقصى لوقت التحضير",
  mealTypes: "أنواع الوجبات",
  includeSnacks: "تضمين الوجبات الخفيفة",
  generateSevenDayPlan: "إنشاء خطة 7 أيام",
  leaveEmptyNationality: "اتركه فارغاً للمطبخ المختلط",
  
  // Days of the week (lowercase for consistency)
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء", 
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
  sunday: "الأحد",
  
  // Additional terms
  description: "الوصف",
  dayOverview: "نظرة عامة على اليوم",
  
  // Add Snack specific translations
  addSnackDialog: {
    title: "إضافة وجبة خفيفة صحية",
    subtitle: "الوجبة الخفيفة المثالية للسعرات المتبقية",
    generateSnack: "إنشاء وجبة خفيفة بالذكاء الاصطناعي",
    perfectFit: "مناسبة تماماً للسعرات المتبقية",
    caloriesAvailable: "سعرة حرارية متاحة",
    generatingAISnack: "جارٍ إنشاء وجبة خفيفة بالذكاء الاصطناعي",
    generateAISnack: "إنشاء وجبة خفيفة بالذكاء الاصطناعي",
    cancel: "إلغاء",
    targetReached: "تم الوصول للهدف اليومي!",
    targetReachedDesc: "لقد وصلت لهدف السعرات اليومي. عمل رائع!",
    close: "إغلاق",
    analyzing: "جارٍ تحليل احتياجاتك الغذائية...",
    creating: "جارٍ إنشاء الوجبة الخفيفة المثالية...",
    saving: "جارٍ الحفظ في خطة وجباتك...",
    pleaseWait: "يرجى الانتظار بينما ننشئ الوجبة الخفيفة المثالية لك...",
    error: "خطأ في إنشاء الوجبة الخفيفة",
    failed: "فشل في إنشاء الوجبة الخفيفة",
    notEnoughCalories: "لا توجد سعرات كافية متبقية للوجبة الخفيفة"
  }
} as const;
