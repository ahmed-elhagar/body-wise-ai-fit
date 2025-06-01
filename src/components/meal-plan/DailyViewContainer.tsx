
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
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
      dayDate: format(date, 'd')
    };
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Day Selector with improved UI */}
      <Card className="bg-gradient-to-r from-white via-fitness-primary-25 to-fitness-accent-25 border-fitness-primary-200 shadow-lg">
        <div className="p-6">
          <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-fitness-primary-100 rounded-full">
              <Eye className="w-5 h-5 text-fitness-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-fitness-primary-800">
                {selectDay}
              </h3>
              {dailyMeals.length > 0 && (
                <p className="text-sm text-fitness-primary-600">
                  {dailyMeals.length} {meals} • {totalCalories} cal
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {days.map(({ dayNumber, date, isSelected, isToday, dayDate }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  relative p-4 rounded-2xl font-bold transition-all duration-300 text-center group
                  ${isSelected 
                    ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-xl transform scale-105 ring-4 ring-fitness-primary-200' 
                    : 'bg-white/80 text-fitness-primary-700 hover:bg-fitness-primary-50 hover:shadow-lg hover:scale-102 border-2 border-fitness-primary-100'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-400 border-fitness-accent-300' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-fitness-primary-800'}`}>
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                      <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-fitness-accent-200' : 'text-fitness-accent-600'}`}>
                        {today}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Hover effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-10 bg-fitness-primary-500'}`} />
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
