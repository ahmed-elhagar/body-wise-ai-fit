
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  ChefHat, 
  Sparkles, 
  TrendingUp, 
  Target, 
  ShoppingCart, 
  Clock,
  Flame,
  Utensils,
  Plus,
  BarChart3,
  Heart
} from "lucide-react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import { format, addDays } from "date-fns";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

const EnhancedMealPlanPage = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    currentWeekPlan,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    isLoading,
    handleShowRecipe,
    handleExchangeMeal,
    handleGenerateAIPlan,
    setShowAIDialog,
    setShowShoppingDialog
  } = useMealPlanPage();

  const selectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <EnhancedLoadingIndicator
            status="loading"
            type="meal-plan"
            message="Loading Your Meal Plan"
            description="Preparing your personalized nutrition journey..."
            size="lg"
            variant="card"
            showSteps={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Enhanced Hero Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
          <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-3xl translate-y-24 -translate-x-24" />
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Your Meal Plan
                      </h1>
                      <p className="text-lg text-gray-600 font-medium">
                        AI-Powered Personalized Nutrition
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </Badge>
                    <Badge variant="outline" className="bg-white/80 border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium">
                      <Target className="w-4 h-4 mr-2" />
                      Day {selectedDayNumber} of 7
                    </Badge>
                    {totalCalories > 0 && (
                      <Badge variant="outline" className="bg-white/80 border-green-300 text-green-700 px-4 py-2 text-sm font-medium">
                        <Flame className="w-4 h-4 mr-2" />
                        {totalCalories} calories
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowShoppingDialog(true)}
                    variant="outline"
                    size="lg"
                    className="bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shopping List
                  </Button>
                  
                  <Button
                    onClick={() => setShowAIDialog(true)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-xl px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Plan
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced Navigation & Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          
          {/* Stats Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Daily Progress Card */}
            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Daily Progress</h3>
                    <p className="text-sm text-gray-600">Nutrition targets</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Calories Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-700">Calories</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {totalCalories} / {targetDayCalories}
                    </span>
                  </div>
                  <Progress value={calorieProgress} className="h-3 bg-gray-200" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(calorieProgress)}% complete</span>
                    <span>{targetDayCalories - totalCalories} remaining</span>
                  </div>
                </div>

                {/* Protein Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-700">Protein</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {totalProtein.toFixed(1)}g / {proteinTarget}g
                    </span>
                  </div>
                  <Progress value={proteinProgress} className="h-3 bg-gray-200" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(proteinProgress)}% complete</span>
                    <span>{(proteinTarget - totalProtein).toFixed(1)}g remaining</span>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Quick Actions</h3>
                    <p className="text-sm text-gray-600">Meal management</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start bg-white hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snack
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start bg-white hover:bg-gray-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start bg-white hover:bg-gray-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Set Reminders
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Enhanced Week Navigation */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      Week of {format(weekStartDate, 'MMMM d, yyyy')}
                    </h2>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                      variant="outline"
                      size="sm"
                      className="px-4"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentWeekOffset(0)}
                      variant={currentWeekOffset === 0 ? "default" : "outline"}
                      size="sm"
                      className="px-4"
                    >
                      Current
                    </Button>
                    <Button
                      onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                      variant="outline"
                      size="sm"
                      className="px-4"
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Enhanced Day Selector */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const dayNumber = i + 1;
                    const dayDate = addDays(weekStartDate, i);
                    const isSelected = selectedDayNumber === dayNumber;
                    const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    
                    return (
                      <Button
                        key={dayNumber}
                        onClick={() => setSelectedDayNumber(dayNumber)}
                        variant={isSelected ? "default" : "outline"}
                        className={`p-4 h-auto flex flex-col items-center gap-2 transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                            : 'bg-white hover:bg-gray-50'
                        } ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                      >
                        <span className="text-xs font-medium opacity-75">
                          {format(dayDate, 'EEE')}
                        </span>
                        <span className="text-lg font-bold">
                          {format(dayDate, 'd')}
                        </span>
                        {isToday && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Meals Display */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      {format(selectedDate, 'EEEE')} Meals
                    </h2>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
                    {todaysMeals?.length || 0} meals planned
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!currentWeekPlan ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <ChefHat className="w-12 h-12 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No Meal Plan Yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Create your first AI-powered meal plan tailored to your preferences and goals.
                    </p>
                    <Button
                      onClick={() => setShowAIDialog(true)}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Your First Plan
                    </Button>
                  </div>
                ) : todaysMeals?.length > 0 ? (
                  <div className="grid gap-4">
                    {todaysMeals.map((meal, index) => (
                      <Card key={`${meal.id}-${index}`} className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                                <h4 className="font-bold text-lg text-gray-800">{meal.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {meal.meal_type}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                                  <div className="text-lg font-bold text-red-600">{meal.calories}</div>
                                  <div className="text-xs text-red-500">calories</div>
                                </div>
                                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                  <div className="text-lg font-bold text-green-600">{meal.protein}g</div>
                                  <div className="text-xs text-green-500">protein</div>
                                </div>
                                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                  <div className="text-lg font-bold text-blue-600">{meal.prep_time || 15}m</div>
                                  <div className="text-xs text-blue-500">prep time</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                onClick={() => handleShowRecipe(meal)}
                                size="sm"
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                              >
                                <ChefHat className="w-4 h-4 mr-2" />
                                Recipe
                              </Button>
                              <Button
                                onClick={() => handleExchangeMeal(meal, index)}
                                size="sm"
                                variant="outline"
                                className="bg-white hover:bg-gray-50"
                              >
                                Exchange
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No meals planned for this day</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EnhancedMealPlanPage;
