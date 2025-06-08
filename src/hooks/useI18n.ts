
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  // Ensure we always have a valid language value
  const language = i18n.language || 'en';
  const isRTL = language === 'ar';
  
  useEffect(() => {
    // Apply direction and language attributes
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Apply Arabic font class to body when Arabic is selected
    if (isRTL) {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.remove('font-arabic');
      document.body.classList.add('font-sans');
    }
    
    console.log(`Language applied: ${language}, RTL: ${isRTL}`);
  }, [isRTL, language]);
  
  const changeLanguage = async (lng: string) => {
    try {
      console.log(`Changing language from ${language} to: ${lng}`);
      
      // Change the language in i18next
      await i18n.changeLanguage(lng);
      
      // Store in localStorage
      localStorage.setItem('preferred-language', lng);
      localStorage.setItem('i18nextLng', lng);
      
      console.log(`Language changed successfully to: ${lng}`);
      
      // Force a small delay then reload to ensure all components update
      setTimeout(() => {
        console.log('Reloading page to apply language changes...');
        window.location.reload();
      }, 200);
      
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    }
  };
  
  const tFrom = (namespace: string) => {
    return (key: string, options?: any) => {
      try {
        const fullKey = `${namespace}:${key}`;
        const result = t(fullKey, options);
        
        // If translation failed, try without namespace
        if (result === fullKey) {
          const fallbackResult = t(key, options);
          if (fallbackResult !== key) {
            return fallbackResult;
          }
          console.warn(`Missing translation for ${fullKey}`);
          return key;
        }
        
        return result;
      } catch (error) {
        console.warn(`Translation error for ${namespace}:${key}`, error);
        return key;
      }
    };
  };
  
  return {
    t,
    tFrom,
    language,
    isRTL,
    changeLanguage,
  };
};
