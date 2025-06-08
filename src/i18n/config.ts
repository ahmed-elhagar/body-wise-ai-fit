
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
    debug: true, // Enable for debugging
    
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
        }
      }
    }
  });

export default i18n;
