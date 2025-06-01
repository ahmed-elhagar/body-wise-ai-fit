
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";
import DayOverview from "./DayOverview";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface DailyViewContainerProps {
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  weekStartDate: Date;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index?: number) => void;
  onAddSnack: () => void;
}

const DailyViewContainer = ({
  selectedDayNumber,
  onDayChange,
  weekStartDate,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack
}: DailyViewContainerProps) => {
  const { selectDay, meals, today, isRTL } = useMealPlanTranslations();
  
  const todayDate = new Date();

  const days = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    const isSelected = selectedDayNumber === dayNumber;
    const isToday = isSameDay(date, todayDate);
    
    return {
      dayNumber,
      date,
      isSelected,
      isToday,
      dayDate: format(date, 'd'),
      dayName: format(date, 'EEE')
    };
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Day Selector */}
      <Card className="bg-white border-fitness-primary-100 shadow-sm rounded-xl">
        <div className="p-5">
          <div className={`flex items-center justify-between mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-fitness-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-fitness-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-fitness-primary-800">
                  {selectDay || 'Select Day'}
                </h3>
                {dailyMeals.length > 0 && (
                  <p className="text-sm text-fitness-primary-600">
                    {dailyMeals.length} {meals || 'meals'} • {totalCalories} cal
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={onAddSnack}
              className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Snack
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map(({ dayNumber, date, isSelected, isToday, dayDate, dayName }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  relative p-3 rounded-xl font-medium transition-all duration-200 text-center
                  ${isSelected 
                    ? 'bg-fitness-primary-500 text-white shadow-lg scale-105' 
                    : 'bg-fitness-primary-50 text-fitness-primary-700 hover:bg-fitness-primary-100 hover:scale-102'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-400 bg-fitness-accent-50' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-75 uppercase tracking-wide">
                    {dayName}
                  </span>
                  <span className="text-lg font-bold">
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Day Overview */}
      <DayOverview
        selectedDayNumber={selectedDayNumber}
        dailyMeals={dailyMeals}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        targetDayCalories={targetDayCalories}
        onViewMeal={onViewMeal}
        onExchangeMeal={(meal: DailyMeal, index?: number) => onExchangeMeal(meal, index)}
        onAddSnack={onAddSnack}
        weekStartDate={weekStartDate}
      />
    </div>
  );
};

export default DailyViewContainer;
