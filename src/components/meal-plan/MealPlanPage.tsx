import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Target,
  Flame,
  Sparkles
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
import MealPlanAIDialog from "./MealPlanAIDialog";
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

  // Enhanced AI generation handler
  const handleGenerateAIPlan = async () => {
    console.log('🎯 MealPlanPage: Starting AI generation with preferences:', mealPlanState.aiPreferences);
    
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

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message="Loading your meal plan..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 text-gray-900">
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message="Generating your meal plan..."
      />
      
      {/* Enhanced Header Section */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Meal Plan
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                  {format(mealPlanState.weekStartDate, 'MMMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Week Navigation */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset - 1)}
                  className="p-2 hover:bg-blue-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => mealPlanState.setCurrentWeekOffset(0)}
                  className={`px-4 font-medium ${mealPlanState.currentWeekOffset === 0 ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'}`}
                >
                  Current Week
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset + 1)}
                  className="p-2 hover:bg-blue-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
                <Button
                  variant={viewMode === 'daily' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('daily')}
                  className={`h-9 px-4 ${viewMode === 'daily' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'hover:bg-blue-50'}`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Daily
                </Button>
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('weekly')}
                  className={`h-9 px-4 ${viewMode === 'weekly' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'hover:bg-blue-50'}`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Weekly
                </Button>
              </div>

              {/* Shopping List Button */}
              {mealPlanState.currentWeekPlan && (
                <Button 
                  onClick={() => setShowShoppingDrawer(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
          <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
              <UtensilsCrossed className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              No Meal Plan Yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg">Generate your first AI-powered meal plan to get started!</p>
            <Button 
              onClick={() => mealPlanState.setShowAIDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Generate Meal Plan
            </Button>
          </Card>
        ) : (
          <>
            {/* Weekly Overview - Moved to Top */}
            <Card className="mb-6 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Flame className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalCalories.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 font-medium">Total Calories</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{weeklyStats.avgDailyCalories}</div>
                    <div className="text-sm text-gray-600 font-medium">Daily Average</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UtensilsCrossed className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{weeklyStats.totalMeals}</div>
                    <div className="text-sm text-gray-600 font-medium">Total Meals</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalProtein.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600 font-medium">Total Protein</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={() => mealPlanState.setShowAIDialog(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Regenerate Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            {viewMode === 'daily' ? (
              <Tabs value={mealPlanState.selectedDayNumber.toString()} onValueChange={(value) => mealPlanState.setSelectedDayNumber(parseInt(value))}>
                <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-2xl mb-6">
                  {weekDays.map((day) => (
                    <TabsTrigger 
                      key={day.number} 
                      value={day.number.toString()}
                      className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900 transition-all duration-300 flex flex-col py-4 rounded-xl font-medium"
                    >
                      <span className="text-xs font-semibold opacity-80">{day.name.slice(0, 3)}</span>
                      <span className="text-xl font-bold">{format(day.date, 'd')}</span>
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
          </>
        )}
      </div>

      {/* AI Generation Dialog */}
      <MealPlanAIDialog
        open={mealPlanState.showAIDialog}
        onOpenChange={mealPlanState.setShowAIDialog}
        preferences={mealPlanState.aiPreferences}
        onPreferencesChange={mealPlanState.setAiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
      />

      {/* Other Dialogs */}
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
