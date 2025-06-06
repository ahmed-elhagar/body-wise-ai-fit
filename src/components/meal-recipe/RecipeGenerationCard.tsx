
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Apple, ChefHat } from "lucide-react";

interface RecipeGenerationCardProps {
  hasDetailedRecipe: boolean;
  mealId?: string;
  isGeneratingRecipe: boolean;
  onGenerateRecipe: () => void;
  isSnack?: boolean;
}

const RecipeGenerationCard = ({ 
  hasDetailedRecipe, 
  mealId, 
  isGeneratingRecipe, 
  onGenerateRecipe,
  isSnack = false
}: RecipeGenerationCardProps) => {
  if (hasDetailedRecipe) return null;

  if (!mealId) {
    return (
      <Card className="bg-gray-100 border-gray-300 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-600 font-medium">
            Recipe generation not available for this {isSnack ? 'snack' : 'meal'}. Please regenerate your meal plan to enable detailed recipes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const gradientColor = isSnack 
    ? "from-fitness-accent-50 to-fitness-accent-100" 
    : "from-fitness-primary-50 to-fitness-primary-100";
  
  const borderColor = isSnack 
    ? "border-fitness-accent-200" 
    : "border-fitness-primary-200";
  
  const iconColor = isSnack 
    ? "from-fitness-accent-500 to-fitness-accent-600" 
    : "from-fitness-primary-500 to-fitness-primary-600";

  const buttonColor = isSnack
    ? "from-fitness-accent-500 to-fitness-accent-600 hover:from-fitness-accent-600 hover:to-fitness-accent-700"
    : "from-fitness-primary-500 to-fitness-primary-600 hover:from-fitness-primary-600 hover:to-fitness-primary-700";

  return (
    <Card className={`bg-gradient-to-br ${gradientColor} ${borderColor} border-2 shadow-xl hover:shadow-2xl transition-all duration-300`}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className={`w-20 h-20 bg-gradient-to-br ${iconColor} rounded-3xl flex items-center justify-center shadow-lg`}>
            {isSnack ? <Apple className="w-10 h-10 text-white" /> : <ChefHat className="w-10 h-10 text-white" />}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-fitness-primary-700">
            Get Detailed {isSnack ? 'Snack' : 'Recipe'} with AI
          </h3>
          <p className="text-fitness-primary-600 font-medium max-w-md mx-auto leading-relaxed">
            Generate detailed ingredients, step-by-step instructions, and {isSnack ? 'healthy snack tips' : 'professional cooking techniques'} powered by AI
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-white/70 border-fitness-primary-300 text-fitness-primary-700 font-medium">
              ✨ AI-Powered
            </Badge>
            <Badge variant="outline" className="bg-white/70 border-fitness-primary-300 text-fitness-primary-700 font-medium">
              🎯 Personalized
            </Badge>
            {isSnack && (
              <Badge variant="outline" className="bg-fitness-accent-100 border-fitness-accent-300 text-fitness-accent-700 font-medium">
                🍎 Healthy
              </Badge>
            )}
          </div>
        </div>
        
        {isGeneratingRecipe ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className={`w-6 h-6 ${isSnack ? 'text-fitness-accent-600' : 'text-fitness-primary-600'} animate-spin`} />
              <span className="text-lg font-semibold text-fitness-primary-700">
                Generating {isSnack ? 'Snack' : 'Recipe'}...
              </span>
            </div>
            <p className="text-sm text-fitness-primary-600">
              Creating {isSnack ? 'healthy snack ideas' : 'ingredients, instructions, and nutritional info'}
            </p>
          </div>
        ) : (
          <Button
            onClick={onGenerateRecipe}
            disabled={isGeneratingRecipe}
            className={`bg-gradient-to-r ${buttonColor} text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg border-0`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Detailed {isSnack ? 'Snack Guide' : 'Recipe'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeGenerationCard;
