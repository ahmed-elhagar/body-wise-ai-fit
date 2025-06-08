
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Utensils, Flame } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface DayOverviewProps {
  dayNumber: number;
  meals: any[];
  totalCalories: number;
  totalProtein: number;
  onSelectDay: (day: number) => void;
  isSelected: boolean;
}

export const DayOverview = ({ 
  dayNumber, 
  meals, 
  totalCalories, 
  totalProtein, 
  onSelectDay, 
  isSelected 
}: DayOverviewProps) => {
  const { t, isRTL } = useI18n();

  const getDayName = (dayNumber: number) => {
    const dayNames = [
      t('saturday') || 'Saturday',
      t('sunday') || 'Sunday', 
      t('monday') || 'Monday',
      t('tuesday') || 'Tuesday',
      t('wednesday') || 'Wednesday',
      t('thursday') || 'Thursday',
      t('friday') || 'Friday'
    ];
    return dayNames[dayNumber - 1] || 'Day ' + dayNumber;
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelectDay(dayNumber)}
    >
      <CardHeader className="pb-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className="text-lg font-bold text-gray-900">
            {getDayName(dayNumber)}
          </CardTitle>
          <Badge 
            variant={isSelected ? "default" : "outline"} 
            className={isSelected ? "bg-blue-500" : ""}
          >
            {meals.length} {t('mealPlan.meals')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Flame className="w-4 h-4 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-orange-700">{totalCalories}</div>
            <div className="text-xs text-orange-600">{t('mealPlan.cal')}</div>
          </div>
          
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-sm font-semibold text-green-700">{totalProtein}g</div>
            <div className="text-xs text-green-600">{t('mealPlan.protein')}</div>
          </div>
          
          <div className="p-2 bg-blue-50 rounded-lg">
            <Utensils className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-blue-700">{meals.length}</div>
            <div className="text-xs text-blue-600">{t('mealPlan.meals')}</div>
          </div>
        </div>

        {/* Meal Preview */}
        {meals.length > 0 && (
          <div className="space-y-2">
            {meals.slice(0, 3).map((meal, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="truncate">{meal.name}</span>
              </div>
            ))}
            {meals.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">
                +{meals.length - 3} {t('more')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
