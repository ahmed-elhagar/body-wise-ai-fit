
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, ShoppingCart, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold text-gray-800">{totalCalories}</div>
              <div className="text-xs text-gray-600">{t('common.calories')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold text-gray-800">{totalProtein}g</div>
              <div className="text-xs text-gray-600">{t('common.protein')}</div>
            </div>
          </div>
        </div>
        
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="outline" size="sm" onClick={onShowShoppingList}>
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onAddSnack}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DailyNutritionSummary;
