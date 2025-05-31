
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const tFrom = (namespace: string) => {
    return (key: string, options?: any) => t(`${namespace}:${key}`, options);
  };
  
  return {
    t,
    tFrom,
    language: i18n.language,
    isRTL,
    changeLanguage,
  };
};
