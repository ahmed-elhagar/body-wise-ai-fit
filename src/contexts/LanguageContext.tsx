import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.mealPlan': 'Meal Plan',
    'nav.exercise': 'Exercise',
    'nav.weightTracking': 'Weight Tracking',
    'nav.calorieChecker': 'Calorie Checker',
    'nav.aiChat': 'AI Chat',
    'nav.profile': 'Profile',
    'nav.adminPanel': 'Admin Panel',
    'nav.welcomeBack': 'Welcome back',
    'nav.aiCallsLeft': 'AI calls left',
    'nav.signOut': 'Sign Out',
    'nav.aiPoweredFitness': 'AI-Powered Fitness',
    
    // Dashboard
    'dashboard.currentWeight': 'Current Weight',
    'dashboard.bmiIndex': 'BMI Index',
    'dashboard.fitnessGoal': 'Fitness Goal',
    'dashboard.activityLevel': 'Activity Level',
    'dashboard.fromProfile': 'From profile',
    'dashboard.fromTracking': 'From tracking',
    'dashboard.notSet': 'Not set',
    'dashboard.setYourGoal': 'Set your goal',
    'dashboard.completeProfile': 'Complete profile',
    
    // BMI Categories
    'bmi.underweight': 'Underweight',
    'bmi.normal': 'Normal',
    'bmi.overweight': 'Overweight',
    'bmi.obese': 'Obese',
    
    // Activity Levels
    'activity.sedentary': 'Sedentary',
    'activity.lightlyActive': 'Lightly Active',
    'activity.moderatelyActive': 'Moderately Active',
    'activity.veryActive': 'Very Active',
    'activity.extremelyActive': 'Extremely Active',
    
    // Fitness Goals
    'goal.weightLoss': 'Weight Loss',
    'goal.weightGain': 'Weight Gain',
    'goal.muscleGain': 'Muscle Gain',
    'goal.endurance': 'Endurance',
    
    // Meal Plan - Core
    'title': 'Meal Plan',
    'noMealPlan': 'No meal plan generated yet',
    'generateFirstPlan': 'Generate your first AI-powered meal plan',
    'noMealsToday': 'No meals for today',
    'generateNewPlan': 'Generate a new meal plan',
    'generateMealPlan': 'Generate Meal Plan',
    'dailyView': 'Daily View',
    'weeklyView': 'Weekly View',
    'totalCalories': 'Total Calories',
    'totalProtein': 'Total Protein',
    'addSnack': 'Add Snack',
    'shoppingList': 'Shopping List',
    'generating': 'Generating your meal plan...',
    'loading': 'Loading meal plan...',
    'more': 'more',
    'recipe': 'View Recipe',
    'exchange': 'Exchange',
    'balanced': 'Balanced',
    'vegetarian': 'Vegetarian',
    'keto': 'Keto',
    'highProtein': 'High Protein',
    'cal': 'cal',
    'protein': 'protein',
    'carbs': 'carbs',
    'fat': 'fat',
    'min': 'min',
    'calories': 'Calories',
    'weeklyMealPlan': 'Weekly Meal Plan',
    'personalizedPlan': 'Personalized nutrition for your fitness goals',
    'calPerDay': 'cal/day',
    'weeklyCalories': 'Weekly Calories',
    'weeklyProtein': 'Weekly Protein',
    'noMealsPlanned': 'No meals planned for this day',
    'noMealPlanToShuffle': 'No meal plan found to shuffle',
    'generatedSuccessfully': 'Meal plan generated successfully!',
    'generationFailed': 'Failed to generate meal plan. Please try again.',
    'thisWeek': 'This Week',
    'lastWeek': 'Last Week',
    'nextWeek': 'Next Week',
    'weeksAgo': 'weeks ago',
    'weeksAhead': 'weeks ahead',
    'previousWeek': 'Previous Week',
    'dailyViewHelper': 'View detailed daily meal breakdown',
    'weeklyViewHelper': 'Overview of your entire week',
    'todaysSummary': "Today's Summary",
    'weeklyOverview': 'Weekly Overview',
    'serving': 'serving',
    'servings': 'servings',
    'ingredients': 'ingredients',
    
    // Meal Types
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'dinner': 'Dinner',
    'snack': 'Snack',
    'snacks': 'Snacks',
    
    // Days of week
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    'today': 'Today',
    
    // Week navigation
    'previousWeek': 'Previous Week',
    'nextWeek': 'Next Week',
    'currentWeek': 'Current Week',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.mealPlan': 'خطة الوجبات',
    'nav.exercise': 'التمارين',
    'nav.weightTracking': 'تتبع الوزن',
    'nav.calorieChecker': 'فاحص السعرات',
    'nav.aiChat': 'محادثة الذكي',
    'nav.profile': 'الملف الشخصي',
    'nav.adminPanel': 'لوحة الإدارة',
    'nav.welcomeBack': 'مرحباً بعودتك',
    'nav.aiCallsLeft': 'مكالمات الذكي المتبقية',
    'nav.signOut': 'تسجيل الخروج',
    'nav.aiPoweredFitness': 'اللياقة المدعومة بالذكاء الاصطناعي',
    
    // Dashboard
    'dashboard.currentWeight': 'الوزن الحالي',
    'dashboard.bmiIndex': 'مؤشر كتلة الجسم',
    'dashboard.fitnessGoal': 'هدف اللياقة',
    'dashboard.activityLevel': 'مستوى النشاط',
    'dashboard.fromProfile': 'من الملف الشخصي',
    'dashboard.fromTracking': 'من التتبع',
    'dashboard.notSet': 'غير محدد',
    'dashboard.setYourGoal': 'حدد هدفك',
    'dashboard.completeProfile': 'أكمل الملف الشخصي',
    
    // BMI Categories
    'bmi.underweight': 'نقص الوزن',
    'bmi.normal': 'طبيعي',
    'bmi.overweight': 'زيادة الوزن',
    'bmi.obese': 'سمنة',
    
    // Activity Levels
    'activity.sedentary': 'خامل',
    'activity.lightlyActive': 'نشاط خفيف',
    'activity.moderatelyActive': 'نشاط متوسط',
    'activity.veryActive': 'نشاط عالي',
    'activity.extremelyActive': 'نشاط شديد',
    
    // Fitness Goals
    'goal.weightLoss': 'فقدان الوزن',
    'goal.weightGain': 'زيادة الوزن',
    'goal.muscleGain': 'بناء العضلات',
    'goal.endurance': 'التحمل',
    
    // Meal Plan - Core
    'title': 'خطة الوجبات',
    'noMealPlan': 'لم يتم إنشاء خطة وجبات بعد',
    'generateFirstPlan': 'إنشاء أول خطة وجبات بالذكاء الاصطناعي',
    'noMealsToday': 'لا توجد وجبات لليوم',
    'generateNewPlan': 'إنشاء خطة وجبات جديدة',
    'generateMealPlan': 'إنشاء خطة الوجبات',
    'dailyView': 'العرض اليومي',
    'weeklyView': 'العرض الأسبوعي',
    'totalCalories': 'إجمالي السعرات',
    'totalProtein': 'إجمالي البروتين',
    'addSnack': 'إضافة وجبة خفيفة',
    'shoppingList': 'قائمة التسوق',
    'generating': 'جاري إنشاء خطة الوجبات...',
    'loading': 'جاري تحميل خطة الوجبات...',
    'more': 'المزيد',
    'recipe': 'عرض الوصفة',
    'exchange': 'استبدال',
    'balanced': 'متوازن',
    'vegetarian': 'نباتي',
    'keto': 'كيتو',
    'highProtein': 'عالي البروتين',
    'cal': 'سعرة',
    'protein': 'بروتين',
    'carbs': 'كربوهيدرات',
    'fat': 'دهون',
    'min': 'دقيقة',
    'calories': 'السعرات الحرارية',
    'weeklyMealPlan': 'خطة الوجبات الأسبوعية',
    'personalizedPlan': 'تغذية مخصصة لأهداف لياقتك',
    'calPerDay': 'سعرة/يوم',
    'weeklyCalories': 'السعرات الأسبوعية',
    'weeklyProtein': 'البروتين الأسبوعي',
    'noMealsPlanned': 'لا توجد وجبات مخططة لهذا اليوم',
    'noMealPlanToShuffle': 'لا توجد خطة وجبات للخلط',
    'generatedSuccessfully': 'تم إنشاء خطة الوجبات بنجاح!',
    'generationFailed': 'فشل في إنشاء خطة الوجبات. حاول مرة أخرى.',
    'thisWeek': 'هذا الأسبوع',
    'lastWeek': 'الأسبوع الماضي',
    'nextWeek': 'الأسبوع القادم',
    'weeksAgo': 'أسابيع مضت',
    'weeksAhead': 'أسابيع قادمة',
    'previousWeek': 'الأسبوع السابق',
    'dailyViewHelper': 'عرض تفصيلي لوجبات اليوم',
    'weeklyViewHelper': 'نظرة عامة على الأسبوع كاملاً',
    'todaysSummary': 'ملخص اليوم',
    'weeklyOverview': 'نظرة عامة أسبوعية',
    'serving': 'حصة',
    'servings': 'حصص',
    'ingredients': 'مكونات',
    
    // Meal Types
    'breakfast': 'الإفطار',
    'lunch': 'الغداء',
    'dinner': 'العشاء',
    'snack': 'وجبة خفيفة',
    'snacks': 'وجبات خفيفة',
    
    // Days of week
    'monday': 'الإثنين',
    'tuesday': 'الثلاثاء',
    'wednesday': 'الأربعاء',
    'thursday': 'الخميس',
    'friday': 'الجمعة',
    'saturday': 'السبت',
    'sunday': 'الأحد',
    'today': 'اليوم',
    
    // Week navigation
    'previousWeek': 'الأسبوع السابق',
    'nextWeek': 'الأسبوع التالي',
    'currentWeek': 'الأسبوع الحالي',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const { profile, updateProfile } = useProfile();

  // Load language from profile when available
  useEffect(() => {
    if (profile?.preferred_language && profile.preferred_language !== language) {
      console.log('LanguageContext - Loading language from profile:', profile.preferred_language);
      setLanguageState(profile.preferred_language as Language);
      
      // Update document direction
      document.documentElement.dir = profile.preferred_language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = profile.preferred_language;
    }
  }, [profile?.preferred_language]);

  // Initialize language on first load from localStorage if no profile
  useEffect(() => {
    if (!profile) {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguageState(savedLanguage);
        document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLanguage;
      }
    }
  }, [profile]);

  const setLanguage = async (lang: Language) => {
    console.log('LanguageContext - Setting language to:', lang);
    setLanguageState(lang);
    
    // Update document direction immediately
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Save to localStorage as backup
    localStorage.setItem('language', lang);
    
    // Update profile if available
    if (profile) {
      try {
        await updateProfile({ preferred_language: lang });
        console.log('LanguageContext - Language updated in profile');
      } catch (error) {
        console.error('LanguageContext - Failed to update language in profile:', error);
      }
    }
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      return key;
    }
    return translation;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
