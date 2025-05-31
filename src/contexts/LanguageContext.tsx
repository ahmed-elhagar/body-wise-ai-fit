
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t: i18nT, i18n } = useTranslation(['common', 'mealPlan', 'navigation', 'dashboard']);
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'en';
    setLanguageState(storedLanguage as Language);
    i18n.changeLanguage(storedLanguage);
  }, [i18n]);

  useEffect(() => {
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
    // Set document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, i18n]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string, options?: any): string => {
    // Handle nested keys like 'mealPlan.title'
    if (key.includes('.')) {
      const [namespace, ...keyParts] = key.split('.');
      const finalKey = keyParts.join('.');
      const result = i18nT(finalKey, { ns: namespace, ...options });
      return typeof result === 'string' ? result : finalKey;
    }
    const result = i18nT(key, options);
    return typeof result === 'string' ? result : key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
