
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanLoadingScreenProps {
  message: string;
}

const MealPlanLoadingScreen = ({ message }: MealPlanLoadingScreenProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MealPlanLoadingScreen;
