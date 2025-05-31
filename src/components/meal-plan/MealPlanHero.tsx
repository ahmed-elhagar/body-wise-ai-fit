
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface MealPlanHeroProps {
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onShowAIDialog: () => void;
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
  weeklyStats,
  hasWeeklyPlan
}: MealPlanHeroProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden">
      <CardContent className="p-4 lg:p-6">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UtensilsCrossed className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{mealPlanT('title')}</h1>
              <p className="text-blue-100 text-base lg:text-lg">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <Button
            onClick={onShowAIDialog}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg font-semibold px-6 py-3"
            size="default"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {hasWeeklyPlan ? mealPlanT('regenerate') : mealPlanT('generateAIPlan')}
          </Button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-3 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-white">
              {currentWeekOffset === 0 ? mealPlanT('currentWeek') : `${mealPlanT('week')} ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 p-3 rounded-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-xl lg:text-2xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-sm text-blue-100">{mealPlanT('totalCalories')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-xl lg:text-2xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-sm text-blue-100">{mealPlanT('dailyAverage')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-xl lg:text-2xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-sm text-blue-100">{mealPlanT('totalMeals')}</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-xl lg:text-2xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-sm text-blue-100">{mealPlanT('totalProtein')}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHero;
