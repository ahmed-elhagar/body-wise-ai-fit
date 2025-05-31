
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
  Shuffle,
  Eye,
  Activity
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

  const calculateWeeklyStats = () => {
    if (!mealPlanState.currentWeekPlan?.dailyMeals) return { totalCalories: 0, totalProtein: 0, totalMeals: 0, avgDailyCalories: 0 };
    
    const stats = mealPlanState.currentWeekPlan.dailyMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      meals: acc.meals + 1
    }), { calories: 0, protein: 0, meals: 0 });

    return {
      totalCalories: stats.calories,
      totalProtein: stats.protein,
      totalMeals: stats.meals,
      avgDailyCalories: Math.round(stats.calories / 7)
    };
  };

  const weeklyStats = calculateWeeklyStats();

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message={t('mealPlan.loading')} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 ${isRTL ? 'rtl' : 'ltr'}`}>
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message={t('mealPlan.generating')}
      />
      
      {/* Hero Header with subtle gradient */}
      <div className="bg-gradient-to-r from-[#3D8CFF] via-[#1E60E0] to-[#3D8CFF] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-3xl font-bold text-white mb-1">{t('mealPlan.title')}</h1>
                <p className="text-blue-100 font-medium">
                  {format(mealPlanState.weekStartDate, 'MMMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    viewMode === 'daily'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('mealPlan.dailyView')}
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    viewMode === 'weekly'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white hover:bg-white/20'
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
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('mealPlan.shoppingList')}
                  </Button>
                  
                  <Button
                    onClick={() => mealPlanState.handleRegeneratePlan()}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    {t('mealPlan.shuffleMeals')}
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => mealPlanState.setShowAIDialog(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {mealPlanState.currentWeekPlan ? t('mealPlan.regenerate') : t('mealPlan.generateAIPlan')}
              </Button>
            </div>
          </div>

          {/* Weekly Stats in Header */}
          {mealPlanState.currentWeekPlan && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {weeklyStats.totalCalories.toLocaleString()}
                </div>
                <div className="text-sm text-blue-100 font-medium">{t('mealPlan.totalCalories')}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {weeklyStats.avgDailyCalories}
                </div>
                <div className="text-sm text-blue-100 font-medium">{t('mealPlan.dailyAverage')}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {weeklyStats.totalMeals}
                </div>
                <div className="text-sm text-blue-100 font-medium">{t('mealPlan.totalMeals')}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {weeklyStats.totalProtein.toFixed(1)}g
                </div>
                <div className="text-sm text-blue-100 font-medium">{t('mealPlan.totalProtein')}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Week Navigation */}
        <Card className="mb-8 shadow-sm border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset - 1)}
                className="h-12 w-12 p-0 hover:bg-gray-100 rounded-xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="text-center flex-1">
                <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t('mealPlan.week')} {Math.abs(mealPlanState.currentWeekOffset) + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(mealPlanState.weekStartDate, 'MMM d')} - {format(addDays(mealPlanState.weekStartDate, 6), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                {mealPlanState.currentWeekOffset === 0 ? (
                  <Badge variant="secondary" className="mt-3 bg-green-100 text-green-700 font-medium">
                    {t('mealPlan.currentWeek')}
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => mealPlanState.setCurrentWeekOffset(0)}
                    className="mt-3 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('mealPlan.backToCurrentWeek')}
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset + 1)}
                className="h-12 w-12 p-0 hover:bg-gray-100 rounded-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {mealPlanState.currentWeekPlan ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Today's Stats */}
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl border-0 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className={`text-lg font-bold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Target className="w-5 h-5" />
                      {t('mealPlan.todaysSummary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{mealPlanState.totalCalories}</div>
                      <div className="text-red-100 text-sm mb-4">{t('mealPlan.caloriesConsumed')}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-bold text-lg">{mealPlanState.totalProtein.toFixed(1)}g</div>
                          <div className="text-red-100">{t('mealPlan.protein')}</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{mealPlanState.todaysMeals?.length || 0}</div>
                          <div className="text-red-100">{t('mealPlan.meals')}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-lg border-0 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900">{t('mealPlan.quickActions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50 border-green-200 text-green-600 font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('mealPlan.addSnack')}
                    </Button>
                    <Button 
                      onClick={() => mealPlanState.setShowAIDialog(true)}
                      variant="outline" 
                      className="w-full justify-start hover:bg-purple-50 border-purple-200 text-purple-600 font-medium"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t('mealPlan.regeneratePlan')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Weekly Overview */}
                <Card className="shadow-lg border-0 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className={`text-lg font-bold text-gray-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      {t('mealPlan.weeklyOverview')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-gray-600 font-medium">{t('mealPlan.totalCalories')}</span>
                      <span className="font-bold text-blue-600">{weeklyStats.totalCalories}</span>
                    </div>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-gray-600 font-medium">{t('mealPlan.totalProtein')}</span>
                      <span className="font-bold text-green-600">{weeklyStats.totalProtein.toFixed(1)}g</span>
                    </div>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-gray-600 font-medium">{t('mealPlan.totalMeals')}</span>
                      <span className="font-bold text-purple-600">{weeklyStats.totalMeals}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-medium text-gray-600">{t('mealPlan.dailyAverage')}</span>
                        <Target className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {weeklyStats.avgDailyCalories}
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
                    <TabsList className="grid w-full grid-cols-7 mb-8 bg-white shadow-md rounded-2xl h-auto p-2">
                      {weekDays.map((day) => (
                        <TabsTrigger 
                          key={day.number} 
                          value={day.number.toString()}
                          className="flex flex-col py-4 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl font-medium transition-all"
                        >
                          <span className="text-xs mb-1 opacity-80">{day.name}</span>
                          <span className="text-lg font-bold">{format(day.date, 'd')}</span>
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
                        <TabsContent key={day.number} value={day.number.toString()} className="space-y-8">
                          {/* Day Header */}
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h2 className="text-2xl font-bold text-gray-900">{day.fullName}</h2>
                            <div className={`flex items-center gap-3 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Badge className="bg-red-100 text-red-700 font-medium px-3 py-1">
                                {dayStats.calories} {t('mealPlan.cal')}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1">
                                {dayStats.protein.toFixed(1)}g {t('mealPlan.protein')}
                              </Badge>
                              <Badge className="bg-green-100 text-green-700 font-medium px-3 py-1">
                                {dayMeals.length} {t('mealPlan.meals')}
                              </Badge>
                            </div>
                          </div>

                          {/* Meals by Type */}
                          <div className="space-y-8">
                            {Object.entries(mealsByType).map(([mealType, meals]) => {
                              if (meals.length === 0 && mealType !== 'snack') return null;
                              
                              return (
                                <div key={mealType} className="space-y-4">
                                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <h3 className="text-xl font-bold text-gray-900">
                                      {t(`mealPlan.${mealType}`)}
                                    </h3>
                                    {mealType === 'snack' && (
                                      <Button
                                        onClick={() => handleAddSnack(day.number)}
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 border-green-200 hover:bg-green-50 font-medium"
                                      >
                                        <Plus className="w-4 h-4 mr-1" />
                                        {t('mealPlan.addSnack')}
                                      </Button>
                                    )}
                                  </div>

                                  {meals.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {meals.map((meal, index) => (
                                        <Card key={`${meal.id}-${index}`} className="hover:shadow-xl transition-all duration-300 shadow-md border-0 bg-white rounded-2xl group hover:scale-[1.02]">
                                          <CardContent className="p-6">
                                            <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                              <h4 className={`font-bold text-gray-900 flex-1 text-lg leading-tight ${isRTL ? 'ml-3 text-right' : 'mr-3'}`}>
                                                {meal.name}
                                              </h4>
                                              <Badge variant="outline" className="text-xs font-medium bg-orange-100 text-orange-700 border-orange-200">
                                                {t(`mealPlan.${mealType}`)}
                                              </Badge>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                              <div className="text-center">
                                                <div className="font-bold text-red-600 text-lg">{Math.round(meal.calories || 0)}</div>
                                                <div className="text-gray-500 text-xs">{t('mealPlan.cal')}</div>
                                              </div>
                                              <div className="text-center">
                                                <div className="font-bold text-blue-600 text-lg">{Math.round(meal.protein || 0)}g</div>
                                                <div className="text-gray-500 text-xs">{t('mealPlan.protein')}</div>
                                              </div>
                                              <div className="text-center">
                                                <div className="font-bold text-green-600 text-lg">{Math.round(meal.carbs || 0)}g</div>
                                                <div className="text-gray-500 text-xs">{t('mealPlan.carbs')}</div>
                                              </div>
                                            </div>

                                            {meal.prep_time && (
                                              <div className={`flex items-center gap-2 text-xs text-gray-500 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <Clock className="w-3 h-3" />
                                                <span>{meal.prep_time} {t('mealPlan.minPrep')}</span>
                                              </div>
                                            )}

                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                              <Button
                                                onClick={() => mealPlanState.handleShowRecipe(meal)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 font-medium"
                                              >
                                                <ChefHat className="w-3 h-3 mr-1" />
                                                {t('mealPlan.recipe')}
                                              </Button>
                                              <Button
                                                onClick={() => mealPlanState.handleExchangeMeal(meal)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 font-medium"
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
                                    <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 rounded-2xl">
                                      <CardContent className="p-8 text-center">
                                        <Plus className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-4 font-medium">{t('mealPlan.noMealsPlanned')}</p>
                                        <Button
                                          onClick={() => handleAddSnack(day.number)}
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-200 hover:bg-green-50 font-medium"
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
                // Weekly View - Restored
                <Card className="shadow-xl border-0 rounded-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Eye className="w-6 h-6 text-blue-600" />
                      {t('mealPlan.weeklyView')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {weekDays.map((day) => {
                        const dayMeals = mealPlanState.currentWeekPlan?.dailyMeals?.filter(
                          meal => meal.day_number === day.number
                        ) || [];
                        const dayStats = calculateDayStats(dayMeals);

                        return (
                          <Card key={day.number} className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 border-0 rounded-2xl group hover:scale-[1.02]"
                                onClick={() => {setViewMode('daily'); mealPlanState.setSelectedDayNumber(day.number);}}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-bold text-gray-900">{day.fullName}</CardTitle>
                              <p className="text-sm text-gray-500 font-medium">{format(day.date, 'MMM d')}</p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3 text-sm">
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-gray-600 font-medium">{t('mealPlan.meals')}:</span>
                                  <span className="font-bold text-purple-600">{dayMeals.length}</span>
                                </div>
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-gray-600 font-medium">{t('mealPlan.cal')}:</span>
                                  <span className="font-bold text-red-600">{dayStats.calories}</span>
                                </div>
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-gray-600 font-medium">{t('mealPlan.protein')}:</span>
                                  <span className="font-bold text-blue-600">{dayStats.protein.toFixed(1)}g</span>
                                </div>
                                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-gray-600 font-medium">{t('mealPlan.carbs')}:</span>
                                  <span className="font-bold text-green-600">{dayStats.carbs.toFixed(1)}g</span>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-gray-100">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full text-blue-600 hover:bg-blue-50 font-medium group-hover:bg-blue-100"
                                >
                                  <Activity className="w-4 h-4 mr-2" />
                                  {t('mealPlan.selectDay')}
                                </Button>
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
          <Card className="p-16 text-center shadow-2xl border-0 bg-white rounded-3xl">
            <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center">
              <ChefHat className="w-14 h-14 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('mealPlan.noMealPlanYet')}</h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
              {t('mealPlan.generatePersonalizedPlan')}
            </p>
            <Button 
              onClick={() => mealPlanState.setShowAIDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 text-lg shadow-xl rounded-2xl"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              {t('mealPlan.generateMealPlan')}
            </Button>
          </Card>
        )}
      </div>

      {/* Dialogs with proper styling */}
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
