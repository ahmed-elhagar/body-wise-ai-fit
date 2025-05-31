
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw
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
    <Card className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white border-0 shadow-2xl overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      
      <CardContent className="relative p-4 lg:p-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <UtensilsCrossed className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{mealPlanT('title')}</h1>
              <p className="text-blue-100 text-lg lg:text-xl font-medium">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {hasWeeklyPlan && (
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-xl font-semibold px-6 py-3 rounded-xl border border-orange-400/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                size="default"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {mealPlanT('regenerate')}
              </Button>
            )}
            
            <Button
              onClick={onShowAIDialog}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl font-semibold px-6 py-3 rounded-xl border border-emerald-400/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              size="default"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {hasWeeklyPlan ? mealPlanT('generateAIPlan') : mealPlanT('generateAIPlan')}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-4 rounded-2xl border border-white/20 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-white">
              {currentWeekOffset === 0 ? mealPlanT('currentWeek') : `${mealPlanT('week')} ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 p-4 rounded-2xl border border-white/20 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-sm text-blue-100 font-medium">{mealPlanT('totalCalories')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-sm text-blue-100 font-medium">{mealPlanT('dailyAverage')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-sm text-blue-100 font-medium">{mealPlanT('totalMeals')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-sm text-blue-100 font-medium">{mealPlanT('totalProtein')}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHero;
