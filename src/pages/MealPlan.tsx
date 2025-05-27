import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, ChefHat, ShoppingCart, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useMealPlans } from "@/hooks/useMealPlans";
import { toast } from "sonner";
import MealRecipeDialog from "@/components/MealRecipeDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";

const MealPlan = () => {
  const navigate = useNavigate();
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { mealPlans, isLoading: isLoadingPlans } = useMealPlans();
  
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  
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
    // Generate shopping list from current meals
    const shoppingItems = todaysMeals.flatMap(meal => 
      meal.ingredients.map(ingredient => ({
        name: ingredient,
        quantity: "1",
        unit: "serving",
        category: getCategoryForIngredient(ingredient)
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
    // Here you would update the meal plan with the new meal
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
      ingredients: ["Rolled oats", "Greek yogurt", "Banana", "Almonds", "Honey", "Chia seeds"],
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
      ingredients: ["Spinach", "Apple", "Banana", "Protein powder", "Almond milk"],
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
      ingredients: ["Grilled chicken", "Quinoa", "Cucumber", "Tomatoes", "Feta", "Olive oil", "Lemon"],
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
      ingredients: ["Raw almonds", "Green apple"],
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
      ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Asparagus", "Olive oil", "Herbs"],
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
    { day: "Mon", calories: 1760, status: "completed" },
    { day: "Tue", calories: 1820, status: "current" },
    { day: "Wed", calories: 1780, status: "planned" },
    { day: "Thu", calories: 1850, status: "planned" },
    { day: "Fri", calories: 1790, status: "planned" },
    { day: "Sat", calories: 1900, status: "planned" },
    { day: "Sun", calories: 1750, status: "planned" }
  ];

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + parseInt(meal.protein), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meal Plan</h1>
              <p className="text-gray-600">Tuesday, January 30, 2024</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate AI Meal Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="duration">Plan Duration</Label>
                    <Select value={aiPreferences.duration} onValueChange={(value) => 
                      setAiPreferences(prev => ({ ...prev, duration: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Week</SelectItem>
                        <SelectItem value="2">2 Weeks</SelectItem>
                        <SelectItem value="4">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cuisine">Preferred Cuisine (Optional)</Label>
                    <Input
                      value={aiPreferences.cuisine}
                      onChange={(e) => setAiPreferences(prev => ({ ...prev, cuisine: e.target.value }))}
                      placeholder="e.g., Mediterranean, Asian, Italian"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrepTime">Max Prep Time (minutes)</Label>
                    <Select value={aiPreferences.maxPrepTime} onValueChange={(value) => 
                      setAiPreferences(prev => ({ ...prev, maxPrepTime: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleGenerateAIPlan} 
                    disabled={isGenerating}
                    className="w-full bg-fitness-gradient hover:opacity-90 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Plan
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={handleRegeneratePlan}
              className="bg-fitness-gradient hover:opacity-90 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Plan
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Daily Summary */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Total Calories</p>
                <p className="text-2xl font-bold text-green-800">{totalCalories}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Total Protein</p>
                <p className="text-2xl font-bold text-blue-800">{totalProtein}g</p>
              </div>
              <Button 
                onClick={handleShowShoppingList}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shopping List
              </Button>
            </div>
          </Card>

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
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{meal.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {meal.type}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {meal.time}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{meal.name}</h3>
                        
                        {/* Nutrition Info */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Calories</p>
                            <p className="font-semibold text-fitness-primary">{meal.calories}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Protein</p>
                            <p className="font-semibold text-green-600">{meal.protein}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Carbs</p>
                            <p className="font-semibold text-blue-600">{meal.carbs}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Fat</p>
                            <p className="font-semibold text-orange-600">{meal.fat}g</p>
                          </div>
                        </div>

                        {/* Meal Details */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {meal.cookTime}min
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {meal.servings} serving
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.slice(0, 4).map((ingredient, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                              {ingredient}
                            </Badge>
                          ))}
                          {meal.ingredients.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{meal.ingredients.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-white/80"
                        onClick={() => handleShowRecipe(meal)}
                      >
                        <ChefHat className="w-4 h-4 mr-1" />
                        Recipe
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-white/80"
                        onClick={() => handleExchangeMeal(meal)}
                      >
                        Exchange
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Overview</h3>
          <div className="grid grid-cols-7 gap-4">
            {weeklyOverview.map((day, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg ${
                  day.status === 'current' 
                    ? 'bg-fitness-gradient text-white' 
                    : day.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                <p className="font-medium">{day.day}</p>
                <p className="text-sm mt-1">{day.calories} cal</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dialogs */}
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
