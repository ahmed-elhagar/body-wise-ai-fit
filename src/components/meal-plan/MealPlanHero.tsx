
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  UtensilsCrossed, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shuffle,
  Flame,
  Beef,
  Target
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  dailyStats: {
    calories: number;
    protein: number;
    meals: number;
  };
  hasWeeklyPlan: boolean;
  weeklyPlanId?: string;
  selectedDayNumber: number;
  onRegeneratePlan?: () => void;
}

const MealPlanHero = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  onShowAIDialog,
  weeklyStats,
  dailyStats,
  hasWeeklyPlan,
  onRegeneratePlan
}: MealPlanHeroProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-fitness-primary-500 via-fitness-primary-600 to-fitness-primary-700 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-6">
        {/* Header with Title and Action Buttons */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Meal Plan</h1>
              <p className="text-fitness-primary-100 text-sm lg:text-base font-medium">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && onRegeneratePlan && (
              <Button
                onClick={onRegeneratePlan}
                variant="outline"
                size="sm"
                className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50 backdrop-blur-sm"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle Meals
              </Button>
            )}
            
            <Button
              onClick={onShowAIDialog}
              className="bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 shadow-lg font-semibold"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? 'Regenerate Plan' : 'Generate AI Plan'}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {currentWeekOffset === 0 ? 'Current Week' : 
               currentWeekOffset > 0 ? `Week +${currentWeekOffset}` : `Week ${currentWeekOffset}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Daily Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-fitness-orange-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">Today's Calories</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {dailyStats.calories.toLocaleString()}
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-fitness-accent-500 rounded-lg flex items-center justify-center">
                  <Beef className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">Today's Protein</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {dailyStats.protein.toFixed(1)}g
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">Weekly Average</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {weeklyStats.avgDailyCalories.toLocaleString()} cal/day
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanHero;
