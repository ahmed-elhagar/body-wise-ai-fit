
import { Clock, Users, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealDetailsProps {
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: any[];
}

const MealDetails = ({ prepTime, cookTime, servings, ingredients }: MealDetailsProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600 mb-2 sm:mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Clock className="w-3 h-3" />
        <span>{(prepTime || 0) + (cookTime || 0)} {t('mealPlan.min')}</span>
      </div>
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Users className="w-3 h-3" />
        <span>{servings} {t('mealPlan.serving')}</span>
      </div>
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Utensils className="w-3 h-3" />
        <span>{(ingredients || []).length} {t('mealPlan.ingredients')}</span>
      </div>
    </div>
  );
};

export default MealDetails;
