
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Upload, Zap } from "lucide-react";
import { useState } from "react";

const CalorieChecker = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const recentScans = [
    {
      food: "Grilled Chicken Breast",
      calories: 165,
      protein: "31g",
      carbs: "0g",
      fat: "3.6g",
      time: "2 hours ago",
      image: "🍗"
    },
    {
      food: "Caesar Salad",
      calories: 280,
      protein: "8g",
      carbs: "12g",
      fat: "24g",
      time: "Yesterday",
      image: "🥗"
    },
    {
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
        alert(`AI Analysis Result:\n\nDetected: Mixed Salad Bowl\nCalories: 320\nProtein: 12g\nCarbs: 18g\nFat: 22g`);
        setSelectedFile(null);
      }, 2000);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simulate search result
      alert(`Search Result for "${searchQuery}":\n\nCalories: 245\nProtein: 8g\nCarbs: 35g\nFat: 9g`);
      setSearchQuery("");
    }
  };

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
              <p className="text-gray-600">Analyze food calories with AI-powered recognition</p>
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
                  <h3 className="text-lg font-semibold text-gray-800">Manual Food Search</h3>
                  <p className="text-sm text-gray-600">Search for specific foods and get nutrition info</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="flex-1">
                  <Label htmlFor="food-search" className="sr-only">Search for food</Label>
                  <Input
                    id="food-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., grilled chicken, apple, pizza slice..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-fitness-gradient hover:opacity-90 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
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
                    onClick={() => alert(`${food.name}\nCalories: ${food.calories}`)}
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

          {/* Recent Scans */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Scans</h3>
            <div className="space-y-4">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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

            {/* Daily Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Today's Tracked Calories</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Scanned:</span>
                  <span className="font-medium">550 cal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meal Plan:</span>
                  <span className="font-medium">1,200 cal</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>1,750 cal</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Tips */}
        <Card className="mt-6 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Tips for Better Tracking</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Photo Tips</h4>
              <p className="text-sm text-blue-700">
                Take photos in good lighting with the food clearly visible for best AI recognition accuracy.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Portion Control</h4>
              <p className="text-sm text-green-700">
                Include a reference object (like a coin) in your photo to help AI estimate portion sizes.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Accuracy</h4>
              <p className="text-sm text-purple-700">
                Our AI has 95% accuracy on common foods and continuously learns from user feedback.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalorieChecker;
