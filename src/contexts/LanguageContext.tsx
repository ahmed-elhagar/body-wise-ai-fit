
import React, { createContext, useContext, ReactNode } from 'react';
import { useI18n } from '@/hooks/useI18n';

interface LanguageContextType {
  t: (key: string, fallback?: string) => string;
  language: string;
  isRTL: boolean;
  changeLanguage: (language: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { t, currentLanguage, isRTL, changeLanguage } = useI18n();

  const contextValue = {
    t: (key: string, fallback?: string) => t(key, fallback || key),
    language: currentLanguage,
    isRTL,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
