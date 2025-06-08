
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { Meal } from "@/types/meal";

interface MealItemProps {
  meal: any;
  mealIndex: number;
  dayNumber: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, dayNumber: number, mealIndex: number) => void;
}

const MealItem = ({ meal, mealIndex, dayNumber, onShowRecipe, onExchangeMeal }: MealItemProps) => {
  const { t, isRTL } = useI18n();

  const getMealTypeIcon = (mealType: string, mealName: string) => {
    if (mealName.includes('🍎')) return '🍎';
    switch (mealType.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack':
      case 'snack1':
      case 'snack2': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeBadgeColor = (mealType: string, mealName: string) => {
    const isSnack = mealName.includes('🍎') || mealType.toLowerCase().includes('snack');
    if (isSnack) return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'lunch': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    }
  };

  const getMealTypeLabel = (mealType: string, mealName: string) => {
    const isSnack = mealName.includes('🍎') || mealType.toLowerCase().includes('snack');
    if (isSnack) return t('mealPlan.snack');
    
    switch (mealType.toLowerCase()) {
      case 'breakfast': return t('mealPlan.breakfast');
      case 'lunch': return t('mealPlan.lunch');
      case 'dinner': return t('mealPlan.dinner');
      default: return t(`mealPlan.${mealType.toLowerCase()}`) || mealType;
    }
  };

  const isSnack = meal.name.includes('🍎') || meal.meal_type.toLowerCase().includes('snack');

  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-fitness-primary/5 hover:to-pink-50 transition-all duration-200 group/meal">
      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1">
          {/* Meal Header */}
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg">{getMealTypeIcon(meal.meal_type, meal.name)}</span>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium transition-colors ${getMealTypeBadgeColor(meal.meal_type, meal.name)}`}
            >
              {getMealTypeLabel(meal.meal_type, meal.name)}
            </Badge>
            <span className="text-xs text-gray-500 font-medium">
              {(meal.prep_time || 0) + (meal.cook_time || 0)} {t('mealPlan.min')}
            </span>
          </div>
          
          {/* Meal Name */}
          <h5 className="font-medium text-gray-800 text-sm mb-2 group-hover/meal:text-fitness-primary transition-colors">
            {meal.name.replace('🍎 ', '')}
          </h5>
          
          {/* Nutrition Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
            <div className="bg-white/80 p-2 rounded text-center border border-red-100">
              <span className="font-medium text-red-600">{meal.calories || 0}</span>
              <div className="text-gray-500">{t('mealPlan.cal')}</div>
            </div>
            <div className="bg-white/80 p-2 rounded text-center border border-green-100">
              <span className="font-medium text-green-600">{meal.protein || 0}g</span>
              <div className="text-gray-500">{t('mealPlan.protein')}</div>
            </div>
            <div className="bg-white/80 p-2 rounded text-center border border-blue-100">
              <span className="font-medium text-blue-600">{meal.carbs || 0}g</span>
              <div className="text-gray-500">{t('mealPlan.carbs')}</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={`flex flex-col gap-2 ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 hover:bg-fitness-primary hover:text-white transition-all duration-200"
            onClick={() => onShowRecipe({
              ...meal,
              type: meal.meal_type,
              time: '08:00',
              image: getMealTypeIcon(meal.meal_type, meal.name),
              cookTime: meal.cook_time || 0,
              prepTime: meal.prep_time || 0
            })}
          >
            <ChefHat className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 hover:bg-orange-500 hover:text-white transition-all duration-200"
            onClick={() => onExchangeMeal({
              ...meal,
              type: meal.meal_type,
              time: '08:00',
              image: getMealTypeIcon(meal.meal_type, meal.name),
              cookTime: meal.cook_time || 0,
              prepTime: meal.prep_time || 0
            }, dayNumber, mealIndex)}
          >
            <span className="text-xs">⇄</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealItem;
