
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MoreVertical, Trash2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { format, subDays } from 'date-fns';

export const HistoryTab = () => {
  const { t, isRTL } = useI18n();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample history data
  const historyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date,
      foods: [
        { name: 'Oatmeal with berries', calories: 300, protein: 10, time: '08:00' },
        { name: 'Grilled chicken salad', calories: 450, protein: 35, time: '13:00' },
        { name: 'Apple', calories: 95, protein: 0.5, time: '15:30' },
        { name: 'Salmon with rice', calories: 520, protein: 40, time: '19:00' }
      ].slice(0, Math.floor(Math.random() * 4) + 1),
      totalCalories: 0,
      totalProtein: 0
    };
  }).map(day => ({
    ...day,
    totalCalories: day.foods.reduce((sum, food) => sum + food.calories, 0),
    totalProtein: day.foods.reduce((sum, food) => sum + food.protein, 0)
  }));

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Calendar className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-lg">
          {t('foodTracker:history') || 'Food History'}
        </h3>
      </div>

      <div className="space-y-3">
        {historyData.map((day, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <CardTitle className="text-lg">
                    {format(day.date, 'EEEE, MMM d')}
                  </CardTitle>
                  <div className={`flex gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{day.totalCalories} {t('common:calories') || 'calories'}</span>
                    <span>{day.totalProtein.toFixed(1)}g {t('common:protein') || 'protein'}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {day.foods.map((food, foodIndex) => (
                  <div key={foodIndex} className={`flex items-center justify-between p-2 bg-gray-50 rounded ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="font-medium text-sm">{food.name}</div>
                      <div className="text-xs text-gray-600">
                        {food.time} • {food.calories} cal • {food.protein}g protein
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryTab;
