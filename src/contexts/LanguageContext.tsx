
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

  // Days
  'day.saturday': { en: 'Saturday', ar: 'السبت' },
  'day.sunday': { en: 'Sunday', ar: 'الأحد' },
  'day.monday': { en: 'Monday', ar: 'الإثنين' },
  'day.tuesday': { en: 'Tuesday', ar: 'الثلاثاء' },
  'day.wednesday': { en: 'Wednesday', ar: 'الأربعاء' },
  'day.thursday': { en: 'Thursday', ar: 'الخميس' },
  'day.friday': { en: 'Friday', ar: 'الجمعة' },

  // Meal Plan
  'mealPlan.title': { en: 'Meal Plan', ar: 'خطة الوجبات' },
  'mealPlan.loading': { en: 'Loading meal plan...', ar: 'تحميل خطة الوجبات...' },
  'mealPlan.generating': { en: 'Generating your personalized meal plan...', ar: 'إنشاء خطة الوجبات الشخصية...' },
  'mealPlan.selectDay': { en: 'Select Day', ar: 'اختر اليوم' },
  'mealPlan.dailyView': { en: 'Daily View', ar: 'العرض اليومي' },
  'mealPlan.weeklyView': { en: 'Weekly View', ar: 'العرض الأسبوعي' },
  'mealPlan.addSnack': { en: 'Add Snack', ar: 'إضافة وجبة خفيفة' },
  'mealPlan.finalizePlan': { en: 'Finalize Plan', ar: 'إنهاء الخطة' },
  'mealPlan.daysMeals': { en: "'s Meals", ar: 'وجبات ' },
  'mealPlan.mealsPlanned': { en: 'meals planned', ar: 'وجبة مخططة' },
  'mealPlan.previousWeek': { en: 'Previous', ar: 'السابق' },
  'mealPlan.nextWeek': { en: 'Next', ar: 'التالي' },
  'mealPlan.thisWeek': { en: 'This Week', ar: 'هذا الأسبوع' },
  'mealPlan.lastWeek': { en: 'Last Week', ar: 'الأسبوع الماضي' },
  'mealPlan.nextWeek': { en: 'Next Week', ar: 'الأسبوع القادم' },
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
  'mealPlan.planFinalized': { en: 'Meal plan finalized! Ready for the next step.', ar: 'تم إنهاء خطة الوجبات! جاهز للخطوة التالية.' }
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
