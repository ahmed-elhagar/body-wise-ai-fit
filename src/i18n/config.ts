
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false, // Disable debug in production
    
    ns: ['common', 'navigation', 'dashboard', 'mealPlan', 'exercise', 'profile'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Add error handling for missing files
      requestOptions: {
        cache: 'default'
      }
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred-language',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      convertDetectedLanguage: (lng) => {
        // Ensure we only use supported languages
        return ['en', 'ar'].includes(lng) ? lng : 'en';
      }
    },
    
    // Improved error handling
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation key: ${key}`);
      return key.split('.').pop() || key;
    },
    
    // Load resources immediately to prevent FOUC
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
    },
    
    // Ensure proper language switching
    react: {
      useSuspense: false
    }
  });

// Add language change listener for debugging
i18n.on('languageChanged', (lng) => {
  console.log(`i18next language changed to: ${lng}`);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// Add error listeners
i18n.on('failedLoading', (lng, ns, msg) => {
  console.warn(`Failed loading ${lng}/${ns}: ${msg}`);
});

export default i18n;
