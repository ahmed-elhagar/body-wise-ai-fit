
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'ar';

export interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  changeLanguage: (lng: Language) => void;
  t: (key: string, options?: any) => string;
  setLanguage: (lng: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferred-language') as Language;
    if (storedLanguage && ['en', 'ar'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    const rtl = language === 'ar';
    setIsRTL(rtl);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = async (lng: Language) => {
    try {
      await i18n.changeLanguage(lng);
      setLanguageState(lng);
      localStorage.setItem('preferred-language', lng);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const setLanguage = (lng: Language) => {
    changeLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      isRTL,
      changeLanguage,
      setLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
