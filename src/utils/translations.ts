
import { useI18n } from '@/hooks/useI18n';

// Centralized translation utilities
export const useTranslations = () => {
  const { t, isRTL } = useI18n();

  // Common translation helpers
  const common = (key: string) => t(`common:${key}`);
  const navigation = (key: string) => t(`navigation:${key}`);
  const dashboard = (key: string) => t(`dashboard:${key}`);
  const auth = (key: string) => t(`auth:${key}`);
  const profile = (key: string) => t(`profile:${key}`);
  const mealPlan = (key: string) => t(`mealPlan:${key}`);
  const exercise = (key: string) => t(`exercise:${key}`);
  const goals = (key: string) => t(`goals:${key}`);
  const progress = (key: string) => t(`progress:${key}`);

  // RTL helper class
  const rtlClass = (baseClass: string, rtlClass?: string) => {
    return `${baseClass} ${isRTL ? (rtlClass || 'font-arabic') : ''}`;
  };

  // Flex direction helper
  const flexDir = (reverse: boolean = false) => {
    return isRTL ? (reverse ? 'flex-row' : 'flex-row-reverse') : (reverse ? 'flex-row-reverse' : 'flex-row');
  };

  return {
    t,
    isRTL,
    common,
    navigation,
    dashboard,
    auth,
    profile,
    mealPlan,
    exercise,
    goals,
    progress,
    rtlClass,
    flexDir
  };
};

// Translation validation helper
export const validateTranslation = (key: string, translation: string): boolean => {
  return translation !== key && translation.length > 0;
};

// Missing translation logger
export const logMissingTranslation = (namespace: string, key: string, language: string) => {
  console.warn(`Missing translation: ${namespace}:${key} for language: ${language}`);
};
