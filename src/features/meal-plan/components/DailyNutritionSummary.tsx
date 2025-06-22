
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Zap, ShoppingCart, Plus } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

interface DailyNutritionSummaryProps {
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
  onAddSnack: () => void;
}

const DailyNutritionSummary = ({
  totalCalories,
  totalProtein,
  onShowShoppingList,
  onAddSnack
}: DailyNutritionSummaryProps) => {
  const { tFrom, isRTL } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <Card className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-lg rounded-lg">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className="font-bold text-gray-800 text-base mb-1">{String(tMealPlan('todaysSummary'))}</h2>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="font-semibold">{totalCalories}</span>
              <span className="text-xs">{String(tMealPlan('calories'))}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="font-semibold">{totalProtein}g</span>
              <span className="text-xs">{String(tMealPlan('protein'))}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-3 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 shadow-sm rounded-lg"
            onClick={onShowShoppingList}
            aria-label={String(tMealPlan('shoppingList'))}
          >
            <ShoppingCart className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span className="hidden sm:inline">{String(tMealPlan('shoppingList'))}</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-3 text-xs bg-white hover:bg-green-50 border-green-200 text-green-700 shadow-sm rounded-lg"
            onClick={onAddSnack}
            aria-label={String(tMealPlan('addSnack'))}
          >
            <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span className="hidden sm:inline">{String(tMealPlan('addSnack'))}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DailyNutritionSummary;
