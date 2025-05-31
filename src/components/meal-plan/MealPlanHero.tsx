
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
}

const MealPlanHero = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  onShowAIDialog,
  onShowShoppingList,
  onRegeneratePlan,
  weeklyStats,
  hasWeeklyPlan
}: MealPlanHeroProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="h-[180px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden">
      <CardContent className="p-4 lg:p-6 h-full">
        {/* Header Row */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 lg:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-xl lg:text-2xl font-bold text-white">{t('mealPlan.title')}</h1>
              <p className="text-blue-100 text-sm lg:text-base">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 lg:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="sm"
                  className="bg-white/15 border-white/30 text-white hover:bg-white/20 text-xs lg:text-sm px-2 lg:px-3"
                >
                  <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">{t('mealPlan.shoppingList')}</span>
                </Button>
                
                <Button
                  onClick={onRegeneratePlan}
                  variant="outline"
                  size="sm"
                  className="bg-white/15 border-white/30 text-white hover:bg-white/20 text-xs lg:text-sm px-2 lg:px-3"
                >
                  <Shuffle className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">{t('mealPlan.shuffleMeals')}</span>
                </Button>
              </>
            )}
            
            <Button
              onClick={onShowAIDialog}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg font-semibold text-xs lg:text-sm px-2 lg:px-3"
              size="sm"
            >
              <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">
                {hasWeeklyPlan ? t('mealPlan.regenerate') : t('mealPlan.generateAIPlan')}
              </span>
              <span className="sm:hidden">AI</span>
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 lg:gap-6 mb-4 lg:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-2 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </Button>

          <div className="text-center">
            <div className="text-base lg:text-lg font-bold text-white">
              {currentWeekOffset === 0 ? t('mealPlan.currentWeek') : `${t('mealPlan.week')} ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 p-2 rounded-xl"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
            <div className="text-center bg-white/10 rounded-lg p-2 lg:p-3">
              <div className="text-base lg:text-xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.totalCalories')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-lg p-2 lg:p-3">
              <div className="text-base lg:text-xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.dailyAverage')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-lg p-2 lg:p-3">
              <div className="text-base lg:text-xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-xs text-blue-100">{t('mealPlan.totalMeals')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-lg p-2 lg:p-3">
              <div className="text-base lg:text-xl font-bold text-white">
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
