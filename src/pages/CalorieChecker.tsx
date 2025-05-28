
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Upload, Zap, History, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MealSearchResults from "@/components/MealSearchResults";
import MealDetailModal from "@/components/MealDetailModal";

interface MealResult {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  category: string;
  cookTime?: number;
  servings?: number;
  image: string;
  description?: string;
}

const CalorieChecker = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<MealResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodLog, setFoodLog] = useState<MealResult[]>([]);

  // Dummy meal database for demonstration
  const mealDatabase: MealResult[] = [
    {
      id: "1",
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sodium: 74,
      servingSize: "100g",
      category: "Lunch",
      cookTime: 15,
      servings: 1,
      image: "🍗",
      description: "Lean protein source, perfect for muscle building and weight management."
    },
    {
      id: "2",
      name: "Caesar Salad",
      calories: 280,
      protein: 8,
      carbs: 12,
      fat: 24,
      fiber: 3,
      sugar: 4,
      sodium: 650,
      servingSize: "1 large bowl",
      category: "Lunch",
      cookTime: 10,
      servings: 1,
      image: "🥗",
      description: "Fresh romaine lettuce with caesar dressing, croutons, and parmesan cheese."
    },
    {
      id: "3",
      name: "Banana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      sodium: 1,
      servingSize: "1 medium (118g)",
      category: "Snack",
      servings: 1,
      image: "🍌",
      description: "Rich in potassium and natural sugars, great for post-workout recovery."
    },
    {
      id: "4",
      name: "Oatmeal with Berries",
      calories: 320,
      protein: 12,
      carbs: 54,
      fat: 6,
      fiber: 8,
      sugar: 12,
      sodium: 120,
      servingSize: "1 cup cooked",
      category: "Breakfast",
      cookTime: 5,
      servings: 1,
      image: "🥣",
      description: "Hearty breakfast with rolled oats, mixed berries, and a touch of honey."
    },
    {
      id: "5",
      name: "Salmon Fillet",
      calories: 208,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sodium: 59,
      servingSize: "100g",
      category: "Dinner",
      cookTime: 20,
      servings: 1,
      image: "🐟",
      description: "Rich in omega-3 fatty acids and high-quality protein."
    },
    {
      id: "6",
      name: "Greek Yogurt",
      calories: 130,
      protein: 15,
      carbs: 9,
      fat: 5,
      fiber: 0,
      sugar: 9,
      sodium: 65,
      servingSize: "1 cup (170g)",
      category: "Snack",
      servings: 1,
      image: "🥛",
      description: "Creamy, protein-rich yogurt perfect for snacks or breakfast."
    },
    {
      id: "7",
      name: "Avocado Toast",
      calories: 320,
      protein: 8,
      carbs: 25,
      fat: 22,
      fiber: 10,
      sugar: 2,
      sodium: 380,
      servingSize: "2 slices",
      category: "Breakfast",
      cookTime: 5,
      servings: 1,
      image: "🥑",
      description: "Whole grain toast topped with fresh avocado and seasonings."
    },
    {
      id: "8",
      name: "Protein Smoothie",
      calories: 245,
      protein: 25,
      carbs: 35,
      fat: 3,
      fiber: 4,
      sugar: 28,
      sodium: 180,
      servingSize: "1 large glass",
      category: "Snack",
      cookTime: 2,
      servings: 1,
      image: "🥤",
      description: "Blend of protein powder, banana, berries, and almond milk."
    }
  ];

  const recentScans = [
    {
      id: "recent1",
      food: "Grilled Chicken Breast",
      calories: 165,
      protein: "31g",
      carbs: "0g",
      fat: "3.6g",
      time: "2 hours ago",
      image: "🍗"
    },
    {
      id: "recent2",
      food: "Caesar Salad",
      calories: 280,
      protein: "8g",
      carbs: "12g",
      fat: "24g",
      time: "Yesterday",
      image: "🥗"
    },
    {
      id: "recent3",
      food: "Banana",
      calories: 105,
      protein: "1.3g",
      carbs: "27g",
      fat: "0.4g",
      time: "2 days ago",
      image: "🍌"
    }
  ];

  const popularFoods = [
    { name: "Apple", calories: 95, image: "🍎" },
    { name: "Avocado", calories: 320, image: "🥑" },
    { name: "Egg", calories: 70, image: "🥚" },
    { name: "Salmon", calories: 208, image: "🐟" },
    { name: "Rice (1 cup)", calories: 205, image: "🍚" },
    { name: "Almonds (1 oz)", calories: 164, image: "🥜" },
    { name: "Greek Yogurt", calories: 130, image: "🥛" },
    { name: "Broccoli", calories: 55, image: "🥦" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate AI analysis
      setTimeout(() => {
        const randomMeal = mealDatabase[Math.floor(Math.random() * mealDatabase.length)];
        setSelectedMeal(randomMeal);
        setIsModalOpen(true);
        setSelectedFile(null);
        toast.success("AI analysis complete!");
      }, 2000);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      
      // Simulate search delay
      setTimeout(() => {
        const filteredResults = mealDatabase.filter(meal =>
          meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(filteredResults);
        setIsSearching(false);
        
        if (filteredResults.length === 0) {
          toast.info("No meals found. Try different keywords.");
        }
      }, 1000);
    }
  };

  const handleSelectMeal = (meal: MealResult) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  const handleAddToLog = (meal: MealResult) => {
    setFoodLog(prev => [...prev, meal]);
    toast.success(`${meal.name} added to your food log!`);
  };

  const handleQuickSearch = (foodName: string) => {
    setSearchQuery(foodName);
    const meal = mealDatabase.find(m => m.name.toLowerCase().includes(foodName.toLowerCase()));
    if (meal) {
      setSelectedMeal(meal);
      setIsModalOpen(true);
    }
  };

  const todaysTotalCalories = foodLog.reduce((total, meal) => total + meal.calories, 0);

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
              <h1 className="text-3xl font-bold text-gray-800">Calorie Checker</h1>
              <p className="text-gray-600">Analyze food calories with AI-powered recognition and database search</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Analysis */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <Camera className="w-6 h-6 text-fitness-primary mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">AI Food Recognition</h3>
                  <p className="text-sm text-gray-600">Upload or take a photo of your meal</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-fitness-primary transition-colors">
                <div className="space-y-4">
                  {selectedFile ? (
                    <div className="animate-pulse">
                      <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-lg font-medium text-gray-800">Analyzing your food...</p>
                      <p className="text-sm text-gray-600">AI is processing the image</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-800 mb-2">Upload Food Image</p>
                        <p className="text-sm text-gray-600 mb-4">
                          Take a photo or upload an image of your meal for instant calorie analysis
                        </p>
                        <div className="flex justify-center space-x-4">
                          <label htmlFor="file-upload">
                            <Button asChild className="bg-fitness-gradient hover:opacity-90 text-white">
                              <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Photo
                              </span>
                            </Button>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button variant="outline" className="bg-white/80">
                            <Camera className="w-4 h-4 mr-2" />
                            Take Photo
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Manual Search */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <Search className="w-6 h-6 text-fitness-secondary mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Food Database Search</h3>
                  <p className="text-sm text-gray-600">Search our extensive food database for nutrition info</p>
                </div>
              </div>

              <div className="flex space-x-3 mb-4">
                <div className="flex-1">
                  <Label htmlFor="food-search" className="sr-only">Search for food</Label>
                  <Input
                    id="food-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., grilled chicken, caesar salad, banana..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-fitness-gradient hover:opacity-90 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Search Results */}
              {(searchResults.length > 0 || isSearching) && (
                <MealSearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  onSelectMeal={handleSelectMeal}
                />
              )}
            </Card>

            {/* Popular Foods */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Popular Foods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularFoods.map((food, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 border border-gray-200"
                    onClick={() => handleQuickSearch(food.name)}
                  >
                    <div className="text-2xl">{food.image}</div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-800">{food.name}</p>
                      <p className="text-xs text-gray-600">{food.calories} cal</p>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Scans */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <History className="w-5 h-5 text-fitness-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Recent Scans</h3>
              </div>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleQuickSearch(scan.food)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{scan.image}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">{scan.food}</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                          <span>Cal: {scan.calories}</span>
                          <span>Protein: {scan.protein}</span>
                          <span>Carbs: {scan.carbs}</span>
                          <span>Fat: {scan.fat}</span>
                        </div>
                        <p className="text-xs text-gray-500">{scan.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Today's Food Log */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <Plus className="w-5 h-5 text-fitness-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Today's Food Log</h3>
              </div>
              
              {foodLog.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-600">No foods logged yet</p>
                  <p className="text-sm text-gray-500">Search and add foods to track your intake</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {foodLog.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{meal.image}</span>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{meal.name}</p>
                          <p className="text-xs text-gray-600">{meal.calories} cal</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between font-semibold text-fitness-primary">
                      <span>Total Calories:</span>
                      <span>{todaysTotalCalories} cal</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Daily Summary */}
            <Card className="p-6 bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 backdrop-blur-sm border-0 shadow-lg">
              <h4 className="font-medium text-gray-800 mb-3">Today's Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Logged:</span>
                  <span className="font-medium">{todaysTotalCalories} cal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-medium">2,000 cal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium">{Math.max(0, 2000 - todaysTotalCalories)} cal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-fitness-gradient h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, (todaysTotalCalories / 2000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Meal Detail Modal */}
        <MealDetailModal
          meal={selectedMeal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToLog={handleAddToLog}
        />
      </div>
    </div>
  );
};

export default CalorieChecker;
