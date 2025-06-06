
import { useLanguage } from "@/contexts/LanguageContext";

export const useMealPlanTranslations = () => {
  const { t, language } = useLanguage();

  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string) => {
    const translation = t(`mealPlan.${key}`);
    return typeof translation === 'string' && translation !== `mealPlan.${key}` 
      ? translation 
      : fallback;
  };

  const getTranslations = () => {
    if (language === 'ar') {
      return {
        title: 'خطة الوجبات الذكية',
        smartMealPlanning: 'تخطيط ذكي للوجبات',
        personalizedNutrition: 'تغذية مخصصة بالذكاء الاصطناعي',
        generateAIMealPlan: 'إنشاء خطة بالذكاء الاصطناعي',
        generating: 'جاري الإنشاء...',
        mealPlanSettings: 'إعدادات خطة الوجبات',
        includeSnacks: 'تضمين الوجبات الخفيفة',
        maxPrepTime: 'أقصى وقت تحضير',
        cuisine: 'نوع المطبخ',
        aiCredits: 'أرصدة الذكاء الاصطناعي',
        creditsRemaining: 'الأرصدة المتبقية',
        currentWeek: 'الأسبوع الحالي',
        selectDay: 'اختر اليوم',
        today: 'اليوم',
        mealsPerDay: 'وجبات يومياً',
        minutes: 'دقيقة',
        addSnack: 'إضافة وجبة خفيفة',
        noMealPlan: 'لا توجد خطة وجبات',
        generateFirstPlan: 'إنشاء أول خطة وجبات',
        aiPowered: 'مدعوم بالذكاء الاصطناعي',
        cal: 'سعرة',
        recipe: 'وصفة',
        exchange: 'استبدال',
        // Nested meal types object
        mealTypes: {
          breakfast: 'إفطار',
          lunch: 'غداء', 
          dinner: 'عشاء',
          snack1: 'وجبة خفيفة 1',
          snack2: 'وجبة خفيفة 2',
          snack: 'وجبة خفيفة'
        }
      };
    }

    return {
      title: 'Smart Meal Plan',
      smartMealPlanning: 'Smart Meal Planning',
      personalizedNutrition: 'AI-powered personalized nutrition',
      generateAIMealPlan: 'Generate AI Meal Plan',
      generating: 'Generating...',
      mealPlanSettings: 'Meal Plan Settings',
      includeSnacks: 'Include Snacks',
      maxPrepTime: 'Max Prep Time',
      cuisine: 'Cuisine Type',
      aiCredits: 'AI Credits',
      creditsRemaining: 'Credits Remaining',
      currentWeek: 'Current Week',
      selectDay: 'Select Day',
      today: 'Today',
      mealsPerDay: 'meals per day',
      minutes: 'minutes',
      addSnack: 'Add Snack',
      noMealPlan: 'No meal plan available',
      generateFirstPlan: 'Generate your first meal plan',
      aiPowered: 'AI-powered',
      cal: 'cal',
      recipe: 'Recipe',
      exchange: 'Exchange',
      // Nested meal types object
      mealTypes: {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snack1: 'Snack 1',
        snack2: 'Snack 2',
        snack: 'Snack'
      }
    };
  };

  const translations = getTranslations();

  return {
    ...translations,
    language,
    isRTL: language === 'ar'
  };
};
