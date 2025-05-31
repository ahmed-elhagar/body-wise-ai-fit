
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
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
  const { t, i18n } = useTranslation();
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

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
