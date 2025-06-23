
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Utensils, Camera, Edit2, Trash2 } from 'lucide-react';
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
          <Card key={i} className="border border-gray-200 animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (consumption.length === 0) {
    return (
      <Card className="border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="text-center py-16">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Utensils className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">No meals logged today</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start tracking your nutrition journey by adding your first meal of the day!
          </p>
          <Button 
            onClick={onAddFood} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-base"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Meal
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
  const mealEmojis = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍿'
  };

  const mealColors = {
    breakfast: 'from-yellow-500 to-orange-500',
    lunch: 'from-blue-500 to-indigo-500',
    dinner: 'from-purple-500 to-pink-500',
    snack: 'from-green-500 to-emerald-500'
  };

  return (
    <div className="space-y-6">
      {mealOrder.map(mealType => {
        const meals = groupedMeals[mealType];
        if (!meals?.length) return null;

        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories_consumed, 0);
        const totalProtein = meals.reduce((sum, meal) => sum + meal.protein_consumed, 0);

        return (
          <Card key={mealType} className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className={`bg-gradient-to-r ${mealColors[mealType as keyof typeof mealColors]} text-white rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mealEmojis[mealType as keyof typeof mealEmojis]}</span>
                  <div>
                    <h3 className="text-xl font-bold capitalize">{mealType}</h3>
                    <p className="text-white/80 text-sm">
                      {meals.length} {meals.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Math.round(totalCalories)}</div>
                  <div className="text-white/80 text-sm">calories</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {meals.map((meal, index) => (
                  <div key={meal.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      {/* Food Image or Icon */}
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {meal.meal_image_url ? (
                          <img 
                            src={meal.meal_image_url} 
                            alt="Meal"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Utensils className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Food Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg truncate pr-2">
                            {meal.food_item?.name || 'Unknown Food'}
                          </h4>
                          <div className="flex gap-1">
                            {meal.source === 'ai_analysis' && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                <Camera className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {meal.food_item?.brand && (
                          <p className="text-sm text-gray-500 mb-3">
                            {meal.food_item.brand}
                          </p>
                        )}
                        
                        {/* Nutrition Info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                          <div className="bg-orange-50 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-orange-600">
                              {Math.round(meal.calories_consumed || 0)}
                            </div>
                            <div className="text-xs text-orange-500">cal</div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {Math.round(meal.protein_consumed || 0)}g
                            </div>
                            <div className="text-xs text-blue-500">protein</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-600">
                              {Math.round(meal.carbs_consumed || 0)}g
                            </div>
                            <div className="text-xs text-green-500">carbs</div>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-yellow-600">
                              {Math.round(meal.fat_consumed || 0)}g
                            </div>
                            <div className="text-xs text-yellow-500">fat</div>
                          </div>
                        </div>
                        
                        {/* Time and Quantity */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(meal.consumed_at), 'h:mm a')}
                            </div>
                            <span>{meal.quantity_g}g serving</span>
                          </div>
                        </div>
                        
                        {meal.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 italic">"{meal.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Add More Food Button */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors duration-200">
        <CardContent className="text-center py-8">
          <Button 
            onClick={onAddFood}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Meal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodayMealsTab;
