
import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const tFrom = (namespace: string) => {
    return (key: string) => t(`${namespace}.${key}`);
  };
  
  return {
    t,
    tFrom,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    isRTL: i18n.language === 'ar'
  };
};
