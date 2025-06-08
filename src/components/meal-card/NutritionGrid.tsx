
import { Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NutritionGridProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionGrid = ({ calories, protein, carbs, fat }: NutritionGridProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 sm:mb-4">
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-2 rounded-lg text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Flame className="w-3 h-3 text-red-600" />
        </div>
        <p className="text-xs text-red-700 font-medium">{t('mealPlan.calories')}</p>
        <p className="text-sm font-bold text-red-800">{calories}</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg text-center">
        <p className="text-xs text-green-700 mb-1 font-medium">{t('mealPlan.protein')}</p>
        <p className="text-sm font-bold text-green-800">{protein}g</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg text-center">
        <p className="text-xs text-blue-700 mb-1 font-medium">{t('mealPlan.carbs')}</p>
        <p className="text-sm font-bold text-blue-800">{carbs}g</p>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 rounded-lg text-center">
        <p className="text-xs text-orange-700 mb-1 font-medium">{t('mealPlan.fat')}</p>
        <p className="text-sm font-bold text-orange-800">{fat}g</p>
      </div>
    </div>
  );
};

export default NutritionGrid;
