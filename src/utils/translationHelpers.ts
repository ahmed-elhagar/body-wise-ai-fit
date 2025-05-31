
import { useLanguage } from '@/contexts/LanguageContext';
import { mealPlan as enMealPlan } from '@/contexts/translations/en/mealPlan';
import { mealPlan as arMealPlan } from '@/contexts/translations/ar/mealPlan';

// Translation mappings for direct access
const translations = {
  en: { mealPlan: enMealPlan },
  ar: { mealPlan: arMealPlan }
};

export const useUnifiedTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string): string => {
    try {
      // Split the key to get namespace and actual key
      const [namespace, ...keyParts] = key.split('.');
      const actualKey = keyParts.join('.');
      
      // Access translation directly from our structure
      if (namespace === 'mealPlan' && translations[language as keyof typeof translations]) {
        const translation = translations[language as keyof typeof translations].mealPlan[actualKey as keyof typeof enMealPlan];
        return translation || actualKey;
      }
      
      return actualKey;
    } catch (error) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
  };

  return { t, language };
};

// Helper for meal plan specific translations
export const useMealPlanTranslation = () => {
  const { language } = useLanguage();
  
  const mealPlanT = (key: keyof typeof enMealPlan): string => {
    try {
      const translation = translations[language as keyof typeof translations]?.mealPlan[key];
      return translation || key;
    } catch (error) {
      console.warn(`Meal plan translation not found for key: ${key}`);
      return key;
    }
  };

  return { mealPlanT, language };
};
