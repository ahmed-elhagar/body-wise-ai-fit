
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanLayoutProps {
  children: React.ReactNode;
}

const MealPlanLayout = ({ children }: MealPlanLayoutProps) => {
  const { isRTL, language } = useLanguage();

  return (
    <div className={`min-h-screen bg-fitness-neutral-50 flex ${isRTL ? 'rtl' : 'ltr'} ${language === 'ar' ? 'font-arabic' : ''}`}>
      <Navigation />
      <div className={`flex-1 transition-all duration-300 ${
        isRTL 
          ? 'mr-0 md:mr-64' 
          : 'ml-0 md:ml-64'
      }`}>
        <div className="container mx-auto px-3 py-4 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MealPlanLayout;
