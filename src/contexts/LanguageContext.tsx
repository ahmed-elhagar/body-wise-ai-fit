
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation function - in a real app, you'd use i18next
const translations = {
  en: {
    'Welcome': 'Welcome',
    'Dashboard': 'Dashboard',
    'Meal Plan': 'Meal Plan',
    'Exercise': 'Exercise',
    'Profile': 'Profile',
    'Coach': 'Coach',
    'Sign In': 'Sign In',
    'Sign Up': 'Sign Up',
    'Sign Out': 'Sign Out',
  },
  ar: {
    'Welcome': 'مرحباً',
    'Dashboard': 'لوحة التحكم',
    'Meal Plan': 'خطة الوجبات',
    'Exercise': 'التمارين',
    'Profile': 'الملف الشخصي',
    'Coach': 'المدرب',
    'Sign In': 'تسجيل الدخول',
    'Sign Up': 'إنشاء حساب',
    'Sign Out': 'تسجيل الخروج',
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, fallback?: string) => {
    return translations[language][key as keyof typeof translations.en] || fallback || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
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
