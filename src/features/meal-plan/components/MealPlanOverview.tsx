import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Utensils, 
  ChefHat, 
  Coffee, 
  Cookie, 
  Plus, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import type { WeeklyMealPlan, DailyMeal } from '../types';

interface MealPlanOverviewProps {
  currentWeekPlan: WeeklyMealPlan | undefined;
  dailyMeals: DailyMeal[];
  selectedDayNumber: number;
  currentWeekOffset: number;
  completedMeals: Set<string>;
  onDaySelect: (dayNumber: number) => void;
  onMealComplete: (mealId: string) => void;
  onShowAIModal: () => void;
  onAddSnack: () => void;
  isGenerating: boolean;
}

export const MealPlanOverview: React.FC<MealPlanOverviewProps> = ({
  currentWeekPlan,
  dailyMeals,
  selectedDayNumber,
  currentWeekOffset,
  completedMeals,
  onDaySelect,
  onShowAIModal,
  onAddSnack,
  isGenerating
}) => {
  const getWeekStartDate = (offset: number = 0) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 6 });
    return addDays(startOfCurrentWeek, offset * 7);
  };

  const weekStartDate = getWeekStartDate(currentWeekOffset);
  const weekDays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const selectedDayMeals = dailyMeals.filter(meal => meal.day_number === selectedDayNumber);

  const mealTypeConfig = [
    { 
      id: 'breakfast', 
      name: 'Breakfast', 
      icon: Coffee, 
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      meals: selectedDayMeals.filter(meal => meal.meal_type === 'breakfast')
    },
    { 
      id: 'lunch', 
      name: 'Lunch', 
      icon: Utensils, 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      meals: selectedDayMeals.filter(meal => meal.meal_type === 'lunch')
    },
    { 
      id: 'dinner', 
      name: 'Dinner', 
      icon: ChefHat, 
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      meals: selectedDayMeals.filter(meal => meal.meal_type === 'dinner')
    },
    { 
      id: 'snack', 
      name: 'Snacks', 
      icon: Cookie, 
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      meals: selectedDayMeals.filter(meal => 
        meal.meal_type === 'snack' || 
        meal.meal_type === 'snack1' || 
        meal.meal_type === 'snack2'
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <Card className="p-6">
        <h3 className="font-bold text-brand-neutral-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-brand-primary-600" />
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const dayDate = addDays(weekStartDate, index);
            const isCurrentDay = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const dayMeals = dailyMeals.filter(meal => meal.day_number === dayNumber);
            const dayCompletedMeals = dayMeals.filter(meal => completedMeals.has(meal.id));
            
            return (
              <button
                key={day}
                onClick={() => onDaySelect(dayNumber)}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white shadow-lg border-transparent'
                    : isCurrentDay
                    ? 'bg-brand-primary-50 text-brand-primary-700 border-brand-primary-200'
                    : 'bg-white text-brand-neutral-700 hover:bg-brand-neutral-50 border-brand-neutral-200'
                }`}
              >
                <div className="text-xs font-medium mb-1">{day}</div>
                <div className="text-xl font-bold mb-2">{format(dayDate, 'd')}</div>
                {dayMeals.length > 0 && (
                  <div className="text-xs">
                    {dayCompletedMeals.length}/{dayMeals.length} meals
                  </div>
                )}
                {isCurrentDay && !isSelected && (
                  <div className="w-2 h-2 bg-brand-primary-500 rounded-full mx-auto mt-2"></div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Today's Meals Preview */}
      {currentWeekPlan ? (
        <Card className="p-6">
          <h3 className="font-bold text-brand-neutral-900 mb-4 flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-brand-primary-600" />
            Today's Meals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mealTypeConfig.map((mealType) => (
              <div key={mealType.id} className={`${mealType.bgColor} ${mealType.borderColor} border rounded-xl p-4`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${mealType.color}`}>
                    <mealType.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${mealType.textColor}`}>{mealType.name}</h4>
                    <p className="text-xs text-brand-neutral-600">{mealType.meals.length} meals</p>
                  </div>
                </div>
                <Progress 
                  value={mealType.meals.length > 0 ? Math.round((mealType.meals.filter(meal => completedMeals.has(meal.id)).length / mealType.meals.length) * 100) : 0} 
                  className="h-2"
                />
                
                {mealType.meals.length === 0 && (
                  <div className={`${mealType.bgColor} ${mealType.borderColor} border-2 border-dashed rounded-xl p-6 text-center group cursor-pointer hover:border-solid transition-all mt-3`}>
                    <div onClick={mealType.id === 'snack' ? onAddSnack : onShowAIModal}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${mealType.color} mb-3 mx-auto group-hover:scale-105 transition-transform`}>
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <h4 className={`font-semibold ${mealType.textColor} mb-1`}>
                        Add {mealType.name}
                      </h4>
                      <p className="text-sm text-brand-neutral-600">
                        {mealType.id === 'snack' ? 'Add custom snacks' : 'Generate meal ideas'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-brand-neutral-900 mb-2">No Meal Plan Available</h3>
            <p className="text-brand-neutral-600 mb-6">
              Generate an AI-powered meal plan tailored to your goals and preferences.
            </p>
            <Button 
              onClick={onShowAIModal}
              disabled={isGenerating}
              className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white border-0 px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Meal Plan
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}; 