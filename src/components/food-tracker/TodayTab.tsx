
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Flame, MoreVertical } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export const TodayTab = () => {
  const { t, isRTL } = useI18n();
  const [todaysFoods, setTodaysFoods] = useState<FoodEntry[]>([
    {
      id: '1',
      name: 'Oatmeal with berries',
      calories: 300,
      protein: 10,
      carbs: 45,
      fat: 8,
      time: '08:00'
    },
    {
      id: '2',
      name: 'Grilled chicken salad',
      calories: 450,
      protein: 35,
      carbs: 20,
      fat: 25,
      time: '13:00'
    }
  ]);

  const targetCalories = 2000;
  const targetProtein = 150;
  
  const totalCalories = todaysFoods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = todaysFoods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = todaysFoods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = todaysFoods.reduce((sum, food) => sum + food.fat, 0);

  const calorieProgress = (totalCalories / targetCalories) * 100;
  const proteinProgress = (totalProtein / targetProtein) * 100;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Daily Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-5 h-5 text-blue-500" />
            {t('foodTracker:todaySummary') || "Today's Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <Flame className="w-5 h-5 mx-auto mb-1 text-red-500" />
              <div className="text-2xl font-bold text-red-600">{totalCalories}</div>
              <div className="text-xs text-red-700">{t('common:calories') || 'Calories'}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalProtein.toFixed(1)}g</div>
              <div className="text-xs text-green-700">{t('common:protein') || 'Protein'}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCarbs.toFixed(1)}g</div>
              <div className="text-xs text-blue-700">{t('common:carbs') || 'Carbs'}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
              <div className="text-xs text-orange-700">{t('common:fat') || 'Fat'}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t('foodTracker:calories') || 'Calories'}</span>
                <span>{totalCalories} / {targetCalories}</span>
              </div>
              <Progress value={calorieProgress} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t('foodTracker:protein') || 'Protein'}</span>
                <span>{totalProtein.toFixed(1)}g / {targetProtein}g</span>
              </div>
              <Progress value={proteinProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Food Button */}
      <Button className="w-full h-12 bg-green-600 hover:bg-green-700">
        <Plus className="w-5 h-5 mr-2" />
        {t('foodTracker:addFood') || 'Add Food'}
      </Button>

      {/* Food Entries */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">
          {t('foodTracker:todaysFood') || "Today's Food"}
        </h3>
        
        {todaysFoods.map((food) => (
          <Card key={food.id}>
            <CardContent className="p-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h4 className="font-medium">{food.name}</h4>
                  <div className={`flex gap-3 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{food.time}</span>
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g protein</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TodayTab;
