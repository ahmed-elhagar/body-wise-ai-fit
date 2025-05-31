
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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Shuffle
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
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  const weekDays = [
    { number: 1, name: t('mealPlan.sat'), fullName: t('mealPlan.saturday'), date: mealPlanState.weekStartDate },
    { number: 2, name: t('mealPlan.sun'), fullName: t('mealPlan.sunday'), date: addDays(mealPlanState.weekStartDate, 1) },
    { number: 3, name: t('mealPlan.mon'), fullName: t('mealPlan.monday'), date: addDays(mealPlanState.weekStartDate, 2) },
    { number: 4, name: t('mealPlan.tue'), fullName: t('mealPlan.tuesday'), date: addDays(mealPlanState.weekStartDate, 3) },
    { number: 5, name: t('mealPlan.wed'), fullName: t('mealPlan.wednesday'), date: addDays(mealPlanState.weekStartDate, 4) },
    { number: 6, name: t('mealPlan.thu'), fullName: t('mealPlan.thursday'), date: addDays(mealPlanState.weekStartDate, 5) },
    { number: 7, name: t('mealPlan.fri'), fullName: t('mealPlan.friday'), date: addDays(mealPlanState.weekStartDate, 6) }
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 ${isRTL ? 'rtl' : 'ltr'}`}>
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message="Generating your meal plan..."
      />
      
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-2xl font-bold text-gray-900">{t('mealPlan.title')}</h1>
                <p className="text-gray-600 font-medium">
                  {format(mealPlanState.weekStartDate, 'MMMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'daily'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('mealPlan.dailyView')}
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'weekly'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('mealPlan.weeklyView')}
                </button>
              </div>

              {mealPlanState.currentWeekPlan && (
                <>
                  <Button
                    onClick={() => setShowShoppingDrawer(true)}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('mealPlan.shoppingList')}
                  </Button>
                  
                  <Button
                    onClick={() => mealPlanState.handleRegeneratePlan()}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 shadow-sm"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    {t('mealPlan.shuffleMeals')}
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => mealPlanState.setShowAIDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {mealPlanState.currentWeekPlan ? t('mealPlan.regenerate') : t('mealPlan.generateAIPlan')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Week Navigation */}
        <Card className="mb-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset - 1)}
                className="h-10 w-10 p-0 hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="text-center flex-1">
                <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('mealPlan.week')} {Math.abs(mealPlanState.currentWeekOffset) + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(mealPlanState.weekStartDate, 'MMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                {mealPlanState.currentWeekOffset === 0 ? (
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                    {t('mealPlan.currentWeek')}
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => mealPlanState.setCurrentWeekOffset(0)}
                    className="mt-2 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    {t('mealPlan.backToCurrentWeek')}
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset + 1)}
                className="h-10 w-10 p-0 hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {mealPlanState.currentWeekPlan ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-6 space-y-4">
                {/* Today's Stats */}
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Target className="w-5 h-5" />
                      {t('mealPlan.todaysProgress')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">{mealPlanState.totalCalories}</div>
                      <div className="text-blue-100 text-sm mb-4">{t('mealPlan.caloriesConsumed')}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold">{mealPlanState.totalProtein.toFixed(1)}g</div>
                          <div className="text-blue-100">{t('mealPlan.protein')}</div>
                        </div>
                        <div>
                          <div className="font-semibold">{mealPlanState.todaysMeals?.length || 0}</div>
                          <div className="text-blue-100">{t('mealPlan.meals')}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">{t('mealPlan.quickActions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50 border-green-200 text-green-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('mealPlan.addSnack')}
                    </Button>
                    <Button 
                      onClick={() => mealPlanState.setShowAIDialog(true)}
                      variant="outline" 
                      className="w-full justify-start hover:bg-purple-50 border-purple-200 text-purple-600"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t('mealPlan.regeneratePlan')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Weekly Overview */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-lg font-semibold text-gray-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      {t('mealPlan.weeklyOverview')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-gray-600">{t('mealPlan.totalCalories')}</span>
                      <span className="font-bold text-blue-600">{mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories || 0}</span>
                    </div>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-gray-600">{t('mealPlan.totalProtein')}</span>
                      <span className="font-bold text-green-600">{mealPlanState.currentWeekPlan?.weeklyPlan?.total_protein || 0}g</span>
                    </div>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-gray-600">{t('mealPlan.totalMeals')}</span>
                      <span className="font-bold text-purple-600">{mealPlanState.currentWeekPlan?.dailyMeals?.length || 0}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-medium text-gray-600">{t('mealPlan.dailyAverage')}</span>
                        <Target className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {Math.round((mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories || 0) / 7)}
                        </div>
                        <div className="text-xs text-gray-500">{t('mealPlan.caloriesPerDay')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              {viewMode === 'daily' ? (
                <>
                  {/* Day Tabs */}
                  <Tabs value={mealPlanState.selectedDayNumber.toString()} onValueChange={(value) => mealPlanState.setSelectedDayNumber(parseInt(value))}>
                    <TabsList className="grid w-full grid-cols-7 mb-6 bg-white shadow-sm">
                      {weekDays.map((day) => (
                        <TabsTrigger 
                          key={day.number} 
                          value={day.number.toString()}
                          className="flex flex-col py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
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
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h2 className="text-xl font-semibold text-gray-900">{day.fullName}</h2>
                            <div className={`flex items-center gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">{dayStats.calories} {t('mealPlan.cal')}</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{dayStats.protein.toFixed(1)}g {t('mealPlan.protein')}</span>
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{dayMeals.length} {t('mealPlan.meals')}</span>
                            </div>
                          </div>

                          {/* Meals by Type */}
                          <div className="space-y-6">
                            {Object.entries(mealsByType).map(([mealType, meals]) => {
                              if (meals.length === 0 && mealType !== 'snack') return null;
                              
                              return (
                                <div key={mealType} className="space-y-3">
                                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <h3 className="text-lg font-medium text-gray-900">
                                      {t(`mealPlan.${mealType}`)}
                                    </h3>
                                    {mealType === 'snack' && (
                                      <Button
                                        onClick={() => handleAddSnack(day.number)}
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                      >
                                        <Plus className="w-4 h-4 mr-1" />
                                        {t('mealPlan.addSnack')}
                                      </Button>
                                    )}
                                  </div>

                                  {meals.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      {meals.map((meal, index) => (
                                        <Card key={`${meal.id}-${index}`} className="hover:shadow-lg transition-all shadow-sm border-0 bg-white/90 backdrop-blur-sm">
                                          <CardContent className="p-4">
                                            <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                              <h4 className={`font-medium text-gray-900 flex-1 ${isRTL ? 'ml-2 text-right' : 'mr-2'}`}>{meal.name}</h4>
                                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                                {t(`mealPlan.${mealType}`)}
                                              </Badge>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                                              <div className="text-center">
                                                <div className="font-semibold text-red-600">{Math.round(meal.calories || 0)}</div>
                                                <div className="text-gray-500">{t('mealPlan.cal')}</div>
                                              </div>
                                              <div className="text-center">
                                                <div className="font-semibold text-blue-600">{Math.round(meal.protein || 0)}g</div>
                                                <div className="text-gray-500">{t('mealPlan.protein')}</div>
                                              </div>
                                              <div className="text-center">
                                                <div className="font-semibold text-green-600">{Math.round(meal.carbs || 0)}g</div>
                                                <div className="text-gray-500">{t('mealPlan.carbs')}</div>
                                              </div>
                                            </div>

                                            {meal.prep_time && (
                                              <div className={`flex items-center gap-1 text-xs text-gray-500 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <Clock className="w-3 h-3" />
                                                <span>{meal.prep_time} {t('mealPlan.minPrep')}</span>
                                              </div>
                                            )}

                                            <div className="flex gap-2">
                                              <Button
                                                onClick={() => mealPlanState.handleShowRecipe(meal)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                              >
                                                <ChefHat className="w-3 h-3 mr-1" />
                                                {t('mealPlan.recipe')}
                                              </Button>
                                              <Button
                                                onClick={() => mealPlanState.handleExchangeMeal(meal)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                                              >
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                {t('mealPlan.exchange')}
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : mealType === 'snack' ? (
                                    <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
                                      <CardContent className="p-6 text-center">
                                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 mb-3">{t('mealPlan.noMealsPlanned')}</p>
                                        <Button
                                          onClick={() => handleAddSnack(day.number)}
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                          {t('mealPlan.addSnack')}
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </>
              ) : (
                // Weekly View
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{t('mealPlan.weeklyView')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {weekDays.map((day) => {
                        const dayMeals = mealPlanState.currentWeekPlan?.dailyMeals?.filter(
                          meal => meal.day_number === day.number
                        ) || [];
                        const dayStats = calculateDayStats(dayMeals);

                        return (
                          <Card key={day.number} className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50/50 border-0"
                                onClick={() => {setViewMode('daily'); mealPlanState.setSelectedDayNumber(day.number);}}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">{day.fullName}</CardTitle>
                              <p className="text-xs text-gray-500">{format(day.date, 'MMM d')}</p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-xs">
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span>{t('mealPlan.meals')}:</span>
                                  <span className="font-semibold">{dayMeals.length}</span>
                                </div>
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span>{t('mealPlan.cal')}:</span>
                                  <span className="font-semibold">{dayStats.calories}</span>
                                </div>
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span>{t('mealPlan.protein')}:</span>
                                  <span className="font-semibold">{dayStats.protein.toFixed(1)}g</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          // Empty State
          <Card className="p-12 text-center shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('mealPlan.noMealPlanYet')}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('mealPlan.generatePersonalizedPlan')}
            </p>
            <Button 
              onClick={() => mealPlanState.setShowAIDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('mealPlan.generateMealPlan')}
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
