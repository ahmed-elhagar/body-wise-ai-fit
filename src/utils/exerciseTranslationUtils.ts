
import { useI18n } from "@/hooks/useI18n"; // Replace LanguageContext import

export const translateExerciseName = (exerciseName: string) => {
  const { t } = useI18n();
  
  // Simple translation mapping
  const translations: Record<string, string> = {
    'push-ups': t('Push-ups'),
    'squats': t('Squats'),
    'planks': t('Planks'),
    'lunges': t('Lunges')
  };
  
  return translations[exerciseName.toLowerCase()] || exerciseName;
};
