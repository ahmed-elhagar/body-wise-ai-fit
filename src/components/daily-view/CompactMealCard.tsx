
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeftRight, Clock, Flame, Zap } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { DailyMeal } from "@/features/meal-plan/types";

interface CompactMealCardProps {
  meal: DailyMeal;
  index: number;
  mealType: string;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index: number) => void;
}

const CompactMealCard = ({
  meal,
  index,
  mealType,
  onShowRecipe,
  onExchangeMeal
}: CompactMealCardProps) => {
  const { tFrom, isRTL } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <Card 
      key={`${meal.id}-${index}`} 
      className="p-3 bg-white/95 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-all duration-200 group rounded-lg"
      role="article"
      aria-labelledby={`meal-${meal.id}-title`}
    >
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Meal Icon & Image */}
        <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {meal.image || meal.image_url ? (
            <img 
              src={meal.image || meal.image_url} 
              alt=""
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          ) : (
            <span className="text-lg" role="img" aria-label={`${mealType} meal`}>
              {getMealTypeIcon(mealType)}
            </span>
          )}
        </div>

        {/* Meal Info */}
        <div className="flex-1 min-w-0">
          <h4 
            id={`meal-${meal.id}-title`}
            className="font-semibold text-gray-800 text-sm mb-1 truncate"
          >
            {meal.name}
          </h4>
          
          {/* Compact Nutrition Row */}
          <div className={`flex items-center gap-3 text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-500" />
              <span className="font-medium">{meal.calories}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-green-500" />
              <span className="font-medium">{meal.protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>{(meal.prepTime || 0) + (meal.cookTime || 0)}m</span>
            </div>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-lg"
            onClick={() => onShowRecipe(meal)}
            aria-label={`${String(tMealPlan('recipe'))} for ${meal.name}`}
          >
            <ChefHat className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600 transition-colors rounded-lg"
            onClick={() => onExchangeMeal(meal, index)}
            aria-label={`${String(tMealPlan('exchange'))} ${meal.name}`}
          >
            <ArrowLeftRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CompactMealCard;
