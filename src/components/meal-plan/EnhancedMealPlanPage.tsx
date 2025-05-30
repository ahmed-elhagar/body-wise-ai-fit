
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Plus, 
  Calendar,
  TrendingUp,
  Clock,
  Users,
  ChefHat,
  ArrowLeftRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import SnackPickerDialog from "./SnackPickerDialog";
import ShoppingListDrawer from "./ShoppingListDrawer";
import MealPlanLoadingBackdrop from "./MealPlanLoadingBackdrop";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";

const EnhancedMealPlanPage = () => {
  const { t, isRTL } = useLanguage();
  const mealPlanState = useMealPlanPage();
  
  const [showSnackDialog, setShowSnackDialog] = useState(false);
  const [showShoppingDrawer, setShowShoppingDrawer] = useState(false);
  const [selectedDayForSnack, setSelectedDayForSnack] = useState(1);
  const [isAILoading, setIsAILoading] = useState(false);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    if (!mealPlanState.currentWeekPlan?.dailyMeals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return mealPlanState.currentWeekPlan.dailyMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [mealPlanState.currentWeekPlan]);

  const handleAddSnack = (dayNumber: number) => {
    setSelectedDayForSnack(dayNumber);
    setShowSnackDialog(true);
  };

  const handleSnackAdded = async () => {
    setShowSnackDialog(false);
    await mealPlanState.refetch();
  };

  const handleShowRecipe = (meal: any) => {
    mealPlanState.handleShowRecipe(meal);
  };

  const handleExchangeMeal = (meal: any, index: number) => {
    mealPlanState.handleExchangeMeal(meal, index);
  };

  const renderDayMeals = (dayNumber: number) => {
    const dayMeals = mealPlanState.currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === dayNumber
    ) || [];

    const dayCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const dayProtein = dayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);

    return (
      <div className="space-y-4">
        {/* Day Stats */}
        <Card className="bg-[#1E1F23] border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Daily Calories</p>
                <p className="text-lg font-semibold text-white">{dayCalories}</p>
                <Progress value={(dayCalories / 2000) * 100} className="mt-2" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Protein</p>
                <p className="text-lg font-semibold text-white">{dayProtein.toFixed(1)}g</p>
                <Progress value={(dayProtein / 150) * 100} className="mt-2" />
              </div>
            </div>
            <Button 
              onClick={() => handleAddSnack(dayNumber)}
              className="w-full mt-4 bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white transition-all duration-300 hover:scale-[1.03]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Snack
            </Button>
          </CardContent>
        </Card>

        {/* Meals */}
        <div className="space-y-3">
          {dayMeals.map((meal, index) => (
            <Card key={meal.id} className="bg-[#1E1F23] border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] text-white">
                        {meal.meal_type}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-white mb-2 group-hover:text-[#FF8F4C] transition-colors">
                      {meal.name}
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="font-medium text-[#FF6F3C]">{meal.calories || 0}</span>
                        <div className="text-gray-400">cal</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="font-medium text-green-400">{meal.protein || 0}g</span>
                        <div className="text-gray-400">protein</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="font-medium text-blue-400">{meal.carbs || 0}g</span>
                        <div className="text-gray-400">carbs</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <span className="font-medium text-yellow-400">{meal.fat || 0}g</span>
                        <div className="text-gray-400">fat</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-[#FF6F3C] hover:text-white hover:border-[#FF6F3C]"
                    onClick={() => handleShowRecipe(meal)}
                  >
                    <ChefHat className="w-3 h-3 mr-1" />
                    Recipe
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    onClick={() => handleExchangeMeal(meal, index)}
                  >
                    <ArrowLeftRight className="w-3 h-3 mr-1" />
                    Exchange
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message="Loading your meal plan..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MealPlanLoadingBackdrop 
        isLoading={isAILoading || mealPlanState.isGenerating} 
        message={mealPlanState.isGenerating ? "Generating your meal plan..." : "Processing..."}
      />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <UtensilsCrossed className="w-8 h-8" />
                Meal Plan
              </h1>
              <p className="text-orange-100">
                {mealPlanState.currentDate} • {mealPlanState.currentDay}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 text-white px-4 py-2">
                {Math.round(weeklyStats.calories / 7)} cal/day
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                {weeklyStats.protein.toFixed(0)}g protein/week
              </Badge>
              <Button 
                onClick={() => setShowShoppingDrawer(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shopping List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {!mealPlanState.currentWeekPlan ? (
          <Card className="bg-[#1E1F23] border-gray-700 p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#FF6F3C] to-[#FF8F4C] rounded-3xl flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Meal Plan Yet</h3>
            <p className="text-gray-400 mb-6">Generate your first meal plan to get started!</p>
            <Button 
              onClick={() => {
                setIsAILoading(true);
                mealPlanState.setShowAIDialog(true);
                setIsAILoading(false);
              }}
              className="bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white px-8 py-3"
            >
              Generate Meal Plan
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Stats */}
            <div className="lg:col-span-1">
              <Card className="bg-[#1E1F23] border-gray-700 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#FF6F3C]" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Calories</span>
                      <span className="text-white font-medium">{weeklyStats.calories}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Protein</span>
                      <span className="text-white font-medium">{weeklyStats.protein.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg Daily</span>
                      <span className="text-white font-medium">{Math.round(weeklyStats.calories / 7)} cal</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <Button 
                      onClick={() => mealPlanState.setShowAIDialog(true)}
                      className="w-full bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white"
                    >
                      Regenerate Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="1" className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-[#1E1F23] border border-gray-700 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <TabsTrigger 
                      key={day} 
                      value={day.toString()}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6F3C] data-[state=active]:to-[#FF8F4C] data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
                    >
                      Day {day}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <TabsContent key={day} value={day.toString()}>
                    {renderDayMeals(day)}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SnackPickerDialog
        isOpen={showSnackDialog}
        onClose={() => setShowSnackDialog(false)}
        dayNumber={selectedDayForSnack}
        weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={handleSnackAdded}
      />

      <ShoppingListDrawer
        isOpen={showShoppingDrawer}
        onClose={() => setShowShoppingDrawer(false)}
        weeklyPlan={mealPlanState.currentWeekPlan}
      />

      {mealPlanState.selectedMeal && (
        <MealRecipeDialog
          isOpen={mealPlanState.showRecipeDialog}
          onClose={mealPlanState.setShowRecipeDialog}
          meal={mealPlanState.selectedMeal}
          onRecipeGenerated={mealPlanState.handleRecipeGenerated}
        />
      )}

      {mealPlanState.selectedMeal && (
        <MealExchangeDialog
          isOpen={mealPlanState.showExchangeDialog}
          onClose={mealPlanState.setShowExchangeDialog}
          currentMeal={mealPlanState.selectedMeal}
          onExchange={mealPlanState.handleRegeneratePlan}
        />
      )}
    </div>
  );
};

export default EnhancedMealPlanPage;
