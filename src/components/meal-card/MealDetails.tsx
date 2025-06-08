
import { Clock, Users, Utensils } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface MealDetailsProps {
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: any[];
}

const MealDetails = ({ prepTime, cookTime, servings, ingredients }: MealDetailsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600 mb-2 sm:mb-3 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Clock className="w-3 h-3" />
        <span>{(prepTime || 0) + (cookTime || 0)} {t('common:min') || 'min'}</span>
      </div>
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Users className="w-3 h-3" />
        <span>{servings} {servings === 1 ? t('common:serving') || 'serving' : t('common:servings') || 'servings'}</span>
      </div>
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Utensils className="w-3 h-3" />
        <span>{(ingredients || []).length} {t('common:ingredients') || 'ingredients'}</span>
      </div>
    </div>
  );
};

export default MealDetails;
