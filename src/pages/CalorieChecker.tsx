
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Heart, BarChart3, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import FoodPhotoAnalyzer from "@/components/calorie/FoodPhotoAnalyzer";
import EnhancedFoodSearch from "@/components/calorie/EnhancedFoodSearch";
import FoodConsumptionTracker from "@/components/calorie/FoodConsumptionTracker";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CalorieChecker = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t, isRTL } = useLanguage();
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("analyzer");
  
  // Form state for logging food
  const [quantity, setQuantity] = useState<number>(100);
  const [mealType, setMealType] = useState<string>("snack");
  const [notes, setNotes] = useState<string>("");

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setIsAddDialogOpen(true);
  };

  const handleLogFood = () => {
    if (!selectedFood) return;

    // Calculate nutrition based on quantity
    const factor = quantity / 100;
    const calories = Math.round(selectedFood.calories_per_100g * factor);
    const protein = Math.round(selectedFood.protein_per_100g * factor * 10) / 10;
    const carbs = Math.round(selectedFood.carbs_per_100g * factor * 10) / 10;
    const fat = Math.round(selectedFood.fat_per_100g * factor * 10) / 10;

    logConsumption({
      foodItemId: selectedFood.id,
      quantity,
      mealType,
      notes,
      calories,
      protein,
      carbs,
      fat
    });

    // Reset form
    setIsAddDialogOpen(false);
    setSelectedFood(null);
    setQuantity(100);
    setMealType("snack");
    setNotes("");
  };

  const tabs = [
    {
      value: "analyzer",
      label: "AI Analysis",
      icon: Camera,
      description: "Upload food photos for instant AI analysis"
    },
    {
      value: "search",
      label: "Food Search",
      icon: Search,
      description: "Search comprehensive nutrition database"
    },
    {
      value: "favorites",
      label: "Favorites",
      icon: Heart,
      description: "Quick access to your saved foods"
    },
    {
      value: "tracker",
      label: "Today's Log",
      icon: BarChart3,
      description: "Track your daily nutrition progress"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Smart Calorie Tracker
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                AI-powered nutrition analysis and food logging
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {isMobile ? (
            /* Mobile: Full-width tabs */
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 rounded-xl p-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-6">
                  {tab.value === "analyzer" && <FoodPhotoAnalyzer />}
                  {tab.value === "search" && <EnhancedFoodSearch onSelectFood={handleSelectFood} />}
                  {tab.value === "favorites" && <EnhancedFoodSearch onSelectFood={handleSelectFood} showFavoritesOnly />}
                  {tab.value === "tracker" && <FoodConsumptionTracker />}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            /* Desktop: Two-column layout */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Actions */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-xl p-1">
                    {tabs.slice(0, 3).map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="flex items-center gap-2 p-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium">{tab.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="analyzer">
                      <FoodPhotoAnalyzer />
                    </TabsContent>
                    <TabsContent value="search">
                      <EnhancedFoodSearch onSelectFood={handleSelectFood} />
                    </TabsContent>
                    <TabsContent value="favorites">
                      <EnhancedFoodSearch onSelectFood={handleSelectFood} showFavoritesOnly />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Right Column - Consumption Tracker */}
              <div className="lg:col-span-1">
                <FoodConsumptionTracker />
              </div>
            </div>
          )}
        </div>

        {/* Add Food Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Log Food
              </DialogTitle>
            </DialogHeader>

            {selectedFood && (
              <div className="space-y-4">
                {/* Food Info */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedFood.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <span>{selectedFood.calories_per_100g} cal/100g</span>
                    <span>{selectedFood.protein_per_100g}g protein/100g</span>
                    <span>{selectedFood.carbs_per_100g}g carbs/100g</span>
                    <span>{selectedFood.fat_per_100g}g fat/100g</span>
                  </div>
                </Card>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (grams)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max="2000"
                  />
                </div>

                {/* Meal Type */}
                <div className="space-y-2">
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    rows={2}
                  />
                </div>

                {/* Calculated Nutrition */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">For {quantity}g serving:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                    <span>{Math.round(selectedFood.calories_per_100g * quantity / 100)} calories</span>
                    <span>{Math.round(selectedFood.protein_per_100g * quantity / 10) / 10}g protein</span>
                    <span>{Math.round(selectedFood.carbs_per_100g * quantity / 10) / 10}g carbs</span>
                    <span>{Math.round(selectedFood.fat_per_100g * quantity / 10) / 10}g fat</span>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogFood}
                    disabled={isLoggingConsumption}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoggingConsumption ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Log Food
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalorieChecker;
