
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useI18n } from '@/hooks/useI18n';
import { useState } from 'react';

const LanguageToggle = () => {
  const { language, changeLanguage, isRTL } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  const toggleLanguage = async () => {
    if (isChanging) return;
    
    setIsChanging(true);
    const newLanguage = language === 'en' ? 'ar' : 'en';
    console.log(`Switching language from ${language} to ${newLanguage}`);
    
    try {
      await changeLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChanging(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      disabled={isChanging}
      className={`flex items-center gap-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 w-full justify-start py-2.5 px-3 rounded-lg border-blue-200 bg-white shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <Globe className="w-4 h-4 text-blue-500" />
      <span className={`font-medium text-slate-700 ${isRTL ? 'font-arabic' : ''}`}>
        {language === 'en' ? 'عربي' : 'English'}
      </span>
      <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded transition-all duration-200`}>
        {isChanging ? '...' : language.toUpperCase()}
      </div>
    </Button>
  );
};

export default LanguageToggle;
