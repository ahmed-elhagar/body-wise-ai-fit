
import { createHomeWorkoutBasePrompt } from './homeWorkoutBasePrompt.ts';
import { getHomeWorkoutJsonStructure } from './homeWorkoutJsonStructure.ts';

export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  const language = preferences?.userLanguage || 'en';
  const isArabic = language === 'ar';
  
  const basePrompt = createHomeWorkoutBasePrompt(userData, preferences);
  const jsonStructure = getHomeWorkoutJsonStructure(preferences, isArabic);
  
  return basePrompt + jsonStructure;
};
