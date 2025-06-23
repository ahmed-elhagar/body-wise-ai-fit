
import React from 'react';
import { Plus, Clock, Trash2, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FoodConsumptionEntry, useFoodConsumption } from '../hooks/useFoodConsumption';

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
  const { deleteConsumption, isDeletingConsumption } = useFoodConsumption();

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealsByType = (type: string) => {
    return consumption.filter(item => item.meal_type === type);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {mealTypes.map((mealType) => (
          <Card key={mealType} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMealIcon(mealType)}</span>
                  <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                </div>
                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!consumption || consumption.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No meals logged today</h3>
        <p className="text-gray-500 mb-6">Start tracking your nutrition by logging your first meal!</p>
        <Button 
          onClick={onAddFood}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Your First Meal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mealTypes.map((mealType) => {
        const meals = getMealsByType(mealType);
        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories_consumed, 0);
        
        return (
          <Card key={mealType} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMealIcon(mealType)}</span>
                  <h3 className="text-lg font-semibold capitalize text-gray-800">{mealType}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {Math.round(totalCalories)} cal
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAddFood}
                    className="hover:bg-purple-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {meals.length > 0 ? (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div 
                      key={meal.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {meal.food_item?.name || 'Unknown Food'}
                          </h4>
                          {meal.food_item?.brand && (
                            <Badge variant="outline" className="text-xs">
                              {meal.food_item.brand}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{meal.quantity_g}g</span>
                          <span>•</span>
                          <span>{Math.round(meal.calories_consumed)} cal</span>
                          <span>•</span>
                          <span>P: {Math.round(meal.protein_consumed)}g</span>
                          <span>•</span>
                          <span>C: {Math.round(meal.carbs_consumed)}g</span>
                          <span>•</span>
                          <span>F: {Math.round(meal.fat_consumed)}g</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {format(new Date(meal.consumed_at), 'h:mm a')}
                          </span>
                          {meal.source === 'ai_analysis' && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                              AI Analyzed
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteConsumption(meal.id)}
                        disabled={isDeletingConsumption}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No {mealType} logged yet</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onAddFood}
                    className="mt-2 text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add {mealType}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TodayMealsTab;
