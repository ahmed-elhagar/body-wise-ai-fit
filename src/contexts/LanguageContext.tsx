
import React, { createContext, useContext, ReactNode } from 'react';
import { useI18n } from '@/hooks/useI18n';

interface LanguageContextType {
  t: (key: string) => string;
  language: string;
  isRTL: boolean;
  changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const i18nData = useI18n();
  
  return (
    <LanguageContext.Provider value={i18nData}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export for compatibility
export { useLanguage as useLanguageContext };
