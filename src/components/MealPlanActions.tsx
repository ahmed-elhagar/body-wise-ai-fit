
import { Button } from "@/components/ui/button";
import { Calendar, Grid, Plus, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanActionsProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  showAddSnack: boolean;
  showShoppingList: boolean;
}

const MealPlanActions = ({ 
  viewMode, 
  onViewModeChange, 
  onAddSnack,
  onShowShoppingList,
  showAddSnack,
  showShoppingList
}: MealPlanActionsProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="mb-4 sm:mb-6 space-y-4">
      {/* Compact View Toggle */}
      <div className="flex justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20 inline-flex">
          <Button
            variant={viewMode === 'daily' ? 'default' : 'ghost'}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
              viewMode === 'daily' 
                ? 'bg-fitness-gradient text-white shadow-md' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => onViewModeChange('daily')}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t('mealPlan.dailyView')}
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'ghost'}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
              viewMode === 'weekly' 
                ? 'bg-fitness-gradient text-white shadow-md' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => onViewModeChange('weekly')}
            size="sm"
          >
            <Grid className="w-4 h-4 mr-2" />
            {t('mealPlan.weeklyView')}
          </Button>
        </div>
      </div>

      {/* Action Buttons - Floating Style */}
      {(showShoppingList || showAddSnack) && (
        <div className={`flex justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Shopping List Button */}
          {showShoppingList && (
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium rounded-xl px-6 py-3"
              onClick={onShowShoppingList}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('mealPlan.shoppingList')}
            </Button>
          )}

          {/* Add Snack Button - Only in daily view */}
          {showAddSnack && (
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium rounded-xl px-6 py-3"
              onClick={onAddSnack}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('mealPlan.addSnack')}
            </Button>
          )}
        </div>
      )}

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {viewMode === 'daily' 
            ? t('mealPlan.dailyViewHelper') 
            : t('mealPlan.weeklyViewHelper')
          }
        </p>
      </div>
    </div>
  );
};

export default MealPlanActions;
