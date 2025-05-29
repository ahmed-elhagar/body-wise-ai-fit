
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Heart, BarChart3, Plus, Loader2 } from "lucide-react";
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
  const [selectedTab, setSelectedTab] = useState("search");
  
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
      value: "search",
      label: "Search",
      icon: Search,
      description: "Find foods in database"
    },
    {
      value: "analyzer",
      label: "AI Scan",
      icon: Camera,
      description: "Scan food photos"
    },
    {
      value: "favorites",
      label: "Favorites",
      icon: Heart,
      description: "Your saved foods"
    },
    {
      value: "tracker",
      label: "Today",
      icon: BarChart3,
      description: "Daily progress"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Calorie Tracker
            </h1>
            <p className="text-sm text-gray-600">
              AI-powered nutrition tracking
            </p>
          </div>
        </div>

        {/* Mobile: Full-width tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 mb-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          <div className="space-y-4">
            <TabsContent value="search" className="mt-0">
              <EnhancedFoodSearch onSelectFood={handleSelectFood} />
            </TabsContent>
            
            <TabsContent value="analyzer" className="mt-0">
              <FoodPhotoAnalyzer />
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-0">
              <EnhancedFoodSearch onSelectFood={handleSelectFood} showFavoritesOnly />
            </TabsContent>
            
            <TabsContent value="tracker" className="mt-0">
              <FoodConsumptionTracker />
            </TabsContent>
          </div>
        </Tabs>

        {/* Add Food Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Log Food
              </DialogTitle>
            </DialogHeader>

            {selectedFood && (
              <div className="space-y-4">
                {/* Food Info */}
                <Card className="p-3 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">{selectedFood.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span>{selectedFood.calories_per_100g} cal/100g</span>
                    <span>{selectedFood.protein_per_100g}g protein</span>
                    <span>{selectedFood.carbs_per_100g}g carbs</span>
                    <span>{selectedFood.fat_per_100g}g fat</span>
                  </div>
                </Card>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm">Quantity (grams)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max="2000"
                    className="text-sm"
                  />
                </div>

                {/* Meal Type */}
                <div className="space-y-2">
                  <Label htmlFor="meal-type" className="text-sm">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className="text-sm">
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
                  <Label htmlFor="notes" className="text-sm">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    rows={2}
                    className="text-sm"
                  />
                </div>

                {/* Calculated Nutrition */}
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm">For {quantity}g serving:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                    <span>{Math.round(selectedFood.calories_per_100g * quantity / 100)} calories</span>
                    <span>{Math.round(selectedFood.protein_per_100g * quantity / 10) / 10}g protein</span>
                    <span>{Math.round(selectedFood.carbs_per_100g * quantity / 10) / 10}g carbs</span>
                    <span>{Math.round(selectedFood.fat_per_100g * quantity / 10) / 10}g fat</span>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogFood}
                    disabled={isLoggingConsumption}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
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
