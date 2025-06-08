
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeftRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface Meal {
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: any[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  imageUrl?: string;
  image: string;
}

interface MealActionButtonsProps {
  meal: Meal;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealActionButtons = ({ meal, onShowRecipe, onExchangeMeal }: MealActionButtonsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button 
        size="sm" 
        variant="outline" 
        className="flex-1 bg-white/90 hover:bg-fitness-primary hover:text-white transition-all duration-200 shadow-sm text-xs sm:text-sm"
        onClick={() => onShowRecipe(meal)}
      >
        <ChefHat className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
        {t('mealPlan:recipe') || 'Recipe'}
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="flex-1 bg-white/90 hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm text-xs sm:text-sm"
        onClick={() => onExchangeMeal(meal)}
      >
        <ArrowLeftRight className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
        {t('mealPlan:exchange') || 'Exchange'}
      </Button>
    </div>
  );
};

export default MealActionButtons;
