
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Sparkles, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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
    <Card className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white border-0 shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title and Week Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Meal Plan
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Week Navigation */}
            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="p-2 hover:bg-white/20 text-white h-9 w-9 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant={currentWeekOffset === 0 ? "default" : "ghost"}
                size="sm"
                onClick={() => onWeekChange(0)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  currentWeekOffset === 0 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'hover:bg-white/20 text-white'
                }`}
              >
                Current Week
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="p-2 hover:bg-white/20 text-white h-9 w-9 rounded-lg"
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
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-lg backdrop-blur-sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shopping List
              </Button>
            )}

            <Button
              onClick={onShowAIDialog}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-lg backdrop-blur-sm"
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
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-xs text-blue-100 font-medium">Total Calories</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-xs text-blue-100 font-medium">Daily Average</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-xs text-blue-100 font-medium">Total Meals</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-xs text-blue-100 font-medium">Total Protein</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanHeader;
