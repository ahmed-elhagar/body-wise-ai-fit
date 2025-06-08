
export const foodTracker = {
  // Main Navigation
  tabs: {
    today: "اليوم",
    history: "التاريخ",
    search: "البحث عن طعام"
  },
  
  // Today Tab
  today: {
    title: "تغذية اليوم",
    subtitle: "تتبع استهلاكك اليومي",
    noMeals: "لم يتم تسجيل وجبات اليوم",
    addFirstMeal: "أضف وجبتك الأولى",
    totalCalories: "إجمالي السعرات",
    targetCalories: "الهدف",
    remaining: "المتبقي",
    over: "فوق الهدف",
    macros: {
      protein: "البروتين",
      carbs: "الكربوهيدرات", 
      fat: "الدهون",
      fiber: "الألياف"
    }
  },
  
  // History Tab
  history: {
    title: "تاريخ التغذية",
    subtitle: "اعرض بيانات التغذية السابقة",
    noHistory: "لا يوجد تاريخ تغذية بعد",
    startTracking: "ابدأ التتبع لرؤية تقدمك",
    dailyAverage: "المتوسط اليومي",
    weeklyTrend: "الاتجاه الأسبوعي",
    export: "تصدير البيانات",
    filter: {
      title: "تصفية حسب التاريخ",
      thisWeek: "هذا الأسبوع",
      lastWeek: "الأسبوع الماضي", 
      thisMonth: "هذا الشهر",
      custom: "نطاق مخصص"
    }
  },
  
  // Add Food Dialog
  addFood: {
    title: "إضافة طعام",
    searchPlaceholder: "ابحث عن الطعام...",
    noResults: "لم يتم العثور على عناصر طعام",
    tryDifferent: "جرب مصطلح بحث مختلف",
    quantity: "الكمية",
    unit: "الوحدة",
    add: "إضافة طعام",
    adding: "جاري الإضافة...",
    tabs: {
      search: "بحث",
      scan: "مسح الباركود",
      manual: "إدخال يدوي"
    }
  },
  
  // Manual Entry
  manual: {
    title: "إدخال طعام يدوي",
    foodName: "اسم الطعام",
    brand: "العلامة التجارية (اختياري)",
    servingSize: "حجم الحصة",
    calories: "السعرات الحرارية",
    protein: "البروتين (جم)",
    carbs: "الكربوهيدرات (جم)",
    fat: "الدهون (جم)",
    fiber: "الألياف (جم)",
    sugar: "السكر (جم)",
    sodium: "الصوديوم (مجم)",
    save: "حفظ عنصر الطعام",
    saving: "جاري الحفظ..."
  },
  
  // Barcode Scanner
  scanner: {
    title: "مسح الباركود",
    instruction: "وجه الكاميرا نحو الباركود",
    scanning: "جاري المسح...",
    notFound: "لم يتم العثور على المنتج",
    tryManual: "جرب الإدخال اليدوي بدلاً من ذلك",
    permission: "مطلوب إذن الكاميرا",
    enable: "تفعيل الكاميرا"
  },
  
  // Food Item Card
  foodItem: {
    per100g: "لكل 100 جم",
    perServing: "لكل حصة",
    edit: "تعديل",
    delete: "حذف",
    duplicate: "نسخ",
    addToMeal: "إضافة للوجبة",
    nutrition: "حقائق التغذية"
  },
  
  // Meal Types
  mealTypes: {
    breakfast: "فطور",
    lunch: "غداء", 
    dinner: "عشاء",
    snacks: "وجبات خفيفة",
    other: "أخرى"
  },
  
  // Quick Add
  quickAdd: {
    title: "إضافة سريعة",
    recentFoods: "الأطعمة الحديثة",
    favoritesFoods: "الأطعمة المفضلة",
    commonFoods: "الأطعمة الشائعة"
  },
  
  // Photo Analysis
  photoAnalysis: {
    title: "تحليل الصورة",
    takePhoto: "التقاط صورة",
    uploadPhoto: "رفع صورة",
    analyzing: "جاري تحليل الصورة...",
    results: "نتائج التحليل",
    confidence: "مستوى الثقة",
    addDetected: "إضافة العناصر المكتشفة"
  },
  
  // Nutrition Goals
  goals: {
    title: "أهداف التغذية",
    setGoals: "تحديد الأهداف",
    calories: "السعرات اليومية",
    protein: "هدف البروتين",
    carbs: "هدف الكربوهيدرات", 
    fat: "هدف الدهون",
    fiber: "هدف الألياف",
    save: "حفظ الأهداف",
    reset: "إعادة تعيين الافتراضي"
  },
  
  // Messages
  messages: {
    foodAdded: "تم إضافة الطعام بنجاح",
    foodDeleted: "تم حذف الطعام",
    goalsSaved: "تم تحديث الأهداف بنجاح",
    photoUploaded: "تم رفع الصورة بنجاح",
    analysisComplete: "اكتمل تحليل الصورة",
    error: "حدث خطأ ما",
    networkError: "خطأ في الشبكة. يرجى المحاولة مرة أخرى."
  }
} as const;
