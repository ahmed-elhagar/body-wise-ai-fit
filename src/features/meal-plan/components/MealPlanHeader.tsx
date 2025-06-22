import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Shuffle, 
  Send, 
  Loader2,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import type { WeeklyMealPlan, DailyMeal } from '../types';

interface MealPlanHeaderProps {
  activeTab: 'overview' | 'daily' | 'shopping';
  currentWeekOffset: number;
  currentWeekPlan: WeeklyMealPlan | undefined;
  dailyMeals: DailyMeal[];
  selectedDayNumber: number;
  onWeekOffsetChange: (offset: number) => void;
  onShowAIModal: () => void;
  onShuffleMeals: () => void;
  onSendShoppingList: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
}

export const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({
  activeTab,
  currentWeekOffset,
  currentWeekPlan,
  dailyMeals,
  selectedDayNumber,
  onWeekOffsetChange,
  onShowAIModal,
  onShuffleMeals,
  onSendShoppingList,
  isGenerating,
  isShuffling
}) => {
  const getWeekStartDate = (offset: number = 0) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 6 });
    return addDays(startOfCurrentWeek, offset * 7);
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const weekStartDate = getWeekStartDate(currentWeekOffset);
  
  // Calculate nutrition stats
  const selectedDayMeals = dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  const totalCalories = selectedDayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = selectedDayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = selectedDayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = selectedDayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
  
  const targetCalories = 2000; // This should come from user profile
  const completionRate = 75; // This should be calculated from completed meals

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Meal Plan Overview';
      case 'daily': return 'Daily Meals';
      case 'shopping': return 'Shopping List';
      default: return 'Meal Plan';
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-neutral-900 mb-1">
            {getTabTitle()}
          </h1>
          <p className="text-brand-neutral-600">
            {formatWeekRange(weekStartDate)} • {currentWeekPlan ? 'AI Generated Plan' : 'No Plan Available'}
          </p>
        </div>
        
        {/* Week Navigation & Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekOffsetChange(currentWeekOffset - 1)}
            className="border-brand-neutral-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-brand-neutral-600 px-3 font-medium">
            Week {currentWeekOffset === 0 ? 'Current' : currentWeekOffset > 0 ? `+${currentWeekOffset}` : currentWeekOffset}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekOffsetChange(currentWeekOffset + 1)}
            className="border-brand-neutral-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Action Buttons */}
          {currentWeekPlan && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onShuffleMeals}
                disabled={isShuffling}
                className="border-brand-neutral-300"
              >
                {isShuffling ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shuffle className="h-4 w-4 mr-2" />
                )}
                Shuffle Meals
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onSendShoppingList}
                className="border-brand-neutral-300"
              >
                <Send className="h-4 w-4 mr-2" />
                Email List
              </Button>
            </>
          )}
          
          {/* AI Generation Button */}
          <Button
            onClick={onShowAIModal}
            disabled={isGenerating}
            className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white border-0 ml-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Quick Stats with Nutrition Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-orange-600" />
            <Badge className="bg-orange-100 text-orange-700 text-xs">
              {totalCalories > targetCalories * 0.8 ? '↗' : '→'}
            </Badge>
          </div>
          <div className="text-orange-900 font-bold text-lg">{totalCalories}/{targetCalories}</div>
          <div className="text-orange-700 text-sm">kcal today</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <Badge className="bg-green-100 text-green-700 text-xs">↗</Badge>
          </div>
          <div className="text-green-900 font-bold text-lg">{totalProtein}g</div>
          <div className="text-green-700 text-sm">protein</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-700 text-xs">
              {completionRate > 50 ? '↗' : '→'}
            </Badge>
          </div>
          <div className="text-blue-900 font-bold text-lg">{completionRate.toFixed(0)}%</div>
          <div className="text-blue-700 text-sm">completed</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-700 text-xs">→</Badge>
          </div>
          <div className="text-purple-900 font-bold text-lg">
            {selectedDayMeals.reduce((sum, meal) => sum + (meal.prep_time || 0), 0)}min
          </div>
          <div className="text-purple-700 text-sm">prep time</div>
        </div>

        {/* Nutrition Summary Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <Badge className="bg-indigo-100 text-indigo-700 text-xs">Macros</Badge>
          </div>
          <div className="text-indigo-900 font-bold text-xs">
            P: {totalProtein}g | C: {totalCarbs}g | F: {totalFat}g
          </div>
          <div className="text-indigo-700 text-sm">daily macros</div>
        </div>
      </div>
    </Card>
  );
}; 