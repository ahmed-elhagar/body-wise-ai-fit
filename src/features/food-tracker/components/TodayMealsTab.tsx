
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { FoodConsumptionEntry } from '../hooks/useFoodConsumption';

interface TodayMealsTabProps {
  consumption: FoodConsumptionEntry[];
  isLoading: boolean;
  onAddFood: () => void;
}

const TodayMealsTab: React.FC<TodayMealsTabProps> = ({
  consumption,
  isLoading,
  onAddFood
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (consumption.length === 0) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="text-center py-12">
          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No meals logged today</h3>
          <p className="text-gray-500 mb-6">Start tracking your nutrition by adding your first meal!</p>
          <Button onClick={onAddFood} className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Food
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group meals by type
  const groupedMeals = consumption.reduce((acc, meal) => {
    const type = meal.meal_type || 'snack';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, FoodConsumptionEntry[]>);

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-6">
      {mealOrder.map(mealType => {
        const meals = groupedMeals[mealType];
        if (!meals?.length) return null;

        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories_consumed, 0);

        return (
          <Card key={mealType} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                <span className="text-sm font-medium text-purple-600">
                  {Math.round(totalCalories)} cal
                </span>
              </div>
              
              <div className="space-y-3">
                {meals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {meal.food_item?.name || 'Unknown Food'}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{meal.quantity_g}g</span>
                        <span>{Math.round(meal.calories_consumed)} cal</span>
                        <span>P: {Math.round(meal.protein_consumed)}g</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(meal.consumed_at), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TodayMealsTab;
