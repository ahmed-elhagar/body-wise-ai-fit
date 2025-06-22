
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Utensils, 
  Plus, 
  Camera, 
  Target, 
  Flame, 
  Dumbbell, 
  Apple, 
  Droplets,
  Clock,
  Coffee,
  Cookie,
  Activity,
  History,
  TrendingUp,
  Award
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';

// Feature Components
import { useFoodConsumption } from '../hooks';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useI18n } from '@/shared/hooks/useI18n';

// Types
interface FoodTrackerProps {
  refreshKey?: number;
  onAddFood?: () => void;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ModernFoodTracker: React.FC<FoodTrackerProps> = ({ refreshKey, onAddFood }) => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: userLoading } = useAuth();
  const { todayConsumption, todayMealPlan, isLoading: consumptionLoading, forceRefresh } = useFoodConsumption();
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('today');
  const [waterIntake, setWaterIntake] = useState(0);
  
  const isLoading = profileLoading || userLoading || consumptionLoading;

  // Force refresh on component mount or refresh key change
  useEffect(() => {
    forceRefresh();
  }, [forceRefresh, refreshKey]);

  // Load water intake from localStorage
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const savedWater = localStorage.getItem(`water-${today}`);
    if (savedWater) {
      setWaterIntake(parseInt(savedWater, 10));
    }
  }, []);

  // Calculate daily goals based on profile (using defaults until goal fields are added)
  const dailyGoals: DailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 2000,
  };

  // Calculate consumed totals
  const consumedTotals: MacroData = (todayConsumption || []).reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories_consumed || 0),
      protein: acc.protein + (item.protein_consumed || 0),
      carbs: acc.carbs + (item.carbs_consumed || 0),
      fat: acc.fat + (item.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate progress percentages
  const progress = {
    calories: dailyGoals.calories > 0 ? Math.min((consumedTotals.calories / dailyGoals.calories) * 100, 100) : 0,
    protein: dailyGoals.protein > 0 ? Math.min((consumedTotals.protein / dailyGoals.protein) * 100, 100) : 0,
    carbs: dailyGoals.carbs > 0 ? Math.min((consumedTotals.carbs / dailyGoals.carbs) * 100, 100) : 0,
    fat: dailyGoals.fat > 0 ? Math.min((consumedTotals.fat / dailyGoals.fat) * 100, 100) : 0,
    water: dailyGoals.water > 0 ? Math.min((waterIntake / dailyGoals.water) * 100, 100) : 0,
  };

  // Calculate remaining values
  const remaining = {
    calories: Math.max(0, dailyGoals.calories - consumedTotals.calories),
    protein: Math.max(0, dailyGoals.protein - consumedTotals.protein),
    carbs: Math.max(0, dailyGoals.carbs - consumedTotals.carbs),
    fat: Math.max(0, dailyGoals.fat - consumedTotals.fat),
    water: Math.max(0, dailyGoals.water - waterIntake),
  };

  // Meal distribution analysis
  const mealDistribution = (todayConsumption || []).reduce((acc, item) => {
    const mealType = item.meal_type || 'snack';
    acc[mealType] = (acc[mealType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMeals = Object.values(mealDistribution).reduce((sum, count) => sum + count, 0);

  const handleAddWater = (amount: number) => {
    const newWaterIntake = waterIntake + amount;
    setWaterIntake(newWaterIntake);
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`water-${today}`, newWaterIntake.toString());
    if (newWaterIntake >= dailyGoals.water) {
      toast.success('🎉 Daily water goal achieved!');
    }
  };

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  // Tab configuration
  const tabs = [
    { id: 'today', label: t('Today'), icon: Utensils },
    { id: 'nutrition', label: t('Nutrition'), icon: Target },
    { id: 'history', label: t('History'), icon: History },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SimpleLoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Tracker</h1>
            <p className="text-gray-600">Hey {userName}! Track your nutrition and reach your goals</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-0 shadow-lg">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(consumedTotals.calories)}</p>
                  <p className="text-sm text-gray-600">{remaining.calories} remaining</p>
                  <p className="text-xs text-gray-500">Calories</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-0 shadow-lg">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(consumedTotals.protein)}g</p>
                  <p className="text-sm text-gray-600">{Math.round(progress.protein)}% of goal</p>
                  <p className="text-xs text-gray-500">Protein</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-0 shadow-lg">
              <div className="flex items-center gap-3">
                <Droplets className="w-8 h-8 text-cyan-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{waterIntake}ml</p>
                  <p className="text-sm text-gray-600">{Math.round(progress.water)}% of goal</p>
                  <p className="text-xs text-gray-500">Water</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-0 shadow-lg">
              <div className="flex items-center gap-3">
                <Utensils className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalMeals}</p>
                  <p className="text-sm text-gray-600">{totalMeals >= 3 ? 'Great job!' : 'Keep going'}</p>
                  <p className="text-xs text-gray-500">Meals</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Meals */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-800 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Today's Meals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todayConsumption && todayConsumption.length > 0 ? (
                      <div className="space-y-4">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                          const meals = todayConsumption.filter(item => item.meal_type === mealType);
                          if (meals.length === 0) return null;

                          const mealIcons = {
                            breakfast: Coffee,
                            lunch: Apple,
                            dinner: Utensils,
                            snack: Cookie
                          };
                          const MealIcon = mealIcons[mealType as keyof typeof mealIcons];

                          return (
                            <div key={mealType} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex items-center gap-2 mb-3">
                                <MealIcon className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-gray-900 capitalize">{mealType}</h4>
                                <Badge variant="outline" className="ml-auto">
                                  {meals.reduce((sum, meal) => sum + (meal.calories_consumed || 0), 0)} cal
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {meals.map((meal, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">{meal.food_item?.name || 'Unknown Food'}</span>
                                    <span className="text-gray-500">{meal.quantity_g}g</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg mb-2">No meals logged today</p>
                        <p className="text-sm mb-4">Start tracking your nutrition!</p>
                        <Button
                          onClick={onAddFood}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Meal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Water Intake & Quick Actions */}
              <div className="space-y-6">
                {/* Water Intake */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-800 flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      Water Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {waterIntake}ml
                      </div>
                      <div className="text-sm text-gray-500">
                        {remaining.water}ml remaining
                      </div>
                    </div>
                    <Progress value={progress.water} className="h-3 mb-4" />
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddWater(250)}
                      >
                        +250ml
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddWater(500)}
                      >
                        +500ml
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddWater(1000)}
                      >
                        +1L
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-800 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/calorie-checker')}
                      className="w-full justify-start"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Scan Food Photo
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddFood}
                      className="w-full justify-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log Manual Entry
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('history')}
                      className="w-full justify-start"
                    >
                      <History className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Macro Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Macro Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calories */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Calories</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(consumedTotals.calories)} / {dailyGoals.calories}
                      </span>
                    </div>
                    <Progress value={progress.calories} className="h-3" />
                    <div className="text-xs text-gray-500 mt-1">
                      {remaining.calories} remaining
                    </div>
                  </div>

                  {/* Protein */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Protein</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(consumedTotals.protein)}g / {dailyGoals.protein}g
                      </span>
                    </div>
                    <Progress value={progress.protein} className="h-3" />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(remaining.protein)}g remaining
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Carbs</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(consumedTotals.carbs)}g / {dailyGoals.carbs}g
                      </span>
                    </div>
                    <Progress value={progress.carbs} className="h-3" />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(remaining.carbs)}g remaining
                    </div>
                  </div>

                  {/* Fat */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Fat</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(consumedTotals.fat)}g / {dailyGoals.fat}g
                      </span>
                    </div>
                    <Progress value={progress.fat} className="h-3" />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(remaining.fat)}g remaining
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Daily Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-orange-50">
                      <div className="text-2xl font-bold text-orange-600">{Math.round(consumedTotals.calories)}</div>
                      <div className="text-sm text-orange-700">Calories Consumed</div>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(consumedTotals.protein)}g</div>
                      <div className="text-sm text-blue-700">Protein</div>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">{totalMeals}</div>
                      <div className="text-sm text-green-700">Meals Logged</div>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-purple-50">
                      <div className="text-2xl font-bold text-purple-600">{waterIntake}ml</div>
                      <div className="text-sm text-purple-700">Water Intake</div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {(progress.calories >= 80 || progress.protein >= 100 || progress.water >= 100 || totalMeals >= 3) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Today's Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {progress.calories >= 80 && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            🎯 Great Progress!
                          </Badge>
                        )}
                        {progress.protein >= 100 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            💪 Protein Goal!
                          </Badge>
                        )}
                        {progress.water >= 100 && (
                          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                            💧 Hydrated!
                          </Badge>
                        )}
                        {totalMeals >= 3 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            🍽️ Regular Meals!
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Food History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Food History Coming Soon</p>
                  <p className="text-sm">Track your nutrition patterns and insights</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernFoodTracker; 
