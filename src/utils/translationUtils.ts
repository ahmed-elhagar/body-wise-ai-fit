
import { useI18n } from '@/hooks/useI18n';

// Comprehensive translation utility with fallback support
export const useTranslationWithFallback = () => {
  const { t, language } = useI18n();

  // Enhanced translation function with debugging and fallback
  const safeTranslate = (key: string, fallback?: string): string => {
    const translation = t(key);
    
    // If translation is the same as key, it means translation is missing
    if (translation === key) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      
      // Return fallback if provided, otherwise return a user-friendly version of the key
      if (fallback) return fallback;
      
      // Convert key to readable format as last resort
      return key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
    }
    
    return translation;
  };

  // Specific meal plan translation helpers
  const mealPlanTranslate = (key: string, fallback?: string): string => {
    return safeTranslate(`mealPlan.${key}`, fallback);
  };

  const cuisineTranslate = (cuisineType: string): string => {
    return safeTranslate(`mealPlan.cuisine.${cuisineType}`, cuisineType);
  };

  const dayTranslate = (day: string): string => {
    return safeTranslate(day.toLowerCase(), day);
  };

  return {
    t: safeTranslate,
    mealPlan: mealPlanTranslate,
    cuisine: cuisineTranslate,
    day: dayTranslate,
    language
  };
};

// Common meal plan translation keys for easy reference
export const MEAL_PLAN_KEYS = {
  GENERATE_AI_PLAN: 'generateAIMealPlan',
  MAX_PREP_TIME: 'maxPrepTime',
  GENERATE_SEVEN_DAY_PLAN: 'generateSevenDayPlan',
  LEAVE_EMPTY_NATIONALITY: 'leaveEmptyNationality',
  MINUTES: 'minutes',
  CUISINE: 'cuisine',
  MEAL_TYPES: 'mealTypes',
  INCLUDE_SNACKS: 'includeSnacks'
} as const;

// Cuisine types mapping for consistent translation
export const CUISINE_TYPES = {
  MIXED: 'mixed',
  MEDITERRANEAN: 'mediterranean',
  ASIAN: 'asian',
  MEXICAN: 'mexican',
  ITALIAN: 'italian',
  INDIAN: 'indian',
  MIDDLE_EASTERN: 'middleEastern',
  AMERICAN: 'american',
  FRENCH: 'french',
  CHINESE: 'chinese',
  JAPANESE: 'japanese',
  KOREAN: 'korean',
  THAI: 'thai'
} as const;
