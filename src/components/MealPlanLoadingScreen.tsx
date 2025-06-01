
import { useI18n } from "@/hooks/useI18n";

interface MealPlanLoadingScreenProps {
  message: string;
}

const MealPlanLoadingScreen = ({ message }: MealPlanLoadingScreenProps) => {
  const { isRTL } = useI18n();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center">
        <div className="w-12 h-12 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default MealPlanLoadingScreen;
