
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
      <Card className="bg-gray-800/50 border-gray-600/30 shadow-lg backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-600/50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-300 font-medium">
            Recipe generation not available for this {isSnack ? 'snack' : 'meal'}. Please regenerate your meal plan to enable detailed recipes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const gradientColor = isSnack 
    ? "from-green-500/10 to-emerald-500/10" 
    : "from-purple-500/10 to-pink-500/10";
  
  const borderColor = isSnack 
    ? "border-green-500/20" 
    : "border-purple-500/20";
  
  const iconColor = isSnack 
    ? "from-green-400 to-emerald-400" 
    : "from-purple-400 to-pink-400";

  const buttonColor = isSnack
    ? "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
    : "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600";

  return (
    <Card className={`bg-gradient-to-br ${gradientColor} ${borderColor} border backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className={`w-20 h-20 bg-gradient-to-br ${iconColor} rounded-3xl flex items-center justify-center shadow-lg`}>
            {isSnack ? <Apple className="w-10 h-10 text-white" /> : <ChefHat className="w-10 h-10 text-white" />}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">
            Get Detailed {isSnack ? 'Snack' : 'Recipe'} with AI
          </h3>
          <p className="text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
            Generate detailed ingredients, step-by-step instructions, and {isSnack ? 'healthy snack tips' : 'professional cooking techniques'} powered by AI
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-gray-300 font-medium backdrop-blur-sm">
              ✨ AI-Powered
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-gray-300 font-medium backdrop-blur-sm">
              🎯 Personalized
            </Badge>
            {isSnack && (
              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300 font-medium backdrop-blur-sm">
                🍎 Healthy
              </Badge>
            )}
          </div>
        </div>
        
        {isGeneratingRecipe ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className={`w-6 h-6 ${isSnack ? 'text-green-400' : 'text-purple-400'} animate-spin`} />
              <span className="text-lg font-semibold text-white">
                Generating {isSnack ? 'Snack' : 'Recipe'}...
              </span>
            </div>
            <p className="text-sm text-gray-300">
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
