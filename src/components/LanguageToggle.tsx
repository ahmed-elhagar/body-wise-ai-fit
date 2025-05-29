
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm hover:bg-fitness-primary/10 hover:text-fitness-primary transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {language === 'en' ? 'عربي' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
