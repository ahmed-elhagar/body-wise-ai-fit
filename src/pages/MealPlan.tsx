
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
import WeeklyNavigation from "@/components/WeeklyNavigation";

const MealPlan = () => {
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { mealPlans, isLoading: isLoadingPlans } = useMealPlans();
  
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  
  const [aiPreferences, setAiPreferences] = useState({
    duration: "1",
    cuisine: "",
    maxPrepTime: "30",
    mealTypes: "5"
  });

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
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentDay];
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

  const handleShowRecipe = (meal: any) => {
    console.log('Showing recipe for meal:', meal);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: any, index: number) => {
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
          { name: "Mixed greens", quantity: "2", unit: "cups" },
          { name: "Cherry tomatoes", quantity: "1/2", unit: "cup" },
          { name: "Cucumber", quantity: "1/2", unit: "medium" },
          { name: "Olive oil", quantity: "1", unit: "tbsp" }
        ],
        instructions: [
          "Season and grill chicken breast until cooked through",
          "Slice cucumber and halve cherry tomatoes",
          "Combine greens, tomatoes, and cucumber in a bowl",
          "Top with sliced chicken and drizzle with olive oil"
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 1,
        youtubeId: "dQw4w9WgXcQ"
      },
      {
        name: "Turkey Wrap",
        calories: meal.calories - 20,
        reason: "Lower calorie alternative with lean protein",
        protein: meal.protein + 2,
        carbs: meal.carbs,
        fat: meal.fat - 3,
        ingredients: [
          { name: "Whole wheat tortilla", quantity: "1", unit: "large" },
          { name: "Sliced turkey", quantity: "3", unit: "oz" },
          { name: "Lettuce", quantity: "2", unit: "leaves" },
          { name: "Tomato", quantity: "2", unit: "slices" },
          { name: "Hummus", quantity: "2", unit: "tbsp" }
        ],
        instructions: [
          "Spread hummus evenly on tortilla",
          "Layer turkey, lettuce, and tomato slices",
          "Roll up tightly and slice in half"
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        youtubeId: "dQw4w9WgXcQ"
      }
    ];
    
    setSelectedMeal({ current: meal, alternatives, index });
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  };

  const handleMealExchange = (alternative: any) => {
    if (selectedMealIndex !== null) {
      // Update the meal in the todaysMeals array
      const updatedMeals = [...todaysMeals];
      updatedMeals[selectedMealIndex] = {
        ...alternative,
        type: todaysMeals[selectedMealIndex].type,
        time: todaysMeals[selectedMealIndex].time,
        image: todaysMeals[selectedMealIndex].image
      };
      
      // In a real app, this would update the state or make an API call
      // For now, we'll just show a success message
      toast.success(`Meal exchanged to ${alternative.name}`);
    }
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

  // Sample data with detailed recipes and YouTube links
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
        "In a medium saucepan, bring 1 cup of water to a boil",
        "Add rolled oats and reduce heat to low, simmer for 5 minutes",
        "Stir occasionally until oats are creamy and tender",
        "Remove from heat and let cool for 2 minutes",
        "Stir in Greek yogurt and honey until well combined",
        "Slice banana into rounds",
        "Top oatmeal with banana slices, chopped almonds, and chia seeds",
        "Serve immediately while warm"
      ],
      cookTime: 10,
      prepTime: 5,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1517982103973-9d9dda2ac4a8?w=500",
      image: "🥣",
      youtubeId: "dQw4w9WgXcQ",
      tips: [
        "For extra creaminess, add a splash of milk while cooking",
        "Toast the almonds for enhanced flavor",
        "Soak chia seeds in water for 10 minutes before adding"
      ]
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
        { name: "Fresh spinach", quantity: "1", unit: "cup" },
        { name: "Green apple", quantity: "1/2", unit: "medium" },
        { name: "Banana", quantity: "1/2", unit: "medium" },
        { name: "Vanilla protein powder", quantity: "1", unit: "scoop" },
        { name: "Unsweetened almond milk", quantity: "1", unit: "cup" },
        { name: "Ice cubes", quantity: "4", unit: "pieces" }
      ],
      instructions: [
        "Wash spinach thoroughly and remove any thick stems",
        "Core and chop the apple (keep skin on for fiber)",
        "Peel and slice the banana",
        "Add almond milk to blender first (for easier blending)",
        "Add spinach, apple, banana, and protein powder",
        "Add ice cubes for desired consistency",
        "Blend on high speed for 60-90 seconds until smooth",
        "Pour into a tall glass and serve immediately"
      ],
      cookTime: 5,
      prepTime: 2,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500",
      image: "🥤",
      youtubeId: "dQw4w9WgXcQ",
      tips: [
        "Freeze banana slices for a thicker, creamier smoothie",
        "Add a handful of frozen mango for tropical flavor",
        "Use coconut milk for extra richness"
      ]
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
        { name: "Chicken breast", quantity: "4", unit: "oz" },
        { name: "Quinoa", quantity: "1/2", unit: "cup dry" },
        { name: "Cucumber", quantity: "1/2", unit: "medium" },
        { name: "Cherry tomatoes", quantity: "1/2", unit: "cup" },
        { name: "Feta cheese", quantity: "2", unit: "tbsp" },
        { name: "Extra virgin olive oil", quantity: "1", unit: "tbsp" },
        { name: "Lemon", quantity: "1/2", unit: "medium" },
        { name: "Dried oregano", quantity: "1", unit: "tsp" },
        { name: "Salt and pepper", quantity: "to taste", unit: "" }
      ],
      instructions: [
        "Rinse quinoa in cold water until water runs clear",
        "Cook quinoa in 1 cup water: bring to boil, reduce heat, simmer covered for 15 minutes",
        "Season chicken breast with salt, pepper, and oregano",
        "Heat a grill pan or skillet over medium-high heat",
        "Cook chicken for 6-7 minutes per side until internal temperature reaches 165°F",
        "Let chicken rest for 5 minutes, then slice into strips",
        "Dice cucumber and halve cherry tomatoes",
        "Fluff cooked quinoa with a fork and let cool slightly",
        "In a bowl, combine quinoa, cucumber, and tomatoes",
        "Top with sliced chicken and crumbled feta",
        "Whisk olive oil with lemon juice, drizzle over bowl",
        "Season with additional salt and pepper to taste"
      ],
      cookTime: 25,
      prepTime: 10,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500",
      image: "🥗",
      youtubeId: "dQw4w9WgXcQ",
      tips: [
        "Marinate chicken in lemon juice and herbs for 30 minutes for extra flavor",
        "Toast quinoa in a dry pan before cooking for nuttier taste",
        "Add kalamata olives and red onion for authentic Mediterranean flavor"
      ]
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
        "Wash apple thoroughly under cold running water",
        "Core the apple and slice into 8 wedges",
        "Measure out 20 almonds (approximately 1 oz)",
        "Arrange apple slices on a plate",
        "Serve almonds in a small bowl alongside apple",
        "Eat mindfully, chewing thoroughly"
      ],
      cookTime: 0,
      prepTime: 2,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500",
      image: "🍎",
      youtubeId: "dQw4w9WgXcQ",
      tips: [
        "Choose crisp apples like Honeycrisp or Granny Smith",
        "Lightly toast almonds for enhanced flavor",
        "Add a sprinkle of cinnamon to apple slices"
      ]
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
        { name: "Fresh broccoli", quantity: "1", unit: "cup" },
        { name: "Sweet potato", quantity: "1", unit: "medium" },
        { name: "Fresh asparagus", quantity: "6", unit: "spears" },
        { name: "Extra virgin olive oil", quantity: "1", unit: "tbsp" },
        { name: "Fresh dill", quantity: "1", unit: "tbsp" },
        { name: "Garlic powder", quantity: "1/2", unit: "tsp" },
        { name: "Lemon", quantity: "1/2", unit: "medium" },
        { name: "Salt and black pepper", quantity: "to taste", unit: "" }
      ],
      instructions: [
        "Preheat oven to 400°F (200°C)",
        "Wash and pierce sweet potato with a fork, microwave for 5 minutes to pre-cook",
        "Cut sweet potato into 1-inch cubes",
        "Trim asparagus ends and cut broccoli into bite-sized florets",
        "Toss vegetables with half the olive oil, salt, and pepper",
        "Arrange vegetables on one side of a large baking sheet",
        "Pat salmon dry and season with salt, pepper, garlic powder, and dill",
        "Drizzle salmon with remaining olive oil",
        "Place salmon on the other side of the baking sheet",
        "Bake for 15-20 minutes until salmon flakes easily and vegetables are tender",
        "Squeeze fresh lemon juice over salmon and vegetables before serving",
        "Let rest for 2-3 minutes before plating"
      ],
      cookTime: 30,
      prepTime: 10,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
      image: "🐟",
      youtubeId: "dQw4w9WgXcQ",
      tips: [
        "Check salmon doneness: internal temperature should reach 145°F",
        "Don't overcook salmon - it should be slightly pink in the center",
        "Roast vegetables separately if you prefer them more caramelized"
      ]
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

        <div className="grid lg:grid-cols-4 gap-6">
          <DailySummary
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            onShowShoppingList={handleShowShoppingList}
          />

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
                  onExchangeMeal={(meal) => handleExchangeMeal(meal, index)}
                />
              ))}
            </div>
          </div>
        </div>

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
        onExchange={handleMealExchange}
      />
    </div>
  );
};

export default MealPlan;
