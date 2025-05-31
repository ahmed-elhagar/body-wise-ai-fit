
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
    <Card className="bg-gradient-to-br from-fitness-primary-600 via-fitness-accent-600 to-fitness-secondary-700 text-white border-0 shadow-2xl overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      
      <CardContent className="relative desktop-spacing">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 section-spacing">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <UtensilsCrossed className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-h1 text-white section-spacing">{mealPlanT('title')}</h1>
              <p className="text-white/90 text-lg lg:text-xl font-semibold">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isShuffling}
                  variant="outline"
                  size="lg"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm shadow-xl font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  {isShuffling ? mealPlanT('shuffling') : mealPlanT('shuffleMeals')}
                </Button>
                
                <Button
                  onClick={handleRegeneratePlan}
                  variant="outline"
                  size="lg"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm shadow-xl font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  {mealPlanT('regenerate')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-8 section-spacing">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm touch-target"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="text-center">
            <div className="text-h2 font-bold text-white">
              {currentWeekOffset === 0 ? mealPlanT('currentWeek') : `${mealPlanT('week')} ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm touch-target"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center bg-white/15 rounded-2xl card-padding backdrop-blur-sm border border-white/20">
              <div className="text-h3 font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-sm text-white/80 font-medium">{mealPlanT('totalCalories')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-2xl card-padding backdrop-blur-sm border border-white/20">
              <div className="text-h3 font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-sm text-white/80 font-medium">{mealPlanT('dailyAverage')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-2xl card-padding backdrop-blur-sm border border-white/20">
              <div className="text-h3 font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-sm text-white/80 font-medium">{mealPlanT('totalMeals')}</div>
            </div>
            
            <div className="text-center bg-white/15 rounded-2xl card-padding backdrop-blur-sm border border-white/20">
              <div className="text-h3 font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-sm text-white/80 font-medium">{mealPlanT('totalProtein')}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHero;
