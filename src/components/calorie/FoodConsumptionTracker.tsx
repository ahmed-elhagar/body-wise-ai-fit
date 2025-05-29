
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar, Target } from "lucide-react";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const FoodConsumptionTracker = () => {
  const { user } = useAuth();
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  const [selectedMealType, setSelectedMealType] = useState<string>('all');

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
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Daily Progress Summary */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Today's Progress</h3>
            <p className="text-sm text-gray-600">Track your daily nutrition goals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'calories', label: 'Calories', unit: '', color: 'orange' },
            { key: 'protein', label: 'Protein', unit: 'g', color: 'green' },
            { key: 'carbs', label: 'Carbs', unit: 'g', color: 'blue' },
            { key: 'fat', label: 'Fat', unit: 'g', color: 'purple' }
          ].map(({ key, label, unit, color }) => {
            const current = dailyTotals[key as keyof typeof dailyTotals];
            const goal = dailyGoals[key as keyof typeof dailyGoals];
            const percentage = getProgressPercentage(current, goal);
            
            return (
              <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(percentage)}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      {Math.round(current)}
                    </span>
                    <span className="text-sm text-gray-600">
                      / {goal}{unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Food Log */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Today's Food Log</h3>
              <p className="text-sm text-gray-600">
                {todaysConsumption?.length || 0} items logged
              </p>
            </div>
          </div>

          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
            <SelectTrigger className="w-full sm:w-48">
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
          <div className="text-center py-8">
            <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              {selectedMealType !== 'all' ? `No ${selectedMealType} items logged` : 'No food logged today'}
            </p>
            <p className="text-sm text-gray-500">
              Use the search above to find and log your meals
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredConsumption.map((entry: any) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {entry.food_item?.name}
                    </h4>
                    <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                      {entry.meal_type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600 mb-1">
                    <span>{Math.round(entry.calories_consumed)} cal</span>
                    <span>{Math.round(entry.protein_consumed)}g protein</span>
                    <span>{Math.round(entry.carbs_consumed)}g carbs</span>
                    <span>{Math.round(entry.fat_consumed)}g fat</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{entry.quantity_g}g serving</span>
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
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-3"
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
