
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Flame, Zap, Apple, Droplets } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyNutritionSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  onShowShoppingList: () => void;
  onAddSnack: () => void;
}

export const DailyNutritionSummary = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  onShowShoppingList,
  onAddSnack
}: DailyNutritionSummaryProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 border-0 shadow-lg">
      <CardContent className="p-0">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="font-bold text-lg text-gray-800">{t('dailyNutrition')}</h3>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onShowShoppingList}
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
            >
              <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('shoppingList')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onAddSnack}
              className="bg-white hover:bg-green-50 border-green-200 text-green-700"
            >
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('addSnack')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Flame className="w-6 h-6 text-red-500" />
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold text-gray-800">{totalCalories}</div>
              <div className="text-xs text-gray-600">{t('calories')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Zap className="w-6 h-6 text-green-500" />
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold text-gray-800">{totalProtein}g</div>
              <div className="text-xs text-gray-600">{t('protein')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Apple className="w-6 h-6 text-orange-500" />
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold text-gray-800">{totalCarbs}g</div>
              <div className="text-xs text-gray-600">{t('carbs')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Droplets className="w-6 h-6 text-blue-500" />
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold text-gray-800">{totalFat}g</div>
              <div className="text-xs text-gray-600">{t('fat')}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyNutritionSummary;
