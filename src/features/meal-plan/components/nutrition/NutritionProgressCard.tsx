
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';

interface NutritionProgressCardProps {
  selectedDayNumber: number;
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  mealCount: number;
  weekStartDate: Date;
}

export const NutritionProgressCard = ({
  selectedDayNumber,
  totalCalories,
  totalProtein,
  targetDayCalories,
  mealCount,
  weekStartDate
}: NutritionProgressCardProps) => {
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + dayOffset);
    return date;
  };

  const progressPercentage = Math.min(100, (totalCalories / targetDayCalories) * 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const proteinProgress = Math.min(100, (totalProtein / proteinTarget) * 100);

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-fitness-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-fitness-primary-800">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-sm text-fitness-primary-600">
                {format(getDateForDay(selectedDayNumber), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
            <div className="text-sm text-gray-600 mb-2">Calories</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {remainingCalories} remaining of {targetDayCalories}
            </div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
            <div className="text-sm text-gray-600 mb-2">Protein</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${proteinProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Target: {proteinTarget}g
            </div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{mealCount}</div>
            <div className="text-sm text-gray-600">Meals Planned</div>
            <div className="flex items-center justify-center mt-2">
              <Award className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600">
                {mealCount >= 3 ? 'Complete' : 'In Progress'}
              </span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-sm text-gray-600">Daily Goal</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-xs text-purple-600">
                {progressPercentage >= 80 ? 'On Track' : 'Need More'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
