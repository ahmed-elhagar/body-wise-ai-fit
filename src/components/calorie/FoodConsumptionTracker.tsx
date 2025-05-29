
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar, Target, Utensils, Clock, TrendingUp } from "lucide-react";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMealPlanData } from "@/hooks/useMealPlanData";

interface FoodConsumptionTrackerProps {
  onSelectFood?: (food: any) => void;
}

const FoodConsumptionTracker = ({ onSelectFood }: FoodConsumptionTrackerProps) => {
  const { user } = useAuth();
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  
  // Get today's meal plan
  const { data: currentWeekPlan } = useMealPlanData(0);

  // Get today's consumption log
  const { data: todaysConsumption, isLoading } = useQuery({
    queryKey: ['food-consumption-today', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          id,
          quantity_g,
          meal_type,
          calories_consumed,
          protein_consumed,
          carbs_consumed,
          fat_consumed,
          consumed_at,
          notes,
          food_item:food_items(
            name,
            category,
            serving_description
          )
        `)
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const mealTypes = [
    { value: 'all', label: 'All Meals' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  // Calculate daily totals
  const dailyTotals = todaysConsumption?.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories_consumed || 0),
      protein: acc.protein + (item.protein_consumed || 0),
      carbs: acc.carbs + (item.carbs_consumed || 0),
      fat: acc.fat + (item.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Filter by meal type
  const filteredConsumption = todaysConsumption?.filter(item => 
    selectedMealType === 'all' || item.meal_type === selectedMealType
  ) || [];

  // Get today's meal plan meals
  const todayNumber = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todaysMealPlan = currentWeekPlan?.dailyMeals?.filter(meal => 
    meal.day_number === todayNumber
  ) || [];

  // Goals (these could come from user profile)
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(100, (current / goal) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('food_consumption_log')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleAddMealPlanItem = (meal: any) => {
    if (onSelectFood) {
      // Pass the meal data with proper structure for the food database
      const foodData = {
        id: meal.id, // Use the actual meal ID from daily_meals
        name: meal.name,
        calories_per_100g: Math.round((meal.calories || 0) / ((meal.servings || 1) * 100) * 100),
        protein_per_100g: Math.round((meal.protein || 0) / ((meal.servings || 1) * 100) * 100 * 10) / 10,
        carbs_per_100g: Math.round((meal.carbs || 0) / ((meal.servings || 1) * 100) * 100 * 10) / 10,
        fat_per_100g: Math.round((meal.fat || 0) / ((meal.servings || 1) * 100) * 100 * 10) / 10,
        category: 'meal',
        serving_description: `${meal.servings || 1} serving(s)`,
        // Include original meal data for processing
        _mealData: meal
      };
      onSelectFood(foodData);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Overview */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Today's Progress</h2>
            <p className="text-sm text-gray-600">Track your daily nutrition goals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'calories', label: 'Calories', unit: '', color: 'orange', icon: '🔥' },
            { key: 'protein', label: 'Protein', unit: 'g', color: 'green', icon: '💪' },
            { key: 'carbs', label: 'Carbs', unit: 'g', color: 'blue', icon: '🌾' },
            { key: 'fat', label: 'Fat', unit: 'g', color: 'purple', icon: '🥑' }
          ].map(({ key, label, unit, color, icon }) => {
            const current = dailyTotals[key as keyof typeof dailyTotals];
            const goal = dailyGoals[key as keyof typeof dailyGoals];
            const percentage = getProgressPercentage(current, goal);
            
            return (
              <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {Math.round(percentage)}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      {Math.round(current)}
                    </span>
                    <span className="text-xs text-gray-600">
                      / {goal}{unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today's Meal Plan */}
      {todaysMealPlan.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Today's Meal Plan</h3>
              <p className="text-sm text-gray-600">{todaysMealPlan.length} planned meals</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {todaysMealPlan.map((meal, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{meal.name}</h4>
                    <Badge variant="outline" className="text-xs mt-1 capitalize">
                      {meal.meal_type}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1 h-auto ml-2"
                    onClick={() => handleAddMealPlanItem(meal)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="font-medium">{meal.calories} cal</span>
                  <span>•</span>
                  <span>{meal.protein}g protein</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)}min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Food Log */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Food Log</h3>
              <p className="text-sm text-gray-600">
                {todaysConsumption?.length || 0} items logged today
              </p>
            </div>
          </div>

          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Filter by meal" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredConsumption.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              {selectedMealType !== 'all' ? `No ${selectedMealType} items logged` : 'No food logged today'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Start tracking your nutrition by adding foods from your meal plan or searching the database
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConsumption.map((entry: any) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {entry.food_item?.name}
                    </h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {entry.meal_type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 mb-2">
                    <span className="font-medium">{Math.round(entry.calories_consumed)} cal</span>
                    <span>{Math.round(entry.protein_consumed * 10) / 10}g protein</span>
                    <span>{Math.round(entry.carbs_consumed * 10) / 10}g carbs</span>
                    <span>{Math.round(entry.fat_consumed * 10) / 10}g fat</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">{entry.quantity_g}g</span>
                    <span>•</span>
                    <span>{new Date(entry.consumed_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FoodConsumptionTracker;
