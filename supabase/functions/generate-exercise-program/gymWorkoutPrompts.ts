
import { createGymWorkoutBasePrompt } from './gymWorkoutBasePrompt.ts';
import { getGymWorkoutJsonStructure } from './gymWorkoutJsonStructure.ts';

export const createGymWorkoutPrompt = (userData: any, preferences: any) => {
  const language = preferences?.userLanguage || 'en';
  const isArabic = language === 'ar';
  
  const basePrompt = createGymWorkoutBasePrompt(userData, preferences);
  const jsonStructure = getGymWorkoutJsonStructure(preferences, isArabic);
  
  return basePrompt + jsonStructure;
};
