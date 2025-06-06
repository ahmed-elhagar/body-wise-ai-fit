
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    // Fallback implementation when LanguageContext is not available
    return {
      language: 'en' as const,
      isRTL: false,
      t: (key: string) => key, // Just return the key as fallback
      changeLanguage: () => {},
    };
  }
  
  return context;
};
