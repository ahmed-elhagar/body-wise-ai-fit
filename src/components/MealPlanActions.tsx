
import { Button } from "@/components/ui/button";
import { Calendar, Grid, Plus, ShoppingCart, Sparkles } from "lucide-react";
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
    <div className="mb-6 space-y-6">
      {/* Enhanced View Toggle */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-white to-health-soft backdrop-blur-sm rounded-2xl p-2 shadow-health border-2 border-health-border-light inline-flex">
          <Button
            variant={viewMode === 'daily' ? 'default' : 'ghost'}
            className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
              viewMode === 'daily' 
                ? 'bg-health-gradient text-white shadow-health transform scale-105' 
                : 'hover:bg-health-soft text-health-text-secondary hover:text-health-primary'
            }`}
            onClick={() => onViewModeChange('daily')}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t('mealPlan.dailyView')}
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'ghost'}
            className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
              viewMode === 'weekly' 
                ? 'bg-health-gradient text-white shadow-health transform scale-105' 
                : 'hover:bg-health-soft text-health-text-secondary hover:text-health-primary'
            }`}
            onClick={() => onViewModeChange('weekly')}
            size="sm"
          >
            <Grid className="w-4 h-4 mr-2" />
            {t('mealPlan.weeklyView')}
          </Button>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      {(showShoppingList || showAddSnack) && (
        <div className={`flex justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Enhanced Shopping List Button */}
          {showShoppingList && (
            <Button
              variant="outline"
              className="bg-gradient-to-br from-white to-health-soft-blue backdrop-blur-sm border-2 border-health-primary/30 text-health-primary hover:bg-health-soft-blue hover:border-health-primary hover:text-health-primary transition-all duration-300 shadow-soft hover:shadow-health font-semibold rounded-xl px-6 py-3 transform hover:scale-105"
              onClick={onShowShoppingList}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('mealPlan.shoppingList')}
            </Button>
          )}

          {/* Enhanced Add Snack Button */}
          {showAddSnack && (
            <Button
              variant="outline"
              className="bg-gradient-to-br from-white to-health-soft-green backdrop-blur-sm border-2 border-health-secondary/30 text-health-secondary hover:bg-health-soft-green hover:border-health-secondary hover:text-health-secondary transition-all duration-300 shadow-soft hover:shadow-success font-semibold rounded-xl px-6 py-3 transform hover:scale-105"
              onClick={onAddSnack}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('mealPlan.addSnack')}
            </Button>
          )}
        </div>
      )}

      {/* Enhanced Helper Text */}
      <div className="text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-health-border-light shadow-soft inline-block">
          <p className="text-xs text-health-text-muted font-medium flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
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
