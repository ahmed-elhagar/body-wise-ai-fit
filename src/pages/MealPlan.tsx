
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { getCurrentSaturdayDay, getWeekStartDate, getCategoryForIngredient } from "@/utils/mealPlanUtils";
import MealPlanLayout from "@/components/MealPlanLayout";
import MealPlanLoadingScreen from "@/components/MealPlanLoadingScreen";
import MealPlanHeader from "@/components/MealPlanHeader";
import WeeklyNavigation from "@/components/WeeklyNavigation";
import DaySelector from "@/components/DaySelector";
import MealPlanActions from "@/components/MealPlanActions";
import MealPlanContent from "@/components/MealPlanContent";
import EmptyMealPlan from "@/components/EmptyMealPlan";
import WeeklyMealPlanView from "@/components/WeeklyMealPlanView";
import AIGenerationDialog from "@/components/AIGenerationDialog";
import AddSnackDialog from "@/components/AddSnackDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealRecipeDialog from "@/components/MealRecipeDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";
import type { Meal } from "@/types/meal";

const MealPlan = () => {
  const { t } = useLanguage();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(getCurrentSaturdayDay());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(-1);
  const [aiPreferences, setAiPreferences] = useState({
    duration: '7',
    cuisine: '',
    maxPrepTime: '30',
    mealTypes: 'all'
  });

  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { currentWeekPlan, isLoading } = useDynamicMealPlan(currentWeekOffset);

  const weekStartDate = getWeekStartDate(currentWeekOffset);

  // Convert DailyMeal to Meal type for compatibility
  const convertDailyMealToMeal = (dailyMeal: any): Meal => ({
    type: dailyMeal.meal_type || 'meal',
    time: '12:00',
    name: dailyMeal.name || 'Unnamed Meal',
    calories: dailyMeal.calories || 0,
    protein: dailyMeal.protein || 0,
    carbs: dailyMeal.carbs || 0,
    fat: dailyMeal.fat || 0,
    ingredients: dailyMeal.ingredients || [],
    instructions: dailyMeal.instructions || [],
    cookTime: dailyMeal.cook_time || 0,
    prepTime: dailyMeal.prep_time || 0,
    servings: dailyMeal.servings || 1,
    image: dailyMeal.image || '',
    youtubeId: dailyMeal.youtube_search_term || ''
  });

  // Calculate today's meals and totals
  const todaysDailyMeals = currentWeekPlan?.dailyMeals?.filter(meal => meal.day_number === selectedDayNumber) || [];
  const todaysMeals = todaysDailyMeals.map(convertDailyMealToMeal);
  const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);

  // Convert meals to shopping items
  const convertMealsToShoppingItems = (meals: Meal[]) => {
    const items: any[] = [];
    meals.forEach(meal => {
      meal.ingredients.forEach((ingredient: any) => {
        items.push({
          name: ingredient.name || ingredient,
          quantity: ingredient.quantity || '1',
          unit: ingredient.unit || 'piece',
          category: getCategoryForIngredient(ingredient.name || ingredient)
        });
      });
    });
    return items;
  };

  const handleRegeneratePlan = () => {
    setShowAIDialog(true);
  };

  const handleGenerateAIPlan = () => {
    generateMealPlan(aiPreferences);
    setShowAIDialog(false);
  };

  const handleShowRecipe = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: Meal, index: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  };

  const handleFinalizePlan = () => {
    toast.success(t('mealPlan.planFinalized'));
  };

  const refetch = () => {
    // Force component re-render by updating state
    setCurrentWeekOffset(currentWeekOffset);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (isGenerating) {
    return (
      <MealPlanLoadingScreen message={t('mealPlan.generating')} />
    );
  }

  if (isLoading) {
    return (
      <MealPlanLoadingScreen message={t('mealPlan.loading')} />
    );
  }

  return (
    <MealPlanLayout>
      <div className="space-y-4 sm:space-y-6">
        <MealPlanHeader
          currentDate={currentDate}
          currentDay={currentDay}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegeneratePlan={handleRegeneratePlan}
          isGenerating={isGenerating}
          dietType={currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType}
          totalWeeklyCalories={currentWeekPlan?.weeklyPlan?.total_calories}
        />

        <WeeklyNavigation
          currentWeekOffset={currentWeekOffset}
          onWeekChange={setCurrentWeekOffset}
          weekStartDate={weekStartDate}
        />

        {viewMode === 'daily' && (
          <DaySelector
            selectedDayNumber={selectedDayNumber}
            onDaySelect={setSelectedDayNumber}
          />
        )}

        <MealPlanActions
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddSnack={() => setShowAddSnackDialog(true)}
          onFinalizePlan={handleFinalizePlan}
          showAddSnack={viewMode === 'daily' && currentWeekPlan !== null}
        />

        {!currentWeekPlan ? (
          <EmptyMealPlan onGenerate={() => setShowAIDialog(true)} />
        ) : viewMode === 'weekly' ? (
          <WeeklyMealPlanView
            weeklyPlan={currentWeekPlan.weeklyPlan}
            onShowRecipe={handleShowRecipe}
            onExchangeMeal={handleExchangeMeal}
          />
        ) : (
          <MealPlanContent
            selectedDayNumber={selectedDayNumber}
            todaysMeals={todaysMeals}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            onShowShoppingList={() => setShowShoppingListDialog(true)}
            onShowRecipe={handleShowRecipe}
            onExchangeMeal={handleExchangeMeal}
          />
        )}

        <AIGenerationDialog
          isOpen={showAIDialog}
          onClose={() => setShowAIDialog(false)}
          preferences={aiPreferences}
          onPreferencesChange={setAiPreferences}
          onGenerate={handleGenerateAIPlan}
          isGenerating={isGenerating}
        />

        <AddSnackDialog
          isOpen={showAddSnackDialog}
          onClose={() => setShowAddSnackDialog(false)}
          selectedDay={selectedDayNumber}
          weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
          onSnackAdded={() => {
            refetch();
            setShowAddSnackDialog(false);
          }}
          currentDayCalories={totalCalories}
          targetDayCalories={2000}
        />

        <ShoppingListDialog
          isOpen={showShoppingListDialog}
          onClose={() => setShowShoppingListDialog(false)}
          items={convertMealsToShoppingItems(todaysMeals)}
        />

        {selectedMeal && (
          <MealRecipeDialog
            isOpen={showRecipeDialog}
            onClose={() => setShowRecipeDialog(false)}
            meal={selectedMeal}
          />
        )}

        {selectedMeal && (
          <MealExchangeDialog
            isOpen={showExchangeDialog}
            onClose={() => setShowExchangeDialog(false)}
            currentMeal={selectedMeal}
            onExchange={() => {
              refetch();
              setShowExchangeDialog(false);
            }}
          />
        )}
      </div>
    </MealPlanLayout>
  );
};

export default MealPlan;
