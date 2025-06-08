
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 w-full justify-start py-2.5 px-3 rounded-lg border-blue-200 bg-white shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <Globe className="w-4 h-4 text-blue-500" />
      <span className="font-medium text-slate-700">
        {language === 'en' ? 'عربي' : 'English'}
      </span>
      <div className="ml-auto text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
        {language.toUpperCase()}
      </div>
    </Button>
  );
};

export default LanguageToggle;
