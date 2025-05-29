import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the shape of the language context
interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  i18n: i18n.i18n;
  isRTL: boolean;
}

// Create the language context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  i18n: i18n.createInstance(),
  isRTL: false,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(storedLanguage);
    setIsRTL(storedLanguage === 'ar');
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    setIsRTL(language === 'ar');
  }, [language]);

  useEffect(() => {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: translations,
        lng: language,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          lookupLocalStorage: 'language',
          caches: ['localStorage'],
        },
      });
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const value: LanguageContextProps = {
    language: language,
    setLanguage: handleLanguageChange,
    t: i18n.t.bind(i18n),
    i18n: i18n,
    isRTL: isRTL,
  };

const translations = {
  en: {
    navigation: {
      home: 'Home',
      mealPlan: 'Meal Plan',
      fitnessTracking: 'Fitness Tracking',
      community: 'Community',
      settings: 'Settings',
      logout: 'Logout',
    },
    settingsPage: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      account: 'Account',
      profile: 'Profile',
      security: 'Security',
      help: 'Help',
      about: 'About',
      english: 'English',
      arabic: 'Arabic',
    },
    mealPlan: {
      title: 'Meal Plan',
      generatePlan: 'Generate Meal Plan',
      regeneratePlan: 'Regenerate Plan',
      daysMeals: '\'s Meals',
      mealsPlanned: 'Meals Planned',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      todaysSummary: 'Today\'s Summary',
      calToday: 'Cal Today',
      proteinToday: 'Protein Today',
      avgPerMeal: 'Avg per Meal',
      proteinPerMeal: 'Protein per Meal',
      shoppingList: 'Shopping List',
      recipe: 'Recipe',
      exchange: 'Exchange',
      min: 'min',
      serving: 'Serving',
      ingredients: 'Ingredients',
      more: 'more',
      aiGenerated: 'AI Generated',
      generateImage: 'Generate Image',
      loading: 'Loading meal plan...',
      generating: 'Generating your personalized meal plan...',
      dailyView: 'Daily View',
      weeklyView: 'Weekly View',
      addSnack: 'Add Snack',
      caloriesRemaining: 'Calories Remaining',
      calPerDay: 'Cal per day',
      progress: 'Progress',
      targetReached: 'Target Reached!',
      targetReachedDesc: 'You have reached your calorie target for today. Keep up the great work!',
      aiPoweredTitle: 'AI Powered Snack Suggestion',
      aiDescription: 'Let our AI suggest a delicious and healthy snack for you, tailored to fit your remaining {calories} calories.',
      quickPrep: 'Quick Preparation',
      healthy: 'Healthy and Nutritious',
      perfectFit: 'Perfect Calorie Fit',
      cancel: 'Cancel',
      generateSnack: 'Generate Snack',
	  selectDay: 'Select Day',
      thisWeek: 'This Week',
      lastWeek: 'Last Week', 
      nextWeek: 'Next Week',
      weeksAgo: 'weeks ago',
      weeksAhead: 'weeks ahead',
      previousWeek: 'Previous Week',
      finalizePlan: 'Finalize Plan',
      noActivePlan: 'No active meal plan found',
      planFinalized: 'Meal plan finalized successfully!'
    },
    addSnack: {
      title: 'Add AI Snack',
      error: 'Failed to generate snack. Please try again.',
      success: 'AI Snack generated successfully!',
      notEnoughCalories: 'Not enough calories remaining to generate a snack.',
      caloriesRemaining: 'Calories Remaining',
      aiPoweredTitle: 'AI Powered Snack Suggestion',
      aiDescription: 'Let our AI suggest a delicious and healthy snack for you, tailored to fit your remaining {calories} calories.',
      quickPrep: 'Quick Preparation',
      healthy: 'Healthy and Nutritious',
      perfectFit: 'Perfect Calorie Fit',
      cancel: 'Cancel',
      generateSnack: 'Generate Snack',
      targetReached: 'Calorie Target Reached',
      targetReachedDesc: 'You have already met your calorie target for today. Consider adjusting your plan or saving the calories for another day.',
    },
    day: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    },
    snack: 'Snack',
  },
  ar: {
    navigation: {
      home: 'الرئيسية',
      mealPlan: 'خطة الوجبات',
      fitnessTracking: 'تتبع اللياقة البدنية',
      community: 'المجتمع',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
    },
    settingsPage: {
      title: 'الإعدادات',
      language: 'اللغة',
      theme: 'السمة',
      notifications: 'الإشعارات',
      account: 'الحساب',
      profile: 'الملف الشخصي',
      security: 'الأمان',
      help: 'المساعدة',
      about: 'حول',
      english: 'الإنجليزية',
      arabic: 'العربية',
    },
    mealPlan: {
      title: 'خطة الوجبات',
      generatePlan: 'إنشاء خطة وجبات',
      regeneratePlan: 'إعادة إنشاء الخطة',
      daysMeals: ' وجبات اليوم',
      mealsPlanned: 'وجبات مخططة',
      calories: 'السعرات الحرارية',
      protein: 'البروتين',
      carbs: 'الكربوهيدرات',
      fat: 'الدهون',
      todaysSummary: 'ملخص اليوم',
      calToday: 'سعر حراري اليوم',
      proteinToday: 'بروتين اليوم',
      avgPerMeal: 'المعدل لكل وجبة',
      proteinPerMeal: 'البروتين لكل وجبة',
      shoppingList: 'قائمة التسوق',
      recipe: 'وصفة',
      exchange: 'تبادل',
      min: 'دقيقة',
      serving: 'حصة',
      ingredients: 'مكونات',
      more: 'المزيد',
      aiGenerated: 'تم إنشاؤه بواسطة الذكاء الاصطناعي',
      generateImage: 'إنشاء صورة',
      loading: 'جارٍ تحميل خطة الوجبات...',
      generating: 'جارٍ إنشاء خطة الوجبات المخصصة الخاصة بك...',
      dailyView: 'عرض يومي',
      weeklyView: 'عرض أسبوعي',
      addSnack: 'إضافة وجبة خفيفة',
      caloriesRemaining: 'السعرات الحرارية المتبقية',
      calPerDay: 'سعر حراري في اليوم',
      progress: 'التقدم',
      targetReached: 'تم الوصول إلى الهدف!',
      targetReachedDesc: 'لقد وصلت إلى هدف السعرات الحرارية لهذا اليوم. استمر في العمل الرائع!',
      aiPoweredTitle: 'اقتراح وجبة خفيفة مدعوم بالذكاء الاصطناعي',
      aiDescription: 'دع الذكاء الاصطناعي الخاص بنا يقترح وجبة خفيفة لذيذة وصحية لك، مصممة لتناسب {calories} السعرات الحرارية المتبقية.',
      quickPrep: 'تحضير سريع',
      healthy: 'صحي ومغذ',
      perfectFit: 'تناسب مثالي للسعرات الحرارية',
      cancel: 'إلغاء',
      generateSnack: 'إنشاء وجبة خفيفة',
	  selectDay: 'اختر اليوم',
      thisWeek: 'هذا الأسبوع',
      lastWeek: 'الأسبوع الماضي',
      nextWeek: 'الأسبوع القادم', 
      weeksAgo: 'أسابيع مضت',
      weeksAhead: 'أسابيع قادمة',
      previousWeek: 'الأسبوع السابق',
      finalizePlan: 'إنهاء الخطة',
      noActivePlan: 'لا توجد خطة وجبات نشطة',
      planFinalized: 'تم إنهاء خطة الوجبات بنجاح!'
    },
    addSnack: {
      title: 'إضافة وجبة خفيفة بالذكاء الاصطناعي',
      error: 'فشل إنشاء وجبة خفيفة. يرجى المحاولة مرة أخرى.',
      success: 'تم إنشاء وجبة خفيفة بالذكاء الاصطناعي بنجاح!',
      notEnoughCalories: 'لا توجد سعرات حرارية كافية متبقية لإنشاء وجبة خفيفة.',
      caloriesRemaining: 'السعرات الحرارية المتبقية',
      aiPoweredTitle: 'اقتراح وجبة خفيفة مدعوم بالذكاء الاصطناعي',
      aiDescription: 'دع الذكاء الاصطناعي الخاص بنا يقترح وجبة خفيفة لذيذة وصحية لك، مصممة لتناسب {calories} السعرات الحرارية المتبقية.',
      quickPrep: 'تحضير سريع',
      healthy: 'صحي ومغذ',
      perfectFit: 'تناسب مثالي للسعرات الحرارية',
      cancel: 'إلغاء',
      generateSnack: 'إنشاء وجبة خفيفة',
      targetReached: 'تم الوصول إلى هدف السعرات الحرارية',
      targetReachedDesc: 'لقد حققت بالفعل هدف السعرات الحرارية لهذا اليوم. فكر في تعديل خطتك أو توفير السعرات الحرارية ليوم آخر.',
    },
    day: {
      monday: 'الاثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت',
      sunday: 'الأحد'
    },
    snack: 'وجبة خفيفة',
  }
};

    day: {
      saturday: 'Saturday',
      sunday: 'Sunday', 
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday'
    },
    
    mealPlan: {
      selectDay: 'Select Day',
      thisWeek: 'This Week',
      lastWeek: 'Last Week', 
      nextWeek: 'Next Week',
      weeksAgo: 'weeks ago',
      weeksAhead: 'weeks ahead',
      previousWeek: 'Previous Week',
      finalizePlan: 'Finalize Plan',
      noActivePlan: 'No active meal plan found',
      planFinalized: 'Meal plan finalized successfully!'
    }
  },
  ar: {
    navigation: {
      home: 'الرئيسية',
      mealPlan: 'خطة الوجبات',
    },
    day: {
      saturday: 'السبت',
      sunday: 'الأحد',
      monday: 'الاثنين', 
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة'
    },
    
    mealPlan: {
      selectDay: 'اختر اليوم',
      thisWeek: 'هذا الأسبوع',
      lastWeek: 'الأسبوع الماضي',
      nextWeek: 'الأسبوع القادم', 
      weeksAgo: 'أسابيع مضت',
      weeksAhead: 'أسابيع قادمة',
      previousWeek: 'الأسبوع السابق',
      finalizePlan: 'إنهاء الخطة',
      noActivePlan: 'لا توجد خطة وجبات نشطة',
      planFinalized: 'تم إنهاء خطة الوجبات بنجاح!'
    }
  }
};

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
