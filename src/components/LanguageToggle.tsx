
import { Button } from "@/components/ui/button";
import { Globe, Check, Loader2 } from "lucide-react";
import { useI18n } from '@/hooks/useI18n';
import { useState } from 'react';
import { toast } from "sonner";

const LanguageToggle = () => {
  const { language, changeLanguage, isRTL } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = language || 'en';
  const nextLanguage = currentLanguage === 'en' ? 'ar' : 'en';
  const nextLanguageLabel = nextLanguage === 'ar' ? 'العربية' : 'English';

  const handleLanguageChange = async () => {
    if (isChanging) return;
    
    setIsChanging(true);
    console.log(`Starting language change: ${currentLanguage} → ${nextLanguage}`);
    
    try {
      // Show loading toast
      toast.loading(`Switching to ${nextLanguageLabel}...`, {
        id: 'language-change'
      });
      
      await changeLanguage(nextLanguage);
      
      // Success toast (will be shown briefly before reload)
      toast.success(`Language changed to ${nextLanguageLabel}`, {
        id: 'language-change'
      });
      
    } catch (error) {
      console.error('Language change failed:', error);
      toast.error('Failed to change language. Please try again.', {
        id: 'language-change'
      });
      setIsChanging(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLanguageChange}
      disabled={isChanging}
      className={`
        flex items-center gap-2 text-sm transition-all duration-200 
        w-full justify-start py-2.5 px-3 rounded-lg border-blue-200 
        bg-white shadow-sm hover:bg-blue-50 hover:text-blue-700 
        hover:border-blue-300 active:scale-[0.98]
        ${isRTL ? 'flex-row-reverse' : ''}
        ${isChanging ? 'cursor-not-allowed opacity-70' : ''}
      `}
    >
      {isChanging ? (
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      ) : (
        <Globe className="w-4 h-4 text-blue-500" />
      )}
      
      <span className={`font-medium text-slate-700 ${isRTL ? 'font-arabic' : ''}`}>
        {isChanging ? 'Switching...' : nextLanguageLabel}
      </span>
      
      <div className={`
        ${isRTL ? 'mr-auto' : 'ml-auto'} 
        text-xs px-2 py-1 rounded transition-all duration-200
        ${isChanging 
          ? 'text-blue-600 bg-blue-100' 
          : 'text-gray-500 bg-gray-100'
        }
      `}>
        {isChanging ? (
          <span className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            ...
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            {currentLanguage.toUpperCase()}
          </span>
        )}
      </div>
    </Button>
  );
};

export default LanguageToggle;
