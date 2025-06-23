
import React, { useState, useEffect } from 'react';
import { Plus, Search, History, Utensils, Flame, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useFoodConsumption } from '../hooks/useFoodConsumption';
import { useProfile } from '@/features/profile/hooks/useProfile';
import TodayMealsTab from './TodayMealsTab';
import FoodSearchTab from './FoodSearchTab';
import FoodHistoryTab from './FoodHistoryTab';
import AddFoodModal from './AddFoodModal';
import { format } from 'date-fns';

const FoodTrackerDashboard: React.FC = () => {
  const { t } = useTranslation(['foodTracker', 'common']);
  const [activeTab, setActiveTab] = useState('today');
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const { profile } = useProfile();
  
  const { 
    todayConsumption, 
    isLoading, 
    error,
    refreshConsumption 
  } = useFoodConsumption();

  // Calculate daily nutrition totals with error handling
  const nutritionTotals = React.useMemo(() => {
    try {
      if (!todayConsumption || !Array.isArray(todayConsumption)) {
        return { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }

      return todayConsumption.reduce((totals, item) => {
        // Validate that item exists and has required properties
        if (!item) return totals;
        
        return {
          calories: totals.calories + (Number(item.calories_consumed) || 0),
          protein: totals.protein + (Number(item.protein_consumed) || 0),
          carbs: totals.carbs + (Number(item.carbs_consumed) || 0),
          fat: totals.fat + (Number(item.fat_consumed) || 0)
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    } catch (error) {
      console.error('Error calculating nutrition totals:', error);
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
  }, [todayConsumption]);

  // Daily goals with fallback values
  const dailyGoals = {
    calories: 2000, // Default fallback
    protein: 150,   // Default fallback  
    carbs: 250,     // Default fallback
    fat: 65         // Default fallback
  };

  // Calculate progress percentages with bounds checking
  const progress = {
    calories: Math.min(Math.max((nutritionTotals.calories / dailyGoals.calories) * 100, 0), 100),
    protein: Math.min(Math.max((nutritionTotals.protein / dailyGoals.protein) * 100, 0), 100),
    carbs: Math.min(Math.max((nutritionTotals.carbs / dailyGoals.carbs) * 100, 0), 100),
    fat: Math.min(Math.max((nutritionTotals.fat / dailyGoals.fat) * 100, 0), 100)
  };

  const handleFoodAdded = () => {
    setIsAddFoodOpen(false);
    refreshConsumption();
  };

  // Error boundary for this component
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Food Tracker Error:', event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading food tracker data</p>
            <Button onClick={refreshConsumption}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Food Tracker
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Track your nutrition and reach your health goals
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Nutrition Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Calories</p>
                  <p className="text-2xl sm:text-3xl font-bold">{Math.round(nutritionTotals.calories)}</p>
                  <p className="text-orange-100 text-xs">
                    {Math.max(Math.round(dailyGoals.calories - nutritionTotals.calories), 0)} remaining
                  </p>
                </div>
                <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
              </div>
              <Progress 
                value={progress.calories} 
                className="mt-3 bg-orange-400/30"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Protein</p>
                  <p className="text-2xl sm:text-3xl font-bold">{Math.round(nutritionTotals.protein)}g</p>
                  <p className="text-blue-100 text-xs">
                    {Math.round(progress.protein)}% of goal
                  </p>
                </div>
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
              </div>
              <Progress 
                value={progress.protein} 
                className="mt-3 bg-blue-400/30"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Carbs</p>
                  <p className="text-2xl sm:text-3xl font-bold">{Math.round(nutritionTotals.carbs)}g</p>
                  <p className="text-green-100 text-xs">
                    {Math.round(progress.carbs)}% of goal
                  </p>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-200/20 rounded-full flex items-center justify-center">
                  <span className="text-green-200 text-sm font-bold">C</span>
                </div>
              </div>
              <Progress 
                value={progress.carbs} 
                className="mt-3 bg-green-400/30"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Fat</p>
                  <p className="text-2xl sm:text-3xl font-bold">{Math.round(nutritionTotals.fat)}g</p>
                  <p className="text-yellow-100 text-xs">
                    {Math.round(progress.fat)}% of goal
                  </p>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-yellow-200/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-200 text-sm font-bold">F</span>
                </div>
              </div>
              <Progress 
                value={progress.fat} 
                className="mt-3 bg-yellow-400/30"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                Daily Nutrition
              </CardTitle>
              <Button
                onClick={() => setIsAddFoodOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Food
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger 
                  value="today" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm"
                >
                  <Utensils className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Today</span>
                  <span className="sm:hidden">Today</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="search"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm"
                >
                  <Search className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Search</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm"
                >
                  <History className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-6">
                <TodayMealsTab 
                  consumption={todayConsumption || []}
                  isLoading={isLoading}
                  onAddFood={() => setIsAddFoodOpen(true)}
                />
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                <FoodSearchTab onFoodAdded={handleFoodAdded} />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <FoodHistoryTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Add Food Modal */}
        <AddFoodModal
          isOpen={isAddFoodOpen}
          onClose={() => setIsAddFoodOpen(false)}
          onFoodAdded={handleFoodAdded}
        />
      </div>
    </div>
  );
};

export default FoodTrackerDashboard;
