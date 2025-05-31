
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
  Target
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
    <div className="space-y-3">
      {/* Main Hero Card - Compact */}
      <Card className="bg-gradient-to-br from-fitness-primary-600 via-fitness-accent-600 to-fitness-secondary-700 text-white border-0 shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
        
        <CardContent className="relative p-3 lg:p-4">
          {/* Compact Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <UtensilsCrossed className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-white">{mealPlanT('title')}</h1>
                <p className="text-white/90 text-xs lg:text-sm font-medium">
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
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm shadow-lg font-medium transform hover:scale-105 transition-all duration-300 text-xs px-2 py-1"
                  >
                    <Shuffle className="w-3 h-3 mr-1" />
                    {isShuffling ? mealPlanT('shuffling') || 'Shuffling...' : mealPlanT('shuffleMeals')}
                  </Button>
                  
                  <Button
                    onClick={handleRegeneratePlan}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm shadow-lg font-medium transform hover:scale-105 transition-all duration-300 text-xs px-2 py-1"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    {mealPlanT('regenerate')}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Week Navigation - Compact */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <div className="text-sm font-bold text-white">
                {currentWeekOffset === 0 ? mealPlanT('currentWeek') : `${mealPlanT('week')} ${Math.abs(currentWeekOffset) + 1}`}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shortcut Cards Row */}
      {hasWeeklyPlan && (
        <div className="grid grid-cols-3 gap-2">
          {/* Daily Calories Card */}
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-xs text-white/90 font-medium">cal</div>
            </CardContent>
          </Card>

          {/* Daily Protein Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">
                {(weeklyStats.totalProtein / 7).toFixed(1)}g
              </div>
              <div className="text-xs text-white/90 font-medium">Protein</div>
            </CardContent>
          </Card>

          {/* Daily Meals Card */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">
                {Math.round(weeklyStats.totalMeals / 7)}
              </div>
              <div className="text-xs text-white/90 font-medium">Meals</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MealPlanHero;
