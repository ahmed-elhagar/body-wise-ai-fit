
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
      lookupLocalStorage: 'preferred-language',
    },
    
    // Add fallback handling
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation key: ${key}`);
      return key;
    },
    
    // Ensure resources are available immediately
    resources: {
      en: {
        common: {
          loading: 'Loading...',
          error: 'Error',
          save: 'Save',
          cancel: 'Cancel',
          close: 'Close',
          yes: 'Yes',
          no: 'No',
          edit: 'Edit',
          delete: 'Delete',
          add: 'Add',
          remove: 'Remove',
          update: 'Update',
          create: 'Create',
          view: 'View',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          continue: 'Continue',
          finish: 'Finish',
          submit: 'Submit',
          search: 'Search',
          filter: 'Filter',
          sort: 'Sort',
          refresh: 'Refresh',
          today: 'Today',
          week: 'Week',
          month: 'Month',
          year: 'Year'
        },
        mealPlan: {
          title: 'Meal Plan',
          smartMealPlanning: 'Smart Meal Planning',
          personalizedNutrition: 'Personalized nutrition plans powered by AI',
          generateAIMealPlan: 'Generate AI Meal Plan',
          generating: 'Generating Plan...',
          addSnack: 'Add Snack',
          cal: 'cal',
          recipe: 'Recipe',
          exchange: 'Exchange',
          currentWeek: 'Current Week',
          selectDay: 'Select Day',
          today: 'Today',
          mealTypes: {
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            dinner: 'Dinner',
            snack1: 'Snack',
            snack2: 'Snack'
          }
        }
      },
      ar: {
        common: {
          loading: 'جارٍ التحميل...',
          error: 'خطأ',
          save: 'حفظ',
          cancel: 'إلغاء',
          close: 'إغلاق',
          yes: 'نعم',
          no: 'لا',
          edit: 'تعديل',
          delete: 'حذف',
          add: 'إضافة',
          remove: 'إزالة',
          update: 'تحديث',
          create: 'إنشاء',
          view: 'عرض',
          back: 'رجوع',
          next: 'التالي',
          previous: 'السابق',
          continue: 'متابعة',
          finish: 'إنهاء',
          submit: 'إرسال',
          search: 'بحث',
          filter: 'تصفية',
          sort: 'ترتيب',
          refresh: 'تحديث',
          today: 'اليوم',
          week: 'أسبوع',
          month: 'شهر',
          year: 'سنة'
        },
        mealPlan: {
          title: 'خطة الوجبات',
          smartMealPlanning: 'تخطيط ذكي للوجبات',
          personalizedNutrition: 'خطط تغذية شخصية مدعومة بالذكاء الاصطناعي',
          generateAIMealPlan: 'توليد خطة وجبات ذكية',
          generating: 'جاري التوليد...',
          addSnack: 'إضافة وجبة خفيفة',
          cal: 'سعرة',
          recipe: 'الوصفة',
          exchange: 'استبدال',
          currentWeek: 'الأسبوع الحالي',
          selectDay: 'اختر اليوم',
          today: 'اليوم',
          mealTypes: {
            breakfast: 'الإفطار',
            lunch: 'الغداء',
            dinner: 'العشاء',
            snack1: 'وجبة خفيفة',
            snack2: 'وجبة خفيفة'
          }
        }
      }
    }
  });

export default i18n;
