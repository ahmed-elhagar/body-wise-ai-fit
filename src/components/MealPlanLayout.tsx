
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanLayoutProps {
  children: React.ReactNode;
}

const MealPlanLayout = ({ children }: MealPlanLayoutProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-fitness-neutral-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-72' : 'ml-0 md:ml-72'} transition-all duration-300`}>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MealPlanLayout;
