
import { useLanguage } from "@/contexts/LanguageContext";

export const useMealPlanTranslation = () => {
  const { t } = useLanguage();
  
  const mealPlanT = (key: string, options?: any): string => {
    const fullKey = `mealPlan.${key}`;
    const result = t(fullKey, options);
    
    // If translation failed and we got the key back, try without namespace
    if (result === fullKey || result === key) {
      console.warn(`Missing meal plan translation: ${fullKey}`);
      // Return a user-friendly version of the key
      return key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
    }
    
    return result;
  };

  return { mealPlanT };
};

export const useGeneralTranslation = () => {
  const { t } = useLanguage();
  
  const generalT = (key: string, options?: any): string => {
    const result = t(key, options);
    
    if (result === key) {
      console.warn(`Missing general translation: ${key}`);
      return key.replace(/([A-Z])/g, ' $1').trim();
    }
    
    return result;
  };

  return { generalT };
};

export const useAuthTranslation = () => {
  const { t } = useLanguage();
  
  const authT = (key: string, options?: any): string => {
    const fullKey = `auth.${key}`;
    const result = t(fullKey, options);
    
    if (result === fullKey || result === key) {
      console.warn(`Missing auth translation: ${fullKey}`);
      return key.replace(/([A-Z])/g, ' $1').trim();
    }
    
    return result;
  };

  return { authT };
};

export const useProfileTranslation = () => {
  const { t } = useLanguage();
  
  const profileT = (key: string, options?: any): string => {
    const fullKey = `profile.${key}`;
    const result = t(fullKey, options);
    
    if (result === fullKey || result === key) {
      console.warn(`Missing profile translation: ${fullKey}`);
      return key.replace(/([A-Z])/g, ' $1').trim();
    }
    
    return result;
  };

  return { profileT };
};

export const useWorkoutTranslation = () => {
  const { t } = useLanguage();
  
  const workoutT = (key: string, options?: any): string => {
    const fullKey = `workout.${key}`;
    const result = t(fullKey, options);
    
    if (result === fullKey || result === key) {
      console.warn(`Missing workout translation: ${fullKey}`);
      return key.replace(/([A-Z])/g, ' $1').trim();
    }
    
    return result;
  };

  return { workoutT };
};
