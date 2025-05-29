
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { enTranslations } from './translations/en';
import { arTranslations } from './translations/ar';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  ar: arTranslations
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const { profile, updateProfile } = useProfile();

  // Load language from profile when available
  useEffect(() => {
    if (profile?.preferred_language && profile.preferred_language !== language) {
      console.log('LanguageContext - Loading language from profile:', profile.preferred_language);
      setLanguageState(profile.preferred_language as Language);
      updateDocumentDirection(profile.preferred_language as Language);
    }
  }, [profile?.preferred_language]);

  // Initialize language on first load from localStorage if no profile
  useEffect(() => {
    if (!profile) {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguageState(savedLanguage);
        updateDocumentDirection(savedLanguage);
      }
    }
  }, [profile]);

  const updateDocumentDirection = (lang: Language) => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.fontFamily = lang === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif';
  };

  const setLanguage = async (lang: Language) => {
    console.log('LanguageContext - Setting language to:', lang);
    setLanguageState(lang);
    
    // Update document direction immediately
    updateDocumentDirection(lang);
    
    // Save to localStorage as backup
    localStorage.setItem('language', lang);
    
    // Update profile if available
    if (profile && updateProfile) {
      try {
        await updateProfile({ preferred_language: lang });
        console.log('LanguageContext - Language updated in profile');
      } catch (error) {
        console.error('LanguageContext - Failed to update language in profile:', error);
      }
    }
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      return key; // Return the key itself as fallback
    }
    return translation;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('useLanguage must be used within a LanguageProvider, using fallback');
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false
    };
  }
  return context;
};
