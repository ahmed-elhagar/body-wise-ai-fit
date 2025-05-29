
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanLayoutProps {
  children: React.ReactNode;
}

const MealPlanLayout = ({ children }: MealPlanLayoutProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-fitness-soft-green via-white to-fitness-soft-blue flex ${isRTL ? 'rtl' : 'ltr'} relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-fitness-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-fitness-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-fitness-accent/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-72' : 'ml-0 md:ml-72'} transition-all duration-300 relative z-10`}>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          <div className="backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanLayout;
