import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Enhanced i18n configuration for FitFatta
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language settings
    fallbackLng: 'en',
    debug: false,
    
    // Enhanced namespace configuration
    ns: ['common', 'navigation', 'dashboard', 'mealPlan', 'exercise', 'foodTracker', 'profile', 'coach', 'admin', 'errors', 'pro', 'lifePhase'],
    defaultNS: 'common',
    
    // Enhanced interpolation
    interpolation: {
      escapeValue: false,
    },
    
    // Enhanced backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Enhanced language detection
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred-language',
    },
    
    // Enhanced fallback handling
    parseMissingKeyHandler: (key) => {
      console.warn(`[i18n] Missing translation key: ${key}`);
      // Convert key to readable format
      const readable = key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
      return readable.charAt(0).toUpperCase() + readable.slice(1);
    },
  });

// Language change helper with RTL support
export const changeLanguage = async (lng: 'en' | 'ar') => {
  try {
    await i18n.changeLanguage(lng);
    
    // Update document attributes for RTL support
    const isRTL = lng === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // Store preference
    localStorage.setItem('preferred-language', lng);
    
    console.log(`[i18n] Language changed to: ${lng}`);
    return true;
  } catch (error) {
    console.error(`[i18n] Failed to change language to ${lng}:`, error);
    return false;
  }
};

// Get current RTL status
export const isRTL = () => i18n.language === 'ar';

// Get current language
export const getCurrentLanguage = (): 'en' | 'ar' => {
  return (i18n.language as 'en' | 'ar') || 'en';
};

export default i18n;
