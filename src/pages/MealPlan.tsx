
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, ChefHat, ShoppingCart, RefreshCw } from "lucide-react";

const MealPlan = () => {
  const navigate = useNavigate();

  const todaysMeals = [
    {
      type: "Breakfast",
      time: "8:00 AM",
      name: "Protein-Packed Oatmeal Bowl",
      calories: 420,
      protein: "25g",
      carbs: "45g",
      fat: "12g",
      ingredients: ["Rolled oats", "Greek yogurt", "Banana", "Almonds", "Honey", "Chia seeds"],
      cookTime: "10 min",
      servings: 1,
      image: "🥣"
    },
    {
      type: "Mid-Morning Snack",
      time: "10:30 AM",
      name: "Green Smoothie",
      calories: 180,
      protein: "8g",
      carbs: "28g",
      fat: "4g",
      ingredients: ["Spinach", "Apple", "Banana", "Protein powder", "Almond milk"],
      cookTime: "5 min",
      servings: 1,
      image: "🥤"
    },
    {
      type: "Lunch",
      time: "1:00 PM",
      name: "Mediterranean Chicken Bowl",
      calories: 520,
      protein: "38g",
      carbs: "42g",
      fat: "18g",
      ingredients: ["Grilled chicken", "Quinoa", "Cucumber", "Tomatoes", "Feta", "Olive oil", "Lemon"],
      cookTime: "25 min",
      servings: 1,
      image: "🥗"
    },
    {
      type: "Afternoon Snack",
      time: "4:00 PM",
      name: "Almonds & Apple",
      calories: 160,
      protein: "6g",
      carbs: "15g",
      fat: "10g",
      ingredients: ["Raw almonds", "Green apple"],
      cookTime: "0 min",
      servings: 1,
      image: "🍎"
    },
    {
      type: "Dinner",
      time: "7:00 PM",
      name: "Baked Salmon with Vegetables",
      calories: 480,
      protein: "35g",
      carbs: "25g",
      fat: "22g",
      ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Asparagus", "Olive oil", "Herbs"],
      cookTime: "30 min",
      servings: 1,
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
          <Button className="bg-fitness-gradient hover:opacity-90 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Plan
          </Button>
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
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
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
                            <p className="font-semibold text-green-600">{meal.protein}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Carbs</p>
                            <p className="font-semibold text-blue-600">{meal.carbs}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Fat</p>
                            <p className="font-semibold text-orange-600">{meal.fat}</p>
                          </div>
                        </div>

                        {/* Meal Details */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {meal.cookTime}
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
                      <Button size="sm" variant="outline" className="bg-white/80">
                        <ChefHat className="w-4 h-4 mr-1" />
                        Recipe
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/80">
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
    </div>
  );
};

export default MealPlan;
