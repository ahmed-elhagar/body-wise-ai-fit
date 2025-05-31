
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanHeroProps {
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onShowAIDialog: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  weeklyStats: {
    totalCalories: number;
    totalProtein: number;
    totalMeals: number;
    avgDailyCalories: number;
  };
  hasWeeklyPlan: boolean;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

const MealPlanHero = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  onShowAIDialog,
  onShowShoppingList,
  onRegeneratePlan,
  weeklyStats,
  hasWeeklyPlan,
  viewMode,
  onViewModeChange
}: MealPlanHeroProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="h-[180px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden">
      <CardContent className="p-6 h-full">
        {/* Header Row */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-2xl font-bold text-white">{t('mealPlan.title')}</h1>
              <p className="text-blue-100 text-sm">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* View Mode Toggle */}
            <div className="flex bg-white/15 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('daily')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {t('mealPlan.dailyView')}
              </button>
              <button
                onClick={() => onViewModeChange('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {t('mealPlan.weeklyView')}
              </button>
            </div>

            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('mealPlan.shoppingList')}
                </Button>
                
                <Button
                  onClick={onRegeneratePlan}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {t('mealPlan.shuffleMeals')}
                </Button>
              </>
            )}
            
            <Button
              onClick={onShowAIDialog}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg font-semibold"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? t('mealPlan.regenerate') : t('mealPlan.generateAIPlan')}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {currentWeekOffset === 0 ? t('mealPlan.currentWeek') : `${t('mealPlan.week')} ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.totalCalories')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.dailyAverage')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.totalMeals')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.totalProtein')}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHero;
