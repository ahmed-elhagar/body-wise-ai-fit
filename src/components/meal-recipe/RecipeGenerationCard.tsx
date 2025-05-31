
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import LoadingIndicator from "@/components/ui/loading-indicator";

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
      <Card className="p-6 text-center bg-fitness-neutral-50">
        <p className="text-fitness-neutral-600">
          Recipe generation not available for this meal. Please regenerate your meal plan to enable detailed recipes.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Sparkles className="w-12 h-12 text-fitness-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-fitness-neutral-800 mb-2">
            Get Detailed Recipe with AI
          </h3>
          <p className="text-fitness-neutral-600 mb-4">
            Generate detailed ingredients, step-by-step instructions, and professional food images
          </p>
          <Badge variant="outline" className="mb-4">
            Daily limit: 10 recipes per day
          </Badge>
        </div>
        
        {isGeneratingRecipe ? (
          <LoadingIndicator
            status="loading"
            message="Generating Recipe..."
            description="Creating detailed instructions and ingredients"
            variant="card"
            size="md"
          />
        ) : (
          <Button
            onClick={onGenerateRecipe}
            disabled={isGeneratingRecipe}
            className="bg-fitness-gradient hover:opacity-90 text-white px-6 py-3"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Detailed Recipe
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RecipeGenerationCard;
