
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Sparkles,
  Plus,
  ChefHat,
  RotateCcw,
  Calendar,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import { format, addDays } from "date-fns";
import MealPlanLoadingBackdrop from "./MealPlanLoadingBackdrop";
import ShoppingListDrawer from "../shopping-list/ShoppingListDrawer";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";
import SnackPickerDialog from "./SnackPickerDialog";
import MealPlanAIDialog from "./MealPlanAIDialog";
import { toast } from "sonner";

const MealPlanPage = () => {
  const { t, isRTL } = useLanguage();
  const mealPlanState = useMealPlanState();
  
  const [showShoppingDrawer, setShowShoppingDrawer] = useState(false);
  const [showSnackDialog, setShowSnackDialog] = useState(false);
  const [selectedDayForSnack, setSelectedDayForSnack] = useState(1);

  const weekDays = [
    { number: 1, name: 'Sat', fullName: 'Saturday', date: mealPlanState.weekStartDate },
    { number: 2, name: 'Sun', fullName: 'Sunday', date: addDays(mealPlanState.weekStartDate, 1) },
    { number: 3, name: 'Mon', fullName: 'Monday', date: addDays(mealPlanState.weekStartDate, 2) },
    { number: 4, name: 'Tue', fullName: 'Tuesday', date: addDays(mealPlanState.weekStartDate, 3) },
    { number: 5, name: 'Wed', fullName: 'Wednesday', date: addDays(mealPlanState.weekStartDate, 4) },
    { number: 6, name: 'Thu', fullName: 'Thursday', date: addDays(mealPlanState.weekStartDate, 5) },
    { number: 7, name: 'Fri', fullName: 'Friday', date: addDays(mealPlanState.weekStartDate, 6) }
  ];

  const handleAddSnack = (dayNumber: number) => {
    setSelectedDayForSnack(dayNumber);
    setShowSnackDialog(true);
  };

  const handleSnackAdded = async () => {
    setShowSnackDialog(false);
    await mealPlanState.refetch();
    toast.success("Snack added successfully ✅");
  };

  const handleGenerateAIPlan = async () => {
    try {
      const success = await mealPlanState.handleGenerateAIPlan();
      if (success) {
        mealPlanState.setShowAIDialog(false);
        toast.success("Meal plan generated successfully! 🎉");
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      toast.error("Failed to generate meal plan. Please try again.");
    }
  };

  const getMealsByType = (dayMeals: any[]) => {
    const grouped = dayMeals.reduce((acc, meal) => {
      const type = meal.meal_type || 'snack';
      if (!acc[type]) acc[type] = [];
      acc[type].push(meal);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      breakfast: grouped.breakfast || [],
      lunch: grouped.lunch || [],
      dinner: grouped.dinner || [],
      snack: grouped.snack || []
    };
  };

  const calculateDayStats = (dayMeals: any[]) => {
    return dayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message="Loading your meal plan..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message="Generating your meal plan..."
      />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
                <p className="text-gray-600">
                  {format(mealPlanState.weekStartDate, 'MMMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {mealPlanState.currentWeekPlan && (
                <Button
                  onClick={() => setShowShoppingDrawer(true)}
                  variant="outline"
                  className="border-gray-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
              )}
              
              <Button
                onClick={() => mealPlanState.setShowAIDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {mealPlanState.currentWeekPlan ? 'Regenerate' : 'Generate Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {mealPlanState.currentWeekPlan ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                {/* Today's Stats */}
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Today's Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">{mealPlanState.totalCalories}</div>
                      <div className="text-blue-100 text-sm mb-4">calories consumed</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold">{mealPlanState.totalProtein.toFixed(1)}g</div>
                          <div className="text-blue-100">protein</div>
                        </div>
                        <div>
                          <div className="font-semibold">{mealPlanState.todaysMeals?.length || 0}</div>
                          <div className="text-blue-100">meals</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Snack
                    </Button>
                    <Button 
                      onClick={() => mealPlanState.setShowAIDialog(true)}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Regenerate Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Day Tabs */}
              <Tabs value={mealPlanState.selectedDayNumber.toString()} onValueChange={(value) => mealPlanState.setSelectedDayNumber(parseInt(value))}>
                <TabsList className="grid w-full grid-cols-7 mb-6">
                  {weekDays.map((day) => (
                    <TabsTrigger 
                      key={day.number} 
                      value={day.number.toString()}
                      className="flex flex-col py-3"
                    >
                      <span className="text-xs mb-1">{day.name}</span>
                      <span className="text-lg font-semibold">{format(day.date, 'd')}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {weekDays.map((day) => {
                  const dayMeals = mealPlanState.currentWeekPlan?.dailyMeals?.filter(
                    meal => meal.day_number === day.number
                  ) || [];
                  
                  const mealsByType = getMealsByType(dayMeals);
                  const dayStats = calculateDayStats(dayMeals);

                  return (
                    <TabsContent key={day.number} value={day.number.toString()} className="space-y-6">
                      {/* Day Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">{day.fullName}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{dayStats.calories} cal</span>
                          <span>{dayStats.protein.toFixed(1)}g protein</span>
                          <span>{dayMeals.length} meals</span>
                        </div>
                      </div>

                      {/* Meals by Type */}
                      {Object.entries(mealsByType).map(([mealType, meals]) => {
                        if (meals.length === 0 && mealType !== 'snack') return null;
                        
                        return (
                          <div key={mealType} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900 capitalize">
                                {mealType}
                              </h3>
                              {mealType === 'snack' && (
                                <Button
                                  onClick={() => handleAddSnack(day.number)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Snack
                                </Button>
                              )}
                            </div>

                            {meals.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {meals.map((meal, index) => (
                                  <Card key={`${meal.id}-${index}`} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-medium text-gray-900 flex-1 mr-2">{meal.name}</h4>
                                        <Badge variant="secondary" className="text-xs">
                                          {mealType}
                                        </Badge>
                                      </div>

                                      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                                        <div className="text-center">
                                          <div className="font-semibold text-red-600">{Math.round(meal.calories || 0)}</div>
                                          <div className="text-gray-500">cal</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="font-semibold text-blue-600">{Math.round(meal.protein || 0)}g</div>
                                          <div className="text-gray-500">protein</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="font-semibold text-green-600">{Math.round(meal.carbs || 0)}g</div>
                                          <div className="text-gray-500">carbs</div>
                                        </div>
                                      </div>

                                      {meal.prep_time && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                          <Clock className="w-3 h-3" />
                                          <span>{meal.prep_time} min prep</span>
                                        </div>
                                      )}

                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => mealPlanState.handleShowRecipe(meal)}
                                          variant="outline"
                                          size="sm"
                                          className="flex-1"
                                        >
                                          <ChefHat className="w-3 h-3 mr-1" />
                                          Recipe
                                        </Button>
                                        <Button
                                          onClick={() => mealPlanState.handleExchangeMeal(meal)}
                                          variant="outline"
                                          size="sm"
                                          className="flex-1"
                                        >
                                          <RotateCcw className="w-3 h-3 mr-1" />
                                          Exchange
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : mealType === 'snack' ? (
                              <Card className="border-dashed border-2 border-gray-200">
                                <CardContent className="p-6 text-center">
                                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-500 mb-3">No snacks planned</p>
                                  <Button
                                    onClick={() => handleAddSnack(day.number)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    Add Snack
                                  </Button>
                                </CardContent>
                              </Card>
                            ) : null}
                          </div>
                        );
                      })}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </div>
        ) : (
          // Empty State
          <Card className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Meal Plan Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Generate your personalized meal plan to get started with healthy eating habits
            </p>
            <Button 
              onClick={() => mealPlanState.setShowAIDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Meal Plan
            </Button>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <MealPlanAIDialog
        open={mealPlanState.showAIDialog}
        onOpenChange={mealPlanState.setShowAIDialog}
        preferences={mealPlanState.aiPreferences}
        onPreferencesChange={mealPlanState.setAiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
      />

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
        weekId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={() => toast.success("Shopping list updated ✅")}
      />

      {mealPlanState.selectedMeal && (
        <MealRecipeDialog
          isOpen={mealPlanState.showRecipeDialog}
          onClose={() => mealPlanState.setShowRecipeDialog(false)}
          meal={mealPlanState.selectedMeal}
          onRecipeGenerated={mealPlanState.handleRecipeGenerated}
        />
      )}

      {mealPlanState.selectedMeal && (
        <MealExchangeDialog
          isOpen={mealPlanState.showExchangeDialog}
          onClose={() => mealPlanState.setShowExchangeDialog(false)}
          currentMeal={mealPlanState.selectedMeal}
          onExchange={mealPlanState.handleRegeneratePlan}
        />
      )}
    </div>
  );
};

export default MealPlanPage;
