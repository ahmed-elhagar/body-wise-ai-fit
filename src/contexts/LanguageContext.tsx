
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
    
    // Meal Plan
    'mealPlan.title': 'Meal Plan',
    'mealPlan.noMealPlan': 'No meal plan generated yet',
    'mealPlan.generateFirstPlan': 'Generate your first AI-powered meal plan',
    'mealPlan.noMealsToday': 'No meals for today',
    'mealPlan.generateNewPlan': 'Generate a new meal plan',
    'mealPlan.generateMealPlan': 'Generate Meal Plan',
    'mealPlan.dailyView': 'Daily View',
    'mealPlan.weeklyView': 'Weekly View',
    'mealPlan.totalCalories': 'Total Calories',
    'mealPlan.totalProtein': 'Total Protein',
    'mealPlan.addSnack': 'Add Snack',
    'mealPlan.shoppingList': 'Shopping List',
    'mealPlan.generating': 'Generating your meal plan...',
    'mealPlan.loading': 'Loading meal plan...',
    'mealPlan.more': 'more',
    'mealPlan.recipe': 'View Recipe',
    'mealPlan.exchange': 'Exchange',
    'mealPlan.balanced': 'Balanced',
    'mealPlan.vegetarian': 'Vegetarian',
    'mealPlan.keto': 'Keto',
    'mealPlan.highProtein': 'High Protein',
    
    // Meal Types
    'mealType.breakfast': 'Breakfast',
    'mealType.lunch': 'Lunch',
    'mealType.dinner': 'Dinner',
    'mealType.snacks': 'Snacks',
    'mealType.snack': 'Snack',
    
    // Meal Card
    'meal.calories': 'calories',
    'meal.protein': 'protein',
    'meal.carbs': 'carbs',
    'meal.fat': 'fat',
    'meal.servings': 'servings',
    'meal.cookTime': 'Cook time',
    'meal.prepTime': 'Prep time',
    'meal.minutes': 'min',
    'meal.ingredients': 'Ingredients',
    'meal.viewRecipe': 'View Recipe',
    'meal.exchange': 'Exchange',
    'meal.showIngredients': 'Show Ingredients',
    'meal.hideIngredients': 'Hide Ingredients',
    
    // Days of week
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
    'day.thursday': 'Thursday',
    'day.friday': 'Friday',
    'day.saturday': 'Saturday',
    'day.sunday': 'Sunday',
    'day.today': 'Today',
    
    // Week navigation
    'week.previousWeek': 'Previous Week',
    'week.nextWeek': 'Next Week',
    'week.currentWeek': 'Current Week',
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
    
    // Meal Plan
    'mealPlan.title': 'خطة الوجبات',
    'mealPlan.noMealPlan': 'لم يتم إنشاء خطة وجبات بعد',
    'mealPlan.generateFirstPlan': 'إنشاء أول خطة وجبات بالذكاء الاصطناعي',
    'mealPlan.noMealsToday': 'لا توجد وجبات لليوم',
    'mealPlan.generateNewPlan': 'إنشاء خطة وجبات جديدة',
    'mealPlan.generateMealPlan': 'إنشاء خطة الوجبات',
    'mealPlan.dailyView': 'العرض اليومي',
    'mealPlan.weeklyView': 'العرض الأسبوعي',
    'mealPlan.totalCalories': 'إجمالي السعرات',
    'mealPlan.totalProtein': 'إجمالي البروتين',
    'mealPlan.addSnack': 'إضافة وجبة خفيفة',
    'mealPlan.shoppingList': 'قائمة التسوق',
    'mealPlan.generating': 'جاري إنشاء خطة الوجبات...',
    'mealPlan.loading': 'جاري تحميل خطة الوجبات...',
    'mealPlan.more': 'المزيد',
    'mealPlan.recipe': 'عرض الوصفة',
    'mealPlan.exchange': 'استبدال',
    'mealPlan.balanced': 'متوازن',
    'mealPlan.vegetarian': 'نباتي',
    'mealPlan.keto': 'كيتو',
    'mealPlan.highProtein': 'عالي البروتين',
    
    // Meal Types
    'mealType.breakfast': 'الإفطار',
    'mealType.lunch': 'الغداء',
    'mealType.dinner': 'العشاء',
    'mealType.snacks': 'وجبات خفيفة',
    'mealType.snack': 'وجبة خفيفة',
    
    // Meal Card
    'meal.calories': 'سعرة حرارية',
    'meal.protein': 'بروتين',
    'meal.carbs': 'كربوهيدرات',
    'meal.fat': 'دهون',
    'meal.servings': 'حصص',
    'meal.cookTime': 'وقت الطهي',
    'meal.prepTime': 'وقت التحضير',
    'meal.minutes': 'دقيقة',
    'meal.ingredients': 'المكونات',
    'meal.viewRecipe': 'عرض الوصفة',
    'meal.exchange': 'استبدال',
    'meal.showIngredients': 'إظهار المكونات',
    'meal.hideIngredients': 'إخفاء المكونات',
    
    // Days of week
    'day.monday': 'الإثنين',
    'day.tuesday': 'الثلاثاء',
    'day.wednesday': 'الأربعاء',
    'day.thursday': 'الخميس',
    'day.friday': 'الجمعة',
    'day.saturday': 'السبت',
    'day.sunday': 'الأحد',
    'day.today': 'اليوم',
    
    // Week navigation
    'week.previousWeek': 'الأسبوع السابق',
    'week.nextWeek': 'الأسبوع التالي',
    'week.currentWeek': 'الأسبوع الحالي',
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
