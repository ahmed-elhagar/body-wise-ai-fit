
import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language || 'en';
  
  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('preferred-language', language);
  };

  const tFrom = (namespace: string) => {
    return (key: string, fallback?: string) => {
      return t(`${namespace}.${key}`, fallback || key);
    };
  };
  
  return {
    t,
    tFrom,
    isRTL,
    currentLanguage,
    changeLanguage,
    language: currentLanguage
  };
};
