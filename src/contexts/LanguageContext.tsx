
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './translations/en';
import './translations/ar';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  
  // Safe translation hook with fallback
  let t: (key: string) => string;
  let i18nReady = true;
  
  try {
    const { t: translationFn, ready } = useTranslation();
    t = ready ? translationFn : (key: string) => key;
    i18nReady = ready;
  } catch (error) {
    console.warn('i18next not initialized, using fallback translation');
    t = (key: string) => key; // Fallback: return the key itself
    i18nReady = false;
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Only render content when i18n is ready or provide fallback
  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Provide fallback context
    return {
      language: 'en' as const,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false,
    };
  }
  return context;
};
