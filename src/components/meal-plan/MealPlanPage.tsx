
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import { format, addDays } from "date-fns";
import MealPlanDayView from "./MealPlanDayView";
import MealPlanWeekView from "./MealPlanWeekView";
import ShoppingListDrawer from "../shopping-list/ShoppingListDrawer";
import MealPlanLoadingBackdrop from "./MealPlanLoadingBackdrop";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";
import SnackPickerDialog from "./SnackPickerDialog";
import { toast } from "sonner";

const MealPlanPage = () => {
  const { t, isRTL } = useLanguage();
  const mealPlanState = useMealPlanPage();
  
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showShoppingDrawer, setShowShoppingDrawer] = useState(false);
  const [showSnackDialog, setShowSnackDialog] = useState(false);
  const [selectedDayForSnack, setSelectedDayForSnack] = useState(1);

  // Get current week dates for display
  const weekDays = [
    { number: 1, name: 'Saturday', date: mealPlanState.weekStartDate },
    { number: 2, name: 'Sunday', date: addDays(mealPlanState.weekStartDate, 1) },
    { number: 3, name: 'Monday', date: addDays(mealPlanState.weekStartDate, 2) },
    { number: 4, name: 'Tuesday', date: addDays(mealPlanState.weekStartDate, 3) },
    { number: 5, name: 'Wednesday', date: addDays(mealPlanState.weekStartDate, 4) },
    { number: 6, name: 'Thursday', date: addDays(mealPlanState.weekStartDate, 5) },
    { number: 7, name: 'Friday', date: addDays(mealPlanState.weekStartDate, 6) }
  ];

  // Calculate weekly stats
  const weeklyStats = {
    totalCalories: mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories || 0,
    totalProtein: mealPlanState.currentWeekPlan?.weeklyPlan?.total_protein || 0,
    avgDailyCalories: Math.round((mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories || 0) / 7),
    totalMeals: mealPlanState.currentWeekPlan?.dailyMeals?.length || 0
  };

  const handleAddSnack = (dayNumber: number) => {
    setSelectedDayForSnack(dayNumber);
    setShowSnackDialog(true);
  };

  const handleSnackAdded = async () => {
    setShowSnackDialog(false);
    await mealPlanState.refetch();
    toast.success("Snack added and shopping list updated ✅");
  };

  const handleShoppingListUpdate = () => {
    toast.success("Shopping list updated ✅");
  };

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message="Loading your meal plan..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message="Generating your meal plan..."
      />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UtensilsCrossed className="w-8 h-8 text-blue-600" />
                Meal Plan
              </h1>
              <p className="text-gray-600 mt-1">
                {format(mealPlanState.weekStartDate, 'MMMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMMM d, yyyy')}
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Week Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset - 1)}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mealPlanState.setCurrentWeekOffset(0)}
                  className={`px-3 ${mealPlanState.currentWeekOffset === 0 ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  Current Week
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset + 1)}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'daily' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('daily')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-1" />
                  Daily
                </Button>
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('weekly')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4 mr-1" />
                  Weekly
                </Button>
              </div>

              {/* Shopping List Button */}
              {mealPlanState.currentWeekPlan && (
                <Button 
                  onClick={() => setShowShoppingDrawer(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {!mealPlanState.currentWeekPlan ? (
          <Card className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-3xl flex items-center justify-center">
              <UtensilsCrossed className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Meal Plan Yet</h3>
            <p className="text-gray-600 mb-6">Generate your first meal plan to get started!</p>
            <Button 
              onClick={() => mealPlanState.setShowAIDialog && mealPlanState.setShowAIDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Generate Meal Plan
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Stats */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Calories</span>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        {weeklyStats.totalCalories.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Daily</span>
                      <span className="font-medium text-gray-900">{weeklyStats.avgDailyCalories} cal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Protein</span>
                      <span className="font-medium text-gray-900">{weeklyStats.totalProtein.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Meals</span>
                      <span className="font-medium text-gray-900">{weeklyStats.totalMeals}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      onClick={() => mealPlanState.setShowAIDialog && mealPlanState.setShowAIDialog(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Regenerate Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {viewMode === 'daily' ? (
                <Tabs value={mealPlanState.selectedDayNumber.toString()} onValueChange={(value) => mealPlanState.setSelectedDayNumber(parseInt(value))}>
                  <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 mb-6">
                    {weekDays.map((day) => (
                      <TabsTrigger 
                        key={day.number} 
                        value={day.number.toString()}
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900 transition-colors flex flex-col py-3"
                      >
                        <span className="text-xs font-medium">{day.name.slice(0, 3)}</span>
                        <span className="text-lg font-bold">{format(day.date, 'd')}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {weekDays.map((day) => (
                    <TabsContent key={day.number} value={day.number.toString()}>
                      <MealPlanDayView
                        dayNumber={day.number}
                        weeklyPlan={mealPlanState.currentWeekPlan}
                        onShowRecipe={mealPlanState.handleShowRecipe}
                        onExchangeMeal={mealPlanState.handleExchangeMeal}
                        onAddSnack={() => handleAddSnack(day.number)}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <MealPlanWeekView
                  weeklyPlan={mealPlanState.currentWeekPlan}
                  weekDays={weekDays}
                  onShowRecipe={mealPlanState.handleShowRecipe}
                  onExchangeMeal={mealPlanState.handleExchangeMeal}
                  onAddSnack={handleAddSnack}
                />
              )}
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
        weekId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={handleShoppingListUpdate}
      />

      {mealPlanState.selectedMeal && (
        <MealRecipeDialog
          isOpen={mealPlanState.showRecipeDialog}
          onClose={() => mealPlanState.setShowRecipeDialog && mealPlanState.setShowRecipeDialog(false)}
          meal={mealPlanState.selectedMeal}
          onRecipeGenerated={mealPlanState.handleRecipeGenerated}
        />
      )}

      {mealPlanState.selectedMeal && (
        <MealExchangeDialog
          isOpen={mealPlanState.showExchangeDialog}
          onClose={() => mealPlanState.setShowExchangeDialog && mealPlanState.setShowExchangeDialog(false)}
          currentMeal={mealPlanState.selectedMeal}
          onExchange={mealPlanState.handleRegeneratePlan}
        />
      )}
    </div>
  );
};

export default MealPlanPage;
