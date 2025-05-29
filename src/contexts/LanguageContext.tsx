
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { enTranslations } from './translations/en';
import { arTranslations } from './translations/ar';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Flatten nested objects for translation lookup with better error handling
const flattenTranslations = (obj: any, prefix = ''): Record<string, string> => {
  const flattened: Record<string, string> = {};
  
  if (!obj || typeof obj !== 'object') {
    console.warn('Invalid translation object:', obj);
    return flattened;
  }
  
  Object.keys(obj).forEach(key => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    } else if (typeof value === 'string') {
      flattened[newKey] = value;
    } else {
      console.warn(`Skipping non-string translation value for key: ${newKey}`, value);
    }
  });
  
  return flattened;
};

const translations: Record<Language, Record<string, string>> = {
  en: flattenTranslations(enTranslations),
  ar: flattenTranslations(arTranslations)
};

// Debug translation loading
console.log('🌐 Translation system initialized:', {
  englishKeys: Object.keys(translations.en).length,
  arabicKeys: Object.keys(translations.ar).length,
  sampleEnglishKeys: Object.keys(translations.en).slice(0, 10),
  sampleArabicKeys: Object.keys(translations.ar).slice(0, 10)
});

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
      
      // Return a more user-friendly fallback
      const fallback = key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
      return fallback;
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
      t: (key: string) => {
        console.warn(`Translation accessed outside provider: ${key}`);
        return key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
      },
      isRTL: false
    };
  }
  return context;
};
