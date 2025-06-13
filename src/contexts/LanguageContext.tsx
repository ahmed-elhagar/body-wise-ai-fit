
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
  tFrom: (namespace: string) => (key: string) => string;
  isRTL: boolean;
  isArabic: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback for when used outside provider
    return {
      language: 'en',
      changeLanguage: () => {},
      t: (key: string) => key,
      tFrom: () => (key: string) => key,
      isRTL: false,
      isArabic: false,
      isEnglish: true
    };
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(lang);
    }
    
    // Update document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const tFrom = (namespace: string) => (key: string) => {
    return t(`${namespace}.${key}`, key);
  };

  const isRTL = language === 'ar';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  const contextValue = {
    language,
    changeLanguage,
    t: (key: string) => t(key, key), // Fallback to key if translation missing
    tFrom,
    isRTL,
    isArabic,
    isEnglish
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
