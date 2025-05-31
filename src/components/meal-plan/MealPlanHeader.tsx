
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanHeaderProps {
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

const MealPlanHeader = ({
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
}: MealPlanHeaderProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[#3D8CFF] to-[#1E60E0] h-[180px] mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col justify-center">
        {/* Title and Actions Row */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-2xl font-bold text-white mb-1">{t('mealPlan.title')}</h1>
              <p className="text-blue-100 text-sm font-medium">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
              <button
                onClick={() => onViewModeChange('daily')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {t('mealPlan.dailyView')}
              </button>
              <button
                onClick={() => onViewModeChange('weekly')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white hover:bg-white/20'
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
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('mealPlan.shoppingList')}
                </Button>
                
                <Button
                  onClick={onRegeneratePlan}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {t('mealPlan.shuffleMeals')}
                </Button>
              </>
            )}
            
            <Button
              onClick={onShowAIDialog}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? t('mealPlan.regenerate') : t('mealPlan.generateAIPlan')}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-lg font-semibold text-white">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-xs text-blue-100 font-medium">{t('mealPlan.totalCalories')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-xs text-blue-100 font-medium">{t('mealPlan.dailyAverage')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-xs text-blue-100 font-medium">{t('mealPlan.totalMeals')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-xs text-blue-100 font-medium">{t('mealPlan.totalProtein')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanHeader;
