
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
  onExchangeMeal: (meal: DailyMeal, dayNumber: number, mealIndex: number) => void;
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
      {/* Day Selector */}
      <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-200 shadow-lg">
        <div className="p-4">
          <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Eye className="w-5 h-5 text-fitness-primary-600" />
            <h3 className="text-lg font-semibold text-fitness-primary-800">
              {selectDay}
            </h3>
            {dailyMeals.length > 0 && (
              <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200">
                {dailyMeals.length} {meals}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map(({ dayNumber, date, isSelected, isToday, dayDate }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  relative p-3 rounded-xl font-medium transition-all duration-300 text-center
                  ${isSelected 
                    ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-sm border-2 border-fitness-primary-100'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300 ring-offset-2' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className="flex flex-col items-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                      <span className={`text-xs font-medium mt-1 ${isSelected ? 'text-fitness-accent-200' : 'text-fitness-accent-600'}`}>
                        {today}
                      </span>
                    </div>
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
        onExchangeMeal={onExchangeMeal}
        onAddSnack={onAddSnack}
        weekStartDate={weekStartDate}
      />
    </div>
  );
};

export default DailyViewContainer;
