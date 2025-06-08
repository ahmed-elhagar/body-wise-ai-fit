
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
    setIsRTL(i18n.language === 'ar');
    
    // Update document direction and language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    console.log(`Switching language from ${currentLanguage} to ${newLanguage}`);
    
    try {
      await i18n.changeLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
      setIsRTL(newLanguage === 'ar');
      
      // Store in localStorage
      localStorage.setItem('preferred-language', newLanguage);
      
      // Update document direction and language immediately
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
      
      console.log(`Language changed to ${newLanguage}, RTL: ${newLanguage === 'ar'}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 w-full justify-start py-2.5 px-3 rounded-lg border-blue-200 bg-white shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <Globe className="w-4 h-4 text-blue-500" />
      <span className={`font-medium text-slate-700 ${isRTL ? 'font-arabic' : ''}`}>
        {currentLanguage === 'en' ? 'عربي' : 'English'}
      </span>
      <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded transition-all duration-200`}>
        {currentLanguage.toUpperCase()}
      </div>
    </Button>
  );
};

export default LanguageToggle;
