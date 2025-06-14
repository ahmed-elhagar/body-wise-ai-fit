
import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
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
    i18n,
    language: i18n.language as 'en' | 'ar',
    isRTL: i18n.language === 'ar'
  };
};
