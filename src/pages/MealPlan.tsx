import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { toast } from "sonner";
import MealRecipeDialog from "@/components/MealRecipeDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";
import MealPlanHeader from "@/components/MealPlanHeader";
import AIGenerationDialog from "@/components/AIGenerationDialog";
import DailySummary from "@/components/DailySummary";
import MealCard from "@/components/MealCard";
import WeeklyOverview from "@/components/WeeklyOverview";
import WeeklyNavigation from "@/components/WeeklyNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Utensils } from "lucide-react";
import type { Meal, ShoppingItem, Ingredient } from "@/types/meal";

const MealPlan = () => {
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  
  const [aiPreferences, setAiPreferences] = useState({
    duration: "1",
    cuisine: "",
    maxPrepTime: "30",
    mealTypes: "5"
  });

  const { currentWeekPlan, isLoading, getWeekStartDate } = useDynamicMealPlan(currentWeekOffset);

  // Calculate current date and week
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCurrentDayOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay() === 0 ? 7 : today.getDay();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[currentDay - 1];
  };

  const handleGenerateAIPlan = () => {
    console.log('Generating AI meal plan with preferences:', aiPreferences);
    generateMealPlan(aiPreferences);
    setShowAIDialog(false);
  };

  const handleRegeneratePlan = () => {
    console.log('Regenerating meal plan with preferences:', aiPreferences);
    generateMealPlan(aiPreferences);
    toast.success("Regenerating your meal plan...");
  };

  const handleShowRecipe = (meal: Meal) => {
    console.log('Showing recipe for meal:', meal);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: Meal, index: number) => {
    const alternatives = [
      {
        name: "Grilled Chicken Salad",
        calories: meal.calories + 10,
        reason: "Lighter protein option with similar nutrition",
        protein: meal.protein,
        carbs: meal.carbs - 5,
        fat: meal.fat,
        ingredients: [
          { name: "Grilled chicken breast", quantity: "4", unit: "oz" },
          { name: "Mixed greens", quantity: "2", unit: "cups" }
        ],
        instructions: [
          "Season and grill chicken breast until cooked through",
          "Combine greens and top with sliced chicken"
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 1
      }
    ];
    
    setSelectedMeal({ current: meal, alternatives, index });
    setShowExchangeDialog(true);
  };

  const handleShowShoppingList = () => {
    if (!currentWeekPlan?.dailyMeals) return;
    
    const shoppingItems: ShoppingItem[] = currentWeekPlan.dailyMeals
      .filter(meal => meal.day_number === selectedDayNumber)
      .flatMap(meal => {
        const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
        return ingredients.map((ingredient: any) => ({
          name: ingredient.name || 'Unknown ingredient',
          quantity: ingredient.quantity || "1",
          unit: ingredient.unit || "serving",
          category: getCategoryForIngredient(ingredient.name || '')
        }));
      });
    
    setSelectedMeal({ items: shoppingItems });
    setShowShoppingDialog(true);
  };

  const getCategoryForIngredient = (ingredient: string) => {
    const categories = {
      'protein': ['chicken', 'salmon', 'beef', 'turkey', 'eggs', 'tofu'],
      'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
      'vegetables': ['broccoli', 'spinach', 'tomatoes', 'cucumber', 'asparagus'],
      'fruits': ['apple', 'banana', 'berries'],
      'grains': ['rice', 'quinoa', 'oats', 'bread'],
      'pantry': ['oil', 'salt', 'pepper', 'herbs', 'spices']
    };
    
    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredient.toLowerCase().includes(item))) {
        return category;
      }
    }
    return 'other';
  };

  // Get meals for selected day
  const todaysMeals: Meal[] = currentWeekPlan?.dailyMeals
    ?.filter(meal => meal.day_number === selectedDayNumber)
    ?.map(meal => {
      const ingredients: Ingredient[] = Array.isArray(meal.ingredients) 
        ? meal.ingredients 
        : [];
      
      const instructions: string[] = Array.isArray(meal.instructions)
        ? meal.instructions
        : [];

      return {
        type: meal.meal_type,
        time: getMealTime(meal.meal_type),
        name: meal.name,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        ingredients,
        instructions,
        cookTime: meal.cook_time || 0,
        prepTime: meal.prep_time || 0,
        servings: meal.servings || 1,
        image: getMealEmoji(meal.meal_type),
        youtubeId: meal.youtube_search_term || "dQw4w9WgXcQ" // Fixed: Added required youtubeId property
      };
    }) || [];

  const getMealTime = (mealType: string) => {
    const times: { [key: string]: string } = {
      'breakfast': '8:00 AM',
      'lunch': '1:00 PM',
      'dinner': '7:00 PM',
      'snack': '3:00 PM'
    };
    return times[mealType.toLowerCase()] || '12:00 PM';
  };

  const getMealEmoji = (mealType: string) => {
    const emojis: { [key: string]: string } = {
      'breakfast': '🥣',
      'lunch': '🥗',
      'dinner': '🍽️',
      'snack': '🍎'
    };
    return emojis[mealType.toLowerCase()] || '🍽️';
  };

  // Calculate weekly overview from actual data
  const weeklyOverview = [
    { day: "Mon", calories: getDayCalories(1), status: selectedDayNumber === 1 ? "current" as const : "planned" as const },
    { day: "Tue", calories: getDayCalories(2), status: selectedDayNumber === 2 ? "current" as const : "planned" as const },
    { day: "Wed", calories: getDayCalories(3), status: selectedDayNumber === 3 ? "current" as const : "planned" as const },
    { day: "Thu", calories: getDayCalories(4), status: selectedDayNumber === 4 ? "current" as const : "planned" as const },
    { day: "Fri", calories: getDayCalories(5), status: selectedDayNumber === 5 ? "current" as const : "planned" as const },
    { day: "Sat", calories: getDayCalories(6), status: selectedDayNumber === 6 ? "current" as const : "planned" as const },
    { day: "Sun", calories: getDayCalories(7), status: selectedDayNumber === 7 ? "current" as const : "planned" as const }
  ];

  function getDayCalories(dayNumber: number): number {
    if (!currentWeekPlan?.dailyMeals) return 0;
    return currentWeekPlan.dailyMeals
      .filter(meal => meal.day_number === dayNumber)
      .reduce((sum, meal) => sum + (meal.calories || 0), 0);
  }

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <MealPlanHeader
          currentDate={formatDate(today)}
          currentDay={getCurrentDayOfWeek()}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegeneratePlan={handleRegeneratePlan}
          isGenerating={isGenerating}
        />

        <WeeklyNavigation
          currentWeekOffset={currentWeekOffset}
          onWeekChange={setCurrentWeekOffset}
          weekStartDate={currentWeekStart}
        />

        {/* Day Selection */}
        <Card className="mb-6 p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Select Day</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <Button
                key={day}
                variant={selectedDayNumber === index + 1 ? "default" : "outline"}
                className={`${selectedDayNumber === index + 1 ? 'bg-fitness-gradient text-white' : 'bg-white/80'}`}
                onClick={() => setSelectedDayNumber(index + 1)}
              >
                {day}
              </Button>
            ))}
          </div>
        </Card>

        {currentWeekPlan && todaysMeals.length > 0 ? (
          <div className="grid lg:grid-cols-4 gap-6">
            <DailySummary
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              onShowShoppingList={handleShowShoppingList}
            />

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][selectedDayNumber - 1]}'s Meals
                </h2>
                <Badge variant="outline" className="bg-white/80">
                  {todaysMeals.length} meals planned
                </Badge>
              </div>
              
              <div className="space-y-4">
                {todaysMeals.map((meal, index) => (
                  <MealCard
                    key={index}
                    meal={meal}
                    onShowRecipe={handleShowRecipe}
                    onExchangeMeal={(meal) => handleExchangeMeal(meal, index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meal Plan Yet</h3>
            <p className="text-gray-600 mb-6">Generate your personalized AI meal plan to get started</p>
            <Button 
              onClick={() => setShowAIDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Meal Plan
            </Button>
          </Card>
        )}

        <WeeklyOverview weeklyData={weeklyOverview} />
      </div>

      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        preferences={aiPreferences}
        onPreferencesChange={setAiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
      />

      <MealRecipeDialog
        meal={selectedMeal}
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
      />

      <ShoppingListDialog
        items={selectedMeal?.items || []}
        isOpen={showShoppingDialog}
        onClose={() => setShowShoppingDialog(false)}
      />

      <MealExchangeDialog
        currentMeal={selectedMeal?.current}
        alternatives={selectedMeal?.alternatives || []}
        isOpen={showExchangeDialog}
        onClose={() => setShowExchangeDialog(false)}
        onExchange={() => toast.success("Meal exchanged successfully!")}
      />
    </div>
  );
};

export default MealPlan;
