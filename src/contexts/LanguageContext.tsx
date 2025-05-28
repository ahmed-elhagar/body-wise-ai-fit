
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.mealPlan': 'Meal Plan',
    'nav.exercise': 'Exercise',
    'nav.weightTracking': 'Weight Tracking',
    'nav.profile': 'Profile',
    'nav.calorieChecker': 'Calorie Checker',
    'nav.aiChat': 'AI Chat',
    'nav.adminPanel': 'Admin Panel',
    'nav.signOut': 'Sign Out',
    'nav.aiCallsLeft': 'AI calls left',
    'nav.welcomeBack': 'Welcome back!',
    'nav.aiPoweredFitness': 'AI-Powered Fitness Companion',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.currentWeight': 'Current Weight',
    'dashboard.bmiIndex': 'BMI Index',
    'dashboard.fitnessGoal': 'Fitness Goal',
    'dashboard.activityLevel': 'Activity Level',
    'dashboard.aiGenerationsRemaining': 'AI Generations Remaining',
    'dashboard.fromProfile': 'From profile',
    'dashboard.fromTracking': 'From tracking',
    'dashboard.completeProfile': 'Complete profile',
    'dashboard.setYourGoal': 'Set your goal',
    'dashboard.notSet': 'Not set',
    'dashboard.trackProgress': 'Track your fitness journey and achieve your goals with AI-powered insights.',
    'dashboard.generatingContent': 'Generating Your Personalized Content',
    'dashboard.generatingDescription': 'Our AI is creating your customized meal plans and exercise programs based on your profile...',
    'dashboard.pleaseWait': 'This may take 30-60 seconds. Please don\'t refresh the page.',
    
    // Quick Actions
    'quickActions.title': 'Quick Actions',
    'quickActions.logWeight': 'Log Weight',
    'quickActions.trackProgress': 'Track your progress',
    'quickActions.logFood': 'Log Food',
    'quickActions.checkCalories': 'Check calories',
    'quickActions.mealPlan': 'Meal Plan',
    'quickActions.viewWeeklyMeals': 'View weekly meals',
    'quickActions.workout': 'Workout',
    'quickActions.startExercising': 'Start exercising',
    'quickActions.updateGoals': 'Update Goals',
    'quickActions.modifyTargets': 'Modify your targets',
    'quickActions.schedule': 'Schedule',
    'quickActions.planWeek': 'Plan your week',
    
    // Recent Activity
    'recentActivity.title': 'Recent Activity',
    'recentActivity.noActivity': 'No activity yet. Start by logging your weight or creating a meal plan!',
    'recentActivity.loggedWeight': 'Logged weight',
    'recentActivity.createdMealPlan': 'Created meal plan for week of',
    'recentActivity.createdProgram': 'Created',
    'recentActivity.program': 'program',
    'recentActivity.badges.weight': 'Weight',
    'recentActivity.badges.nutrition': 'Nutrition',
    'recentActivity.badges.exercise': 'Exercise',
    
    // Meal Plan
    'mealPlan.title': 'Meal Plan',
    'mealPlan.generateAIPlan': 'Generate AI Plan',
    'mealPlan.regeneratePlan': 'Regenerate Plan',
    'mealPlan.dailyView': 'Daily View',
    'mealPlan.weeklyView': 'Weekly View',
    'mealPlan.addSnack': 'Add AI Snack',
    'mealPlan.yourMealPlan': 'Your Meal Plan',
    'mealPlan.personalizedNutrition': 'Personalized nutrition for your fitness goals',
    'mealPlan.diet': 'Diet',
    'mealPlan.calPerDay': 'cal/day',
    'mealPlan.mealsPlanned': 'meals planned',
    'mealPlan.loading': 'Loading meal plan...',
    'mealPlan.generating': 'Generating your personalized meal plan...',
    'mealPlan.daysMeals': '\'s Meals',
    
    // Add Snack Dialog
    'addSnack.title': 'Add AI-Generated Snack',
    'addSnack.generating': 'Generating healthy snack...',
    'addSnack.generateSnack': 'Generate Snack',
    'addSnack.addSnack': 'Add Snack',
    'addSnack.cancel': 'Cancel',
    'addSnack.success': 'AI snack added successfully!',
    'addSnack.error': 'Failed to generate snack',
    'addSnack.caloriesRemaining': 'Calories remaining for today',
    
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
    
    // Days
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
    'day.thursday': 'Thursday',
    'day.friday': 'Friday',
    'day.saturday': 'Saturday',
    'day.sunday': 'Sunday',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.kg': 'kg',
    'common.calories': 'calories',
    'common.protein': 'protein',
    'common.carbs': 'carbs',
    'common.fat': 'fat'
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.mealPlan': 'خطة الوجبات',
    'nav.exercise': 'التمارين',
    'nav.weightTracking': 'تتبع الوزن',
    'nav.profile': 'الملف الشخصي',
    'nav.calorieChecker': 'فاحص السعرات',
    'nav.aiChat': 'الدردشة الذكية',
    'nav.adminPanel': 'لوحة الإدارة',
    'nav.signOut': 'تسجيل الخروج',
    'nav.aiCallsLeft': 'استدعاءات الذكاء الاصطناعي المتبقية',
    'nav.welcomeBack': 'مرحباً بعودتك!',
    'nav.aiPoweredFitness': 'مساعد اللياقة بالذكاء الاصطناعي',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بعودتك',
    'dashboard.currentWeight': 'الوزن الحالي',
    'dashboard.bmiIndex': 'مؤشر كتلة الجسم',
    'dashboard.fitnessGoal': 'هدف اللياقة',
    'dashboard.activityLevel': 'مستوى النشاط',
    'dashboard.aiGenerationsRemaining': 'الأجيال المتبقية للذكاء الاصطناعي',
    'dashboard.fromProfile': 'من الملف الشخصي',
    'dashboard.fromTracking': 'من التتبع',
    'dashboard.completeProfile': 'أكمل الملف الشخصي',
    'dashboard.setYourGoal': 'حدد هدفك',
    'dashboard.notSet': 'غير محدد',
    'dashboard.trackProgress': 'تتبع رحلة لياقتك وحقق أهدافك بالذكاء الاصطناعي.',
    'dashboard.generatingContent': 'إنشاء المحتوى المخصص لك',
    'dashboard.generatingDescription': 'الذكاء الاصطناعي ينشئ خطط الوجبات وبرامج التمارين المخصصة بناءً على ملفك الشخصي...',
    'dashboard.pleaseWait': 'قد يستغرق هذا 30-60 ثانية. يرجى عدم تحديث الصفحة.',
    
    // Quick Actions
    'quickActions.title': 'الإجراءات السريعة',
    'quickActions.logWeight': 'تسجيل الوزن',
    'quickActions.trackProgress': 'تتبع تقدمك',
    'quickActions.logFood': 'تسجيل الطعام',
    'quickActions.checkCalories': 'فحص السعرات',
    'quickActions.mealPlan': 'خطة الوجبات',
    'quickActions.viewWeeklyMeals': 'عرض الوجبات الأسبوعية',
    'quickActions.workout': 'التمرين',
    'quickActions.startExercising': 'بدء التمرين',
    'quickActions.updateGoals': 'تحديث الأهداف',
    'quickActions.modifyTargets': 'تعديل أهدافك',
    'quickActions.schedule': 'الجدولة',
    'quickActions.planWeek': 'خطط أسبوعك',
    
    // Recent Activity
    'recentActivity.title': 'النشاط الأخير',
    'recentActivity.noActivity': 'لا يوجد نشاط بعد. ابدأ بتسجيل وزنك أو إنشاء خطة وجبات!',
    'recentActivity.loggedWeight': 'سجل الوزن',
    'recentActivity.createdMealPlan': 'أنشأ خطة وجبات لأسبوع',
    'recentActivity.createdProgram': 'أنشأ',
    'recentActivity.program': 'برنامج',
    'recentActivity.badges.weight': 'الوزن',
    'recentActivity.badges.nutrition': 'التغذية',
    'recentActivity.badges.exercise': 'التمرين',
    
    // Meal Plan
    'mealPlan.title': 'خطة الوجبات',
    'mealPlan.generateAIPlan': 'إنشاء خطة ذكية',
    'mealPlan.regeneratePlan': 'إعادة إنشاء الخطة',
    'mealPlan.dailyView': 'العرض اليومي',
    'mealPlan.weeklyView': 'العرض الأسبوعي',
    'mealPlan.addSnack': 'إضافة وجبة خفيفة ذكية',
    'mealPlan.yourMealPlan': 'خطة وجباتك',
    'mealPlan.personalizedNutrition': 'تغذية مخصصة لأهداف لياقتك',
    'mealPlan.diet': 'النظام الغذائي',
    'mealPlan.calPerDay': 'سعرة/يوم',
    'mealPlan.mealsPlanned': 'وجبات مخططة',
    'mealPlan.loading': 'تحميل خطة الوجبات...',
    'mealPlan.generating': 'إنشاء خطة وجباتك المخصصة...',
    'mealPlan.daysMeals': 'وجبات ',
    
    // Add Snack Dialog
    'addSnack.title': 'إضافة وجبة خفيفة بالذكاء الاصطناعي',
    'addSnack.generating': 'إنشاء وجبة خفيفة صحية...',
    'addSnack.generateSnack': 'إنشاء وجبة خفيفة',
    'addSnack.addSnack': 'إضافة وجبة خفيفة',
    'addSnack.cancel': 'إلغاء',
    'addSnack.success': 'تمت إضافة الوجبة الخفيفة الذكية بنجاح!',
    'addSnack.error': 'فشل في إنشاء الوجبة الخفيفة',
    'addSnack.caloriesRemaining': 'السعرات المتبقية لليوم',
    
    // BMI Categories
    'bmi.underweight': 'نقص الوزن',
    'bmi.normal': 'طبيعي',
    'bmi.overweight': 'زيادة الوزن',
    'bmi.obese': 'سمنة',
    
    // Activity Levels
    'activity.sedentary': 'مستقر',
    'activity.lightlyActive': 'نشط قليلاً',
    'activity.moderatelyActive': 'نشط معتدل',
    'activity.veryActive': 'نشط جداً',
    'activity.extremelyActive': 'نشط للغاية',
    
    // Fitness Goals
    'goal.weightLoss': 'فقدان الوزن',
    'goal.weightGain': 'زيادة الوزن',
    'goal.muscleGain': 'بناء العضلات',
    'goal.endurance': 'التحمل',
    
    // Days
    'day.monday': 'الاثنين',
    'day.tuesday': 'الثلاثاء',
    'day.wednesday': 'الأربعاء',
    'day.thursday': 'الخميس',
    'day.friday': 'الجمعة',
    'day.saturday': 'السبت',
    'day.sunday': 'الأحد',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.remove': 'إزالة',
    'common.kg': 'كيلو',
    'common.calories': 'سعرات',
    'common.protein': 'بروتين',
    'common.carbs': 'كربوهيدرات',
    'common.fat': 'دهون'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as 'en' | 'ar';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
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
