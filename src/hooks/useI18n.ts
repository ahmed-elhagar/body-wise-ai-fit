
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'ar';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lng: Language) => {
    await i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const tFrom = (namespace: string) => (key: string, options?: any) => {
    return t(`${namespace}:${key}`, options);
  };

  return {
    t,
    tFrom,
    language: i18n.language as Language,
    isRTL: i18n.language === 'ar',
    changeLanguage,
  };
};
