
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Meal } from "@/types/meal";

interface CompactMealCardProps {
  meal: Meal & { originalIndex?: number };
  index: number;
  mealType: string;
  onShowRecipe: () => void;
  onExchangeMeal: () => void;
}

const CompactMealCard = ({
  meal,
  index,
  mealType,
  onShowRecipe,
  onExchangeMeal
}: CompactMealCardProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{meal.name}</h4>
            <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-4 h-4" />
              <span>{meal.calories || 0} cal</span>
            </div>
          </div>
        </div>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowRecipe}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <ChefHat className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExchangeMeal}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            {t('Exchange')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CompactMealCard;
