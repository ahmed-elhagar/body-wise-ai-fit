
import { type Language } from '@/contexts/LanguageContext';

export const translateExerciseName = (name: string, language: Language): string => {
  // Simple fallback - in a real app you'd have a translation database
  if (language === 'ar') {
    const translations: Record<string, string> = {
      'Push-ups': 'تمارين الضغط',
      'Squats': 'القرفصاء',
      'Plank': 'البلانك',
      'Lunges': 'الطعنات',
      'Burpees': 'البيربي'
    };
    return translations[name] || name;
  }
  return name;
};

export const translateBodyPart = (bodyPart: string, language: Language): string => {
  if (language === 'ar') {
    const translations: Record<string, string> = {
      'chest': 'الصدر',
      'legs': 'الساقين',
      'core': 'البطن',
      'arms': 'الذراعين',
      'back': 'الظهر'
    };
    return translations[bodyPart] || bodyPart;
  }
  return bodyPart;
};
