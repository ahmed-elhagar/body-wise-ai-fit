
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Apply Arabic font class to body when Arabic is selected
    if (isRTL) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [isRTL, i18n.language]);
  
  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('preferred-language', lng);
      
      // Force reload to ensure all components pick up the new language
      window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  const tFrom = (namespace: string) => {
    return (key: string, options?: any) => {
      try {
        const result = t(`${namespace}:${key}`, options);
        return result !== `${namespace}:${key}` ? result : key;
      } catch (error) {
        console.warn(`Translation error for ${namespace}:${key}`, error);
        return key;
      }
    };
  };
  
  return {
    t,
    tFrom,
    language: i18n.language,
    isRTL,
    changeLanguage,
  };
};
