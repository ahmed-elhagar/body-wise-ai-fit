
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";
import { useMealShuffle } from "@/hooks/useMealShuffle";

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
  weeklyPlanId?: string;
}

const MealPlanHero = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  onShowAIDialog,
  weeklyStats,
  hasWeeklyPlan,
  weeklyPlanId
}: MealPlanHeroProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  const { shuffleMeals, isShuffling } = useMealShuffle();

  const handleShuffleMeals = () => {
    if (weeklyPlanId) {
      shuffleMeals(weeklyPlanId);
    }
  };

  const handleRegeneratePlan = () => {
    onShowAIDialog();
  };

  return (
    <Card className="bg-gradient-to-br from-fitness-primary-600 via-fitness-accent-600 to-fitness-secondary-700 text-white border-0 shadow-xl overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardContent className="relative p-4 lg:p-6">
        {/* Compact Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <UtensilsCrossed className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">{mealPlanT('title')}</h1>
              <p className="text-white/90 text-sm lg:text-base font-medium">
                {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, 6), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isShuffling}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm shadow-lg font-medium transform hover:scale-105 transition-all duration-300"
                >
                  <Shuffle className="w-4 h-4 mr-1.5" />
                  {isShuffling ? mealPlanT('shuffling') || 'Shuffling...' : mealPlanT('shuffleMeals')}
                </Button>
                
                <Button
                  onClick={handleRegeneratePlan}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm shadow-lg font-medium transform hover:scale-105 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  {mealPlanT('regenerate')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Compact Week Navigation */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {currentWeekOffset === 0 ? mealPlanT('currentWeek') : `${mealPlanT('week')} ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Compact Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="text-center bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/20">
              <div className="text-lg lg:text-xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-xs text-white/80 font-medium">{mealPlanT('totalCalories')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/20">
              <div className="text-lg lg:text-xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-xs text-white/80 font-medium">{mealPlanT('dailyAverage')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/20">
              <div className="text-lg lg:text-xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-xs text-white/80 font-medium">{mealPlanT('totalMeals')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/20">
              <div className="text-lg lg:text-xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-xs text-white/80 font-medium">{mealPlanT('totalProtein')}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHero;
