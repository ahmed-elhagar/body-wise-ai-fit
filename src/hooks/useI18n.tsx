
import { useLanguage } from '@/contexts/LanguageContext';

export const useI18n = () => {
  const { language, changeLanguage, t, tFrom } = useLanguage();
  
  const isRTL = language === 'ar';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  return {
    language,
    changeLanguage,
    t,
    tFrom,
    isRTL,
    isArabic,
    isEnglish
  };
};
