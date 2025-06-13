
import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t,
    i18n,
    language: i18n.language as 'en' | 'ar',
    isRTL: i18n.language === 'ar'
  };
};
