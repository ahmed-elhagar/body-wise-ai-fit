
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
  const { t } = useLanguage();

  return (
    <div className="mb-4 sm:mb-6 flex justify-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* View Mode Toggle - Primary Action */}
          <div className="flex flex-1 bg-gray-50 rounded-xl p-1">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              className={`flex-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                viewMode === 'daily' 
                  ? 'bg-fitness-gradient text-white shadow-lg transform scale-105' 
                  : 'hover:bg-white/80 text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => onViewModeChange('daily')}
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('mealPlan.dailyView')}
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              className={`flex-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                viewMode === 'weekly' 
                  ? 'bg-fitness-gradient text-white shadow-lg transform scale-105' 
                  : 'hover:bg-white/80 text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => onViewModeChange('weekly')}
              size="sm"
            >
              <Grid className="w-4 h-4 mr-2" />
              {t('mealPlan.weeklyView')}
            </Button>
          </div>

          {/* Action Buttons - Secondary Actions */}
          <div className="flex gap-3 lg:gap-4">
            {/* Shopping List Button - Always visible when there are meals */}
            {showShoppingList && (
              <Button
                variant="outline"
                className="flex-1 lg:flex-initial lg:min-w-[160px] text-sm bg-white/90 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium rounded-xl"
                onClick={onShowShoppingList}
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('mealPlan.shoppingList')}
              </Button>
            )}

            {/* Add Snack Button - Only in daily view */}
            {showAddSnack && (
              <Button
                variant="outline"
                className="flex-1 lg:flex-initial lg:min-w-[140px] text-sm bg-white/90 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium rounded-xl"
                onClick={onAddSnack}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('mealPlan.addSnack')}
              </Button>
            )}
          </div>
        </div>

        {/* Contextual Helper Text */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {viewMode === 'daily' 
              ? t('mealPlan.dailyViewHelper') 
              : t('mealPlan.weeklyViewHelper')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealPlanActions;
