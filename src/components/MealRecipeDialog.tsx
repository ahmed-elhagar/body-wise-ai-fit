
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, Users, ChefHat, Sparkles, Youtube, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { useMealRecipe } from "@/hooks/useMealRecipe";
import type { Meal } from "@/types/meal";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onRecipeGenerated?: () => void;
}

const MealRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: MealRecipeDialogProps) => {
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const [detailedMeal, setDetailedMeal] = useState<any>(null);

  const hasDetailedRecipe = detailedMeal?.ingredients?.length > 0 && detailedMeal?.instructions?.length > 0;

  const handleGenerateRecipe = async () => {
    if (!meal.id) {
      console.error('No meal ID available for recipe generation');
      return;
    }
    
    const result = await generateRecipe(meal.id);
    if (result) {
      console.log('✅ Recipe generated, updating detailed meal:', result);
      setDetailedMeal(result);
      
      if (onRecipeGenerated) {
        onRecipeGenerated();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (meal.ingredients?.length > 0 && meal.instructions?.length > 0) {
        setDetailedMeal(meal);
      } else {
        setDetailedMeal(null);
      }
    }
  }, [isOpen, meal]);

  const openYouTubeSearch = () => {
    const searchTerm = detailedMeal?.youtube_search_term || detailedMeal?.youtubeId || `${meal.name} recipe`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    window.open(youtubeUrl, '_blank');
  };

  const nutritionItems = [
    {
      label: "Calories",
      value: meal.calories,
      unit: "",
      icon: Flame,
      color: "from-fitness-orange-500 to-fitness-orange-600",
      bgColor: "bg-fitness-orange-50",
      textColor: "text-fitness-orange-700"
    },
    {
      label: "Protein",
      value: meal.protein,
      unit: "g",
      icon: Beef,
      color: "from-fitness-accent-500 to-fitness-accent-600",
      bgColor: "bg-fitness-accent-50",
      textColor: "text-fitness-accent-700"
    },
    {
      label: "Carbs",
      value: meal.carbs,
      unit: "g",
      icon: Wheat,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      label: "Fat",
      value: meal.fat,
      unit: "g",
      icon: Droplets,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-fitness-primary-500 via-fitness-primary-600 to-fitness-primary-700 border-0 shadow-2xl rounded-2xl text-white">
        <div className="relative">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 shadow-md z-10 border border-white/30 text-white hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Header */}
          <DialogHeader className="text-center space-y-4 p-6 pb-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-bold text-white leading-tight">
              {meal.name}
            </DialogTitle>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge className="bg-fitness-orange-500/80 text-white border-fitness-orange-400 font-medium">
                <Clock className="w-3 h-3 mr-1" />
                {((meal.prepTime || 0) + (meal.cookTime || 0)) || 20} min
              </Badge>
              <Badge className="bg-blue-500/80 text-white border-blue-400 font-medium">
                <Users className="w-3 h-3 mr-1" />
                {meal.servings || 1} serving{meal.servings !== 1 ? 's' : ''}
              </Badge>
              <Badge className="bg-green-500/80 text-white border-green-400 font-medium">
                <Flame className="w-3 h-3 mr-1" />
                {meal.calories} cal
              </Badge>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-6">
            {/* Nutrition Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nutritionItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card key={item.label} className="bg-white/10 backdrop-blur-sm border-white/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center space-y-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto shadow-sm`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xl font-bold text-white">
                        {item.value}{item.unit}
                      </div>
                      <div className="text-xs text-white/70 font-medium uppercase tracking-wide">
                        {item.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Generate Recipe Section */}
            {!hasDetailedRecipe && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="p-6 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-fitness-orange-500/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">
                      Generate Detailed Recipe with AI
                    </h3>
                    <p className="text-white/80 font-medium max-w-md mx-auto leading-relaxed">
                      Get step-by-step instructions, ingredient details, and professional cooking tips
                    </p>
                  </div>
                  
                  {isGeneratingRecipe ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 animate-spin border-2 border-fitness-orange-500 border-t-transparent rounded-full" />
                        <span className="text-lg font-semibold text-white">Generating Recipe...</span>
                      </div>
                      <p className="text-sm text-white/70">Creating ingredients, instructions, and nutritional info</p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateRecipe}
                      disabled={isGeneratingRecipe}
                      className="bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 hover:from-fitness-orange-600 hover:to-fitness-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Detailed Recipe
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {hasDetailedRecipe && detailedMeal?.ingredients?.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/80 rounded-xl flex items-center justify-center shadow-sm">
                      <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    Ingredients
                  </h3>
                  <div className="space-y-3">
                    {detailedMeal.ingredients.map((ingredient: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
                        <span className="font-medium text-white">{ingredient.name}</span>
                        <span className="text-fitness-orange-400 font-semibold bg-white/20 px-3 py-1 rounded-lg text-sm shadow-sm">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {hasDetailedRecipe && detailedMeal?.instructions?.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/80 rounded-xl flex items-center justify-center shadow-sm">
                      <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    Instructions
                  </h3>
                  <div className="space-y-4">
                    {detailedMeal.instructions.map((instruction: string, index: number) => (
                      <div key={index} className="flex gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex-shrink-0 w-8 h-8 bg-fitness-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <p className="text-white leading-relaxed font-medium pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {hasDetailedRecipe && (
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={openYouTubeSearch}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Watch Tutorial
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
