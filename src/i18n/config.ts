
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
    debug: false,
    
    ns: ['common', 'navigation', 'dashboard', 'mealPlan', 'exercise', 'profile', 'auth', 'goals', 'progress'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'default'
      }
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred-language',
      convertDetectedLanguage: (lng) => {
        return ['en', 'ar'].includes(lng) ? lng : 'en';
      }
    },
    
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation key: ${key}`);
      return key.split('.').pop() || key;
    },
    
    react: {
      useSuspense: false
    }
  });

// Add language change listener for RTL support
i18n.on('languageChanged', (lng) => {
  console.log(`i18next language changed to: ${lng}`);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  
  // Apply Arabic font class
  if (lng === 'ar') {
    document.body.classList.add('font-arabic');
    document.body.classList.remove('font-sans');
  } else {
    document.body.classList.remove('font-arabic');
    document.body.classList.add('font-sans');
  }
});

// Add error listeners
i18n.on('failedLoading', (lng, ns, msg) => {
  console.warn(`Failed loading ${lng}/${ns}: ${msg}`);
});

export default i18n;
