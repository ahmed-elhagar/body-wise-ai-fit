
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
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full justify-start ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {language === 'en' ? 'عربي' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
