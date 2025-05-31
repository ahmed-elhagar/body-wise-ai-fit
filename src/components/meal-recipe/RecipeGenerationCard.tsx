
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

interface RecipeGenerationCardProps {
  hasDetailedRecipe: boolean;
  mealId?: string;
  isGeneratingRecipe: boolean;
  onGenerateRecipe: () => void;
}

const RecipeGenerationCard = ({ 
  hasDetailedRecipe, 
  mealId, 
  isGeneratingRecipe, 
  onGenerateRecipe 
}: RecipeGenerationCardProps) => {
  if (hasDetailedRecipe) return null;

  if (!mealId) {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-md">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-gray-600 font-medium">
            Recipe generation not available for this meal. Please regenerate your meal plan to enable detailed recipes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
      <CardContent className="p-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">
            Get Detailed Recipe with AI
          </h3>
          <p className="text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
            Generate detailed ingredients, step-by-step instructions, and professional food images powered by AI
          </p>
          <Badge variant="outline" className="bg-white border-orange-200 text-orange-700 font-medium">
            Daily limit: 10 recipes per day
          </Badge>
        </div>
        
        {isGeneratingRecipe ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              <span className="text-lg font-semibold text-gray-700">Generating Recipe...</span>
            </div>
            <p className="text-sm text-gray-600">Creating ingredients, instructions, and nutritional info</p>
          </div>
        ) : (
          <Button
            onClick={onGenerateRecipe}
            disabled={isGeneratingRecipe}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Detailed Recipe
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeGenerationCard;
