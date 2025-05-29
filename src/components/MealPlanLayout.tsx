
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanLayoutProps {
  children: React.ReactNode;
}

const MealPlanLayout = ({ children }: MealPlanLayoutProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} transition-all duration-300`}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MealPlanLayout;
