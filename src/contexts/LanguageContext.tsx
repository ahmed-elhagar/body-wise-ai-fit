
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';

export type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const { t: i18nT, i18n: i18nInstance } = useTranslation(['common', 'mealPlan', 'navigation', 'dashboard', 'profile']);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Change i18next language
    if (i18nInstance && typeof i18nInstance.changeLanguage === 'function') {
      await i18nInstance.changeLanguage(lang);
    }
  };

  const t = (key: string, options?: any): string => {
    try {
      // Handle nested keys like 'mealPlan.title'
      if (key.includes('.')) {
        const [namespace, ...keyParts] = key.split('.');
        const finalKey = keyParts.join('.');
        const result = i18nT(finalKey, { ns: namespace, ...options });
        return typeof result === 'string' && result !== finalKey ? result : finalKey;
      }
      
      // Try common namespace first, then fallback to the key itself
      const result = i18nT(key, { ns: 'common', ...options });
      return typeof result === 'string' && result !== key ? result : key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Initialize i18next language on mount
  useEffect(() => {
    if (i18nInstance && typeof i18nInstance.changeLanguage === 'function') {
      i18nInstance.changeLanguage(language);
    }
  }, [i18nInstance, language]);

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
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false,
    };
  }
  return context;
};
