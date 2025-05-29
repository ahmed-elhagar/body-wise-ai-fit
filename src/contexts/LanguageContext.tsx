import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.mealPlan': { en: 'Meal Plan', ar: 'خطة الوجبات' },
  'nav.exercise': { en: 'Exercise', ar: 'التمارين' },
  'nav.weightTracking': { en: 'Weight Tracking', ar: 'تتبع الوزن' },
  'nav.calorieChecker': { en: 'Calorie Checker', ar: 'فاحص السعرات' },
  'nav.profile': { en: 'Profile', ar: 'الملف الشخصي' },
  'nav.aiChat': { en: 'AI Chat', ar: 'دردشة ذكية' },
  'nav.logout': { en: 'Logout', ar: 'تسجيل خروج' },
  'nav.signOut': { en: 'Sign Out', ar: 'تسجيل خروج' },
  'nav.welcomeBack': { en: 'Welcome back', ar: 'مرحباً بعودتك' },
  'nav.aiCallsLeft': { en: 'AI calls left', ar: 'استدعاءات ذكية متبقية' },
  'nav.aiPoweredFitness': { en: 'AI-Powered Fitness', ar: 'لياقة مدعومة بالذكاء الاصطناعي' },
  'nav.adminPanel': { en: 'Admin Panel', ar: 'لوحة الإدارة' },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome', ar: 'مرحباً' },
  'dashboard.trackProgress': { en: 'Track your fitness progress', ar: 'تتبع تقدمك في اللياقة' },
  'dashboard.aiGenerationsRemaining': { en: 'AI generations remaining', ar: 'الاستدعاءات الذكية المتبقية' },
  'dashboard.currentWeight': { en: 'Current Weight', ar: 'الوزن الحالي' },
  'dashboard.fromProfile': { en: 'From Profile', ar: 'من الملف الشخصي' },
  'dashboard.bmiIndex': { en: 'BMI Index', ar: 'مؤشر كتلة الجسم' },
  'dashboard.fitnessGoal': { en: 'Fitness Goal', ar: 'هدف اللياقة' },
  'dashboard.activityLevel': { en: 'Activity Level', ar: 'مستوى النشاط' },
  'dashboard.recentActivity': { en: 'Recent Activity', ar: 'النشاط الحديث' },
  'dashboard.quickActions': { en: 'Quick Actions', ar: 'الإجراءات السريعة' },

  // BMI Status
  'bmi.underweight': { en: 'Underweight', ar: 'نقص وزن' },
  'bmi.normal': { en: 'Normal', ar: 'طبيعي' },
  'bmi.overweight': { en: 'Overweight', ar: 'زيادة وزن' },
  'bmi.obese': { en: 'Obese', ar: 'سمنة' },

  // Fitness Goals
  'goal.weightLoss': { en: 'Weight Loss', ar: 'فقدان الوزن' },
  'goal.muscleGain': { en: 'Muscle Gain', ar: 'زيادة العضلات' },
  'goal.maintenance': { en: 'Maintenance', ar: 'المحافظة' },
  'goal.endurance': { en: 'Endurance', ar: 'التحمل' },

  // Activity Levels
  'activity.sedentary': { en: 'Sedentary', ar: 'قليل الحركة' },
  'activity.lightlyActive': { en: 'Lightly Active', ar: 'نشط بشكل خفيف' },
  'activity.moderatelyActive': { en: 'Moderately Active', ar: 'نشط بشكل متوسط' },
  'activity.veryActive': { en: 'Very Active', ar: 'نشط جداً' },
  'activity.extremelyActive': { en: 'Extremely Active', ar: 'نشط للغاية' },

  // Recent Activity
  'recentActivity.title': { en: 'Recent Activity', ar: 'النشاط الحديث' },
  'recentActivity.createdMealPlan': { en: 'Created meal plan', ar: 'تم إنشاء خطة الوجبات' },
  'recentActivity.createdProgram': { en: 'Created program', ar: 'تم إنشاء برنامج' },
  'recentActivity.loggedWeight': { en: 'Logged weight', ar: 'تم تسجيل الوزن' },
  'recentActivity.badges.nutrition': { en: 'Nutrition', ar: 'التغذية' },
  'recentActivity.badges.exercise': { en: 'Exercise', ar: 'التمارين' },
  'recentActivity.badges.weight': { en: 'Weight', ar: 'الوزن' },
  'recentActivity.program': { en: 'Personalized Fitness Program', ar: 'برنامج لياقة شخصي' },

  // Common time expressions
  'common.minutesAgo': { en: 'minutes ago', ar: 'دقائق مضت' },
  'common.hoursAgo': { en: 'hours ago', ar: 'ساعات مضت' },
  'common.dayAgo': { en: 'day ago', ar: 'يوم مضى' },
  'common.daysAgo': { en: 'days ago', ar: 'أيام مضت' },
  'common.kg': { en: 'kg', ar: 'كيلو' },

  // Days
  'day.saturday': { en: 'Saturday', ar: 'السبت' },
  'day.sunday': { en: 'Sunday', ar: 'الأحد' },
  'day.monday': { en: 'Monday', ar: 'الإثنين' },
  'day.tuesday': { en: 'Tuesday', ar: 'الثلاثاء' },
  'day.wednesday': { en: 'Wednesday', ar: 'الأربعاء' },
  'day.thursday': { en: 'Thursday', ar: 'الخميس' },
  'day.friday': { en: 'Friday', ar: 'الجمعة' },

  // Meal Plan - Enhanced with missing translations
  'mealPlan.title': { en: 'Meal Plan', ar: 'خطة الوجبات' },
  'mealPlan.loading': { en: 'Loading meal plan...', ar: 'تحميل خطة الوجبات...' },
  'mealPlan.generating': { en: 'Generating your personalized meal plan...', ar: 'إنشاء خطة الوجبات الشخصية...' },
  'mealPlan.selectDay': { en: 'Select Day', ar: 'اختر اليوم' },
  'mealPlan.dailyView': { en: 'Daily View', ar: 'العرض اليومي' },
  'mealPlan.weeklyView': { en: 'Weekly View', ar: 'العرض الأسبوعي' },
  'mealPlan.addSnack': { en: 'Add Snack', ar: 'إضافة وجبة خفيفة' },
  'mealPlan.daysMeals': { en: "'s Meals", ar: 'وجبات ' },
  'mealPlan.mealsPlanned': { en: 'meals planned', ar: 'وجبة مخططة' },
  'mealPlan.previousWeek': { en: 'Previous', ar: 'السابق' },
  'mealPlan.nextWeek': { en: 'Next', ar: 'التالي' },
  'mealPlan.thisWeek': { en: 'This Week', ar: 'هذا الأسبوع' },
  'mealPlan.lastWeek': { en: 'Last Week', ar: 'الأسبوع الماضي' },
  'mealPlan.nextWeekNav': { en: 'Next Week', ar: 'الأسبوع القادم' },
  'mealPlan.weeksAgo': { en: 'weeks ago', ar: 'أسابيع مضت' },
  'mealPlan.weeksAhead': { en: 'weeks ahead', ar: 'أسابيع قادمة' },
  'mealPlan.todaysSummary': { en: "Today's Summary", ar: 'ملخص اليوم' },
  'mealPlan.calories': { en: 'Calories', ar: 'السعرات' },
  'mealPlan.protein': { en: 'Protein', ar: 'البروتين' },
  'mealPlan.carbs': { en: 'Carbs', ar: 'الكربوهيدرات' },
  'mealPlan.fat': { en: 'Fat', ar: 'الدهون' },
  'mealPlan.calToday': { en: 'cal today', ar: 'سعرة اليوم' },
  'mealPlan.proteinToday': { en: 'protein today', ar: 'بروتين اليوم' },
  'mealPlan.avgPerMeal': { en: 'avg/meal', ar: 'متوسط/وجبة' },
  'mealPlan.proteinPerMeal': { en: 'protein/meal', ar: 'بروتين/وجبة' },
  'mealPlan.shoppingList': { en: 'Shopping List', ar: 'قائمة التسوق' },
  'mealPlan.weeklyMealPlan': { en: 'Weekly Meal Plan', ar: 'خطة الوجبات الأسبوعية' },
  'mealPlan.personalizedPlan': { en: 'Personalized nutrition for your fitness goals', ar: 'تغذية شخصية لأهدافك الرياضية' },
  'mealPlan.weeklyCalories': { en: 'Weekly Calories', ar: 'السعرات الأسبوعية' },
  'mealPlan.weeklyProtein': { en: 'Weekly Protein', ar: 'البروتين الأسبوعي' },
  'mealPlan.cal': { en: 'cal', ar: 'سعرة' },
  'mealPlan.calPerDay': { en: 'cal/day', ar: 'سعرة/يوم' },
  'mealPlan.min': { en: 'min', ar: 'دقيقة' },
  'mealPlan.serving': { en: 'serving', ar: 'حصة' },
  'mealPlan.ingredients': { en: 'ingredients', ar: 'مكونات' },
  'mealPlan.more': { en: 'more', ar: 'أكثر' },
  'mealPlan.recipe': { en: 'Recipe', ar: 'الوصفة' },
  'mealPlan.exchange': { en: 'Exchange', ar: 'استبدال' },
  'mealPlan.generateImage': { en: 'Generate Image', ar: 'إنشاء صورة' },
  'mealPlan.aiGenerated': { en: 'AI Generated', ar: 'مُولد بالذكاء الاصطناعي' },
  'mealPlan.snack': { en: 'Snack', ar: 'وجبة خفيفة' },
  'mealPlan.breakfast': { en: 'Breakfast', ar: 'إفطار' },
  'mealPlan.lunch': { en: 'Lunch', ar: 'غداء' },
  'mealPlan.dinner': { en: 'Dinner', ar: 'عشاء' },
  'mealPlan.noMealsPlanned': { en: 'No meals planned', ar: 'لا توجد وجبات مخططة' },
  'mealPlan.vegetarian': { en: 'Vegetarian Diet', ar: 'نظام نباتي' },
  'mealPlan.keto': { en: 'Keto Diet', ar: 'نظام كيتو' },
  'mealPlan.highProtein': { en: 'High Protein Diet', ar: 'نظام عالي البروتين' },
  'mealPlan.balanced': { en: 'Balanced Diet', ar: 'نظام متوازن' },
  'mealPlan.noActivePlan': { en: 'No active meal plan found', ar: 'لم يتم العثور على خطة وجبات نشطة' },
  
  // AI Generation Dialog
  'mealPlan.generateAIMealPlan': { en: 'Generate AI Meal Plan', ar: 'إنشاء خطة وجبات ذكية' },
  'mealPlan.sevenDayCompletePlan': { en: '7-Day Complete Plan', ar: 'خطة كاملة لـ 7 أيام' },
  'mealPlan.mealsTotal': { en: '21-35 meals total (based on snacks)', ar: '21-35 وجبة إجمالية (حسب الوجبات الخفيفة)' },
  'mealPlan.personalizedProfile': { en: 'Personalized to your profile', ar: 'مخصصة لملفك الشخصي' },
  'mealPlan.foodDatabaseIntegration': { en: 'Food Database Integration', ar: 'تكامل قاعدة بيانات الطعام' },
  'mealPlan.automaticallyPopulates': { en: 'Automatically populates nutrition data', ar: 'ملء تلقائي لبيانات التغذية' },
  'mealPlan.enablesQuickSearch': { en: 'Enables quick food search', ar: 'تمكين البحث السريع عن الطعام' },
  'mealPlan.storesNutritionalData': { en: 'Stores nutritional data', ar: 'تخزين البيانات الغذائية' },
  'mealPlan.includeSnacks': { en: 'Include Snacks (35 meals)', ar: 'تضمين الوجبات الخفيفة (35 وجبة)' },
  'mealPlan.withSnacksDesc': { en: 'Includes 2 healthy snacks per day (35 total meals)', ar: 'يتضمن وجبتين خفيفتين صحيتين يومياً (35 وجبة إجمالية)' },
  'mealPlan.withoutSnacksDesc': { en: 'Main meals only: breakfast, lunch, dinner (21 total meals)', ar: 'الوجبات الرئيسية فقط: إفطار، غداء، عشاء (21 وجبة إجمالية)' },
  'mealPlan.preferredCuisine': { en: 'Preferred Cuisine', ar: 'المطبخ المفضل' },
  'mealPlan.cuisinePlaceholder': { en: 'e.g., Mediterranean, Asian, Mexican', ar: 'مثل: متوسطي، آسيوي، مكسيكي' },
  'mealPlan.leaveEmptyNationality': { en: 'Leave empty to use your nationality from profile', ar: 'اتركه فارغاً لاستخدام جنسيتك من الملف الشخصي' },
  'mealPlan.maxPrepTime': { en: 'Maximum Preparation Time', ar: 'أقصى وقت للتحضير' },
  'mealPlan.minutes': { en: 'minutes', ar: 'دقيقة' },
  'mealPlan.hour': { en: 'hour', ar: 'ساعة' },
  'mealPlan.hours': { en: 'hours', ar: 'ساعات' },
  'mealPlan.generateSevenDayPlan': { en: 'Generate 7-Day Plan', ar: 'إنشاء خطة لـ 7 أيام' },
  'mealPlan.creatingPersonalized': { en: 'Creating your personalized meal plan...', ar: 'إنشاء خطة الوجبات الشخصية...' },
  'mealPlan.mayTakeTime': { en: 'This may take a few moments', ar: 'قد يستغرق هذا بضع لحظات' },
  'mealPlan.regeneratePlan': { en: 'Regenerate Plan', ar: 'إعادة توليد الخطة' },
  'mealPlan.shuffleMeals': { en: 'Shuffle Meals', ar: 'خلط الوجبات' },

  // Cuisine options
  'cuisine.mediterranean': { en: 'Mediterranean', ar: 'متوسطي' },
  'cuisine.asian': { en: 'Asian', ar: 'آسيوي' },
  'cuisine.mexican': { en: 'Mexican', ar: 'مكسيكي' },
  'cuisine.italian': { en: 'Italian', ar: 'إيطالي' },
  'cuisine.indian': { en: 'Indian', ar: 'هندي' },
  'cuisine.middleEastern': { en: 'Middle Eastern', ar: 'شرق أوسطي' },
  'cuisine.american': { en: 'American', ar: 'أمريكي' },
  'cuisine.french': { en: 'French', ar: 'فرنسي' },
  'cuisine.japanese': { en: 'Japanese', ar: 'ياباني' },
  'cuisine.thai': { en: 'Thai', ar: 'تايلاندي' },
  'cuisine.mixed': { en: 'Mixed/International', ar: 'مختلط/عالمي' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
