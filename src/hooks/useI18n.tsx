
import { useLanguage } from '@/contexts/LanguageContext';

export const useI18n = () => {
  const { language, changeLanguage, t, tFrom, isRTL, isArabic, isEnglish } = useLanguage();

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
