import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useMealPlans } from "@/hooks/useMealPlans";
import { toast } from "sonner";
import MealRecipeDialog from "@/components/MealRecipeDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";
import MealPlanHeader from "@/components/MealPlanHeader";
import AIGenerationDialog from "@/components/AIGenerationDialog";
import DailySummary from "@/components/DailySummary";
import MealCard from "@/components/MealCard";
import WeeklyOverview from "@/components/WeeklyOverview";

const MealPlan = () => {
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { mealPlans, isLoading: isLoadingPlans } = useMealPlans();
  
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  
  const [aiPreferences, setAiPreferences] = useState({
    duration: "1",
    cuisine: "",
    maxPrepTime: "30",
    mealTypes: "5"
  });

  const handleGenerateAIPlan = () => {
    console.log('Generating AI meal plan with preferences:', aiPreferences);
    generateMealPlan(aiPreferences);
    setShowAIDialog(false);
  };

  const handleRegeneratePlan = () => {
    if (aiPreferences) {
      console.log('Regenerating meal plan');
      generateMealPlan(aiPreferences);
      toast.success("Regenerating your meal plan...");
    } else {
      toast.error("Please generate a plan first");
    }
  };

  const handleShowRecipe = (meal: any) => {
    console.log('Showing recipe for meal:', meal);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleShowShoppingList = () => {
    const shoppingItems = todaysMeals.flatMap(meal => 
      (meal.ingredients || []).map(ingredient => ({
        name: typeof ingredient === 'string' ? ingredient : ingredient.name || 'Unknown ingredient',
        quantity: typeof ingredient === 'string' ? "1" : ingredient.quantity || "1",
        unit: typeof ingredient === 'string' ? "serving" : ingredient.unit || "serving",
        category: getCategoryForIngredient(typeof ingredient === 'string' ? ingredient : ingredient.name || '')
      }))
    );
    
    setSelectedMeal({ items: shoppingItems });
    setShowShoppingDialog(true);
  };

  const handleExchangeMeal = (meal: any) => {
    const alternatives = [
      {
        name: "Grilled Chicken Salad",
        calories: meal.calories + 10,
        reason: "Lighter protein option with similar nutrition",
        protein: meal.protein,
        carbs: meal.carbs - 5,
        fat: meal.fat
      },
      {
        name: "Turkey Wrap",
        calories: meal.calories - 20,
        reason: "Lower calorie alternative with lean protein",
        protein: meal.protein + 2,
        carbs: meal.carbs,
        fat: meal.fat - 3
      },
      {
        name: "Vegetarian Bowl",
        calories: meal.calories + 5,
        reason: "Plant-based option with similar macros",
        protein: meal.protein - 8,
        carbs: meal.carbs + 10,
        fat: meal.fat
      }
    ];
    
    setSelectedMeal({ current: meal, alternatives });
    setShowExchangeDialog(true);
  };

  const handleMealExchange = (alternative: any) => {
    toast.success(`Meal exchanged to ${alternative.name}`);
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

  // Sample data - in real app this would come from the AI generated plan
  const todaysMeals = [
    {
      type: "Breakfast",
      time: "8:00 AM",
      name: "Protein-Packed Oatmeal Bowl",
      calories: 420,
      protein: 25,
      carbs: 45,
      fat: 12,
      ingredients: [
        { name: "Rolled oats", quantity: "1/2", unit: "cup" },
        { name: "Greek yogurt", quantity: "1/4", unit: "cup" },
        { name: "Banana", quantity: "1", unit: "medium" },
        { name: "Almonds", quantity: "1", unit: "tbsp" },
        { name: "Honey", quantity: "1", unit: "tsp" },
        { name: "Chia seeds", quantity: "1", unit: "tsp" }
      ],
      instructions: [
        "Cook oats according to package instructions",
        "Stir in Greek yogurt and honey", 
        "Top with sliced banana, almonds, and chia seeds"
      ],
      cookTime: 10,
      prepTime: 5,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1517982103973-9d9dda2ac4a8?w=500",
      image: "🥣"
    },
    {
      type: "Mid-Morning Snack",
      time: "10:30 AM", 
      name: "Green Smoothie",
      calories: 180,
      protein: 8,
      carbs: 28,
      fat: 4,
      ingredients: [
        { name: "Spinach", quantity: "1", unit: "cup" },
        { name: "Apple", quantity: "1/2", unit: "medium" },
        { name: "Banana", quantity: "1/2", unit: "medium" },
        { name: "Protein powder", quantity: "1", unit: "scoop" },
        { name: "Almond milk", quantity: "1", unit: "cup" }
      ],
      instructions: [
        "Add all ingredients to blender",
        "Blend until smooth",
        "Serve immediately"
      ],
      cookTime: 5,
      prepTime: 2,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500",
      image: "🥤"
    },
    {
      type: "Lunch",
      time: "1:00 PM",
      name: "Mediterranean Chicken Bowl", 
      calories: 520,
      protein: 38,
      carbs: 42,
      fat: 18,
      ingredients: [
        { name: "Grilled chicken", quantity: "4", unit: "oz" },
        { name: "Quinoa", quantity: "1/2", unit: "cup" },
        { name: "Cucumber", quantity: "1/2", unit: "medium" },
        { name: "Tomatoes", quantity: "1/2", unit: "cup" },
        { name: "Feta", quantity: "2", unit: "tbsp" },
        { name: "Olive oil", quantity: "1", unit: "tbsp" },
        { name: "Lemon", quantity: "1/2", unit: "medium" }
      ],
      instructions: [
        "Cook quinoa according to package instructions",
        "Grill chicken breast and slice",
        "Dice cucumber and tomatoes", 
        "Combine all ingredients and dress with olive oil and lemon"
      ],
      cookTime: 25,
      prepTime: 10,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500",
      image: "🥗"
    },
    {
      type: "Afternoon Snack",
      time: "4:00 PM",
      name: "Almonds & Apple",
      calories: 160,
      protein: 6,
      carbs: 15,
      fat: 10,
      ingredients: [
        { name: "Raw almonds", quantity: "20", unit: "pieces" },
        { name: "Green apple", quantity: "1", unit: "small" }
      ],
      instructions: [
        "Wash and slice apple",
        "Serve with measured portion of almonds"
      ],
      cookTime: 0,
      prepTime: 2,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500",
      image: "🍎"
    },
    {
      type: "Dinner",
      time: "7:00 PM",
      name: "Baked Salmon with Vegetables",
      calories: 480,
      protein: 35,
      carbs: 25,
      fat: 22,
      ingredients: [
        { name: "Salmon fillet", quantity: "5", unit: "oz" },
        { name: "Broccoli", quantity: "1", unit: "cup" },
        { name: "Sweet potato", quantity: "1", unit: "medium" },
        { name: "Asparagus", quantity: "6", unit: "spears" },
        { name: "Olive oil", quantity: "1", unit: "tbsp" },
        { name: "Herbs", quantity: "1", unit: "tsp" }
      ],
      instructions: [
        "Preheat oven to 400°F",
        "Season salmon with herbs and olive oil",
        "Cut vegetables and toss with olive oil",
        "Bake salmon and vegetables for 20-25 minutes"
      ],
      cookTime: 30,
      prepTime: 10,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
      image: "🐟"
    }
  ];

  const weeklyOverview = [
    { day: "Mon", calories: 1760, status: "completed" as const },
    { day: "Tue", calories: 1820, status: "current" as const },
    { day: "Wed", calories: 1780, status: "planned" as const },
    { day: "Thu", calories: 1850, status: "planned" as const },
    { day: "Fri", calories: 1790, status: "planned" as const },
    { day: "Sat", calories: 1900, status: "planned" as const },
    { day: "Sun", calories: 1750, status: "planned" as const }
  ];

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <MealPlanHeader
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegeneratePlan={handleRegeneratePlan}
          isGenerating={isGenerating}
        />

        <div className="grid lg:grid-cols-4 gap-6">
          <DailySummary
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            onShowShoppingList={handleShowShoppingList}
          />

          {/* Today's Meals */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Today's Meals</h2>
              <Badge variant="outline" className="bg-white/80">
                5 meals planned
              </Badge>
            </div>
            
            <div className="space-y-4">
              {todaysMeals.map((meal, index) => (
                <MealCard
                  key={index}
                  meal={meal}
                  onShowRecipe={handleShowRecipe}
                  onExchangeMeal={handleExchangeMeal}
                />
              ))}
            </div>
          </div>
        </div>

        <WeeklyOverview weeklyData={weeklyOverview} />
      </div>

      {/* Dialogs */}
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
        onExchange={handleMealExchange}
      />
    </div>
  );
};

export default MealPlan;
