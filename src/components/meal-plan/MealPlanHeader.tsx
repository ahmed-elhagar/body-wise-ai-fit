
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanHeaderProps {
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onShowAIDialog: () => void;
  onShowShoppingList: () => void;
  weeklyStats: {
    totalCalories: number;
    avgDailyCalories: number;
    totalMeals: number;
    totalProtein: number;
  };
  hasWeeklyPlan: boolean;
}

const MealPlanHeader = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  onShowAIDialog,
  onShowShoppingList,
  weeklyStats,
  hasWeeklyPlan
}: MealPlanHeaderProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Week Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('mealPlan:title')}
              </h1>
              <p className="text-blue-100 font-medium">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Week Navigation */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="p-2 hover:bg-white/10 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(0)}
                className={`px-4 font-medium text-white ${
                  currentWeekOffset === 0 ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                Current Week
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="p-2 hover:bg-white/10 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            {hasWeeklyPlan && (
              <Button
                onClick={onShowShoppingList}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('mealPlan:shoppingList')}
              </Button>
            )}

            <Button
              onClick={onShowAIDialog}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? 'Regenerate' : 'Generate Plan'}
            </Button>
          </div>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-sm text-blue-100 font-medium">Total Calories</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-sm text-blue-100 font-medium">Daily Average</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-sm text-blue-100 font-medium">Total Meals</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-sm text-blue-100 font-medium">Total Protein</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHeader;
