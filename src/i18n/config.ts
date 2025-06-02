
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    ns: ['common', 'navigation', 'dashboard', 'mealPlan', 'exercise', 'profile'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    // Ensure meal plan translations are loaded
    resources: {
      en: {
        mealPlan: {
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
          mealTypes: {
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            dinner: 'Dinner',
            snack1: 'Snack 1',
            snack2: 'Snack 2',
            snack: 'Snack'
          }
        }
      },
      ar: {
        mealPlan: {
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
          mealTypes: {
            breakfast: 'إفطار',
            lunch: 'غداء',
            dinner: 'عشاء',
            snack1: 'وجبة خفيفة 1',
            snack2: 'وجبة خفيفة 2',
            snack: 'وجبة خفيفة'
          }
        }
      }
    }
  });

export default i18n;
