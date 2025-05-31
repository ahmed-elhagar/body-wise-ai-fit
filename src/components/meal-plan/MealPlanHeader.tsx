
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
    <div className="bg-gradient-to-r from-[#3D8CFF] to-[#1E60E0] rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-8">
        {/* Title and Actions Row */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-bold text-white mb-2">Meal Plan</h1>
              <p className="text-blue-100 text-lg font-medium">
                {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* View Mode Toggle */}
            <div className="flex bg-white/15 rounded-xl p-1 backdrop-blur-sm border border-white/20">
              <button
                onClick={() => onViewModeChange('daily')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Daily View
              </button>
              <button
                onClick={() => onViewModeChange('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Weekly View
              </button>
            </div>

            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="sm"
                  className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50 backdrop-blur-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
                
                <Button
                  onClick={onRegeneratePlan}
                  variant="outline"
                  size="sm"
                  className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50 backdrop-blur-sm"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Meals
                </Button>
              </>
            )}
            
            <Button
              onClick={onShowAIDialog}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg font-semibold"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? 'Regenerate' : 'Generate AI Plan'}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="text-white hover:bg-white/20 p-3 rounded-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {currentWeekOffset === 0 ? 'Current Week' : `Week ${Math.abs(currentWeekOffset) + 1}`}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="text-white hover:bg-white/20 p-3 rounded-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Weekly Stats */}
        {hasWeeklyPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.totalCalories.toLocaleString()}
              </div>
              <div className="text-sm text-blue-100 font-medium">Total Calories</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.avgDailyCalories}
              </div>
              <div className="text-sm text-blue-100 font-medium">Daily Average</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.totalMeals}
              </div>
              <div className="text-sm text-blue-100 font-medium">Total Meals</div>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {weeklyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-sm text-blue-100 font-medium">Total Protein</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanHeader;
