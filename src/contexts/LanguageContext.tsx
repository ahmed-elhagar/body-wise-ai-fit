
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  isRTL: boolean;
  t: (key: string) => string;
  changeLanguage: (lang: 'en' | 'ar') => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple translation fallback
const translations: Record<string, Record<string, string>> = {
  en: {
    'exercise.homeWorkout': 'Home Workout',
    'exercise.gymWorkout': 'Gym Workout',
    'exercise.home': 'Home',
    'exercise.gym': 'Gym',
    'profile.overview': 'Overview',
    'profile.basic': 'Basic Info',
    'profile.health': 'Health',
    'profile.goals': 'Goals',
    'profile.settings': 'Settings',
  },
  ar: {
    'exercise.homeWorkout': 'تمرين منزلي',
    'exercise.gymWorkout': 'تمرين في الجيم',
    'exercise.home': 'المنزل',
    'exercise.gym': 'الجيم',
    'profile.overview': 'نظرة عامة',
    'profile.basic': 'المعلومات الأساسية',
    'profile.health': 'الصحة',
    'profile.goals': 'الأهداف',
    'profile.settings': 'الإعدادات',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
  };

  const value: LanguageContextType = {
    language,
    isRTL: language === 'ar',
    t,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export the useLanguage hook from this file since components expect it here
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
