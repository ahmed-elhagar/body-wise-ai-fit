
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, ChefHat, Youtube } from "lucide-react";
import type { DailyMeal } from "@/features/meal-plan/types";

interface MealRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: DailyMeal | null;
  onRecipeGenerated: () => void;
}

const MealRecipeDialog = ({
  open,
  onOpenChange,
  meal,
  onRecipeGenerated
}: MealRecipeDialogProps) => {
  if (!meal) return null;

  const prepTime = meal.prep_time || 0;
  const cookTime = meal.cook_time || 0;
  const servings = meal.servings || 1;
  const totalTime = prepTime + cookTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {totalTime} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {servings} servings
            </span>
          </div>

          {meal.ingredients && Array.isArray(meal.ingredients) && meal.ingredients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {meal.ingredients.map((ingredient: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-fitness-primary rounded-full flex-shrink-0"></span>
                      {typeof ingredient === 'string' ? ingredient : `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {meal.instructions && Array.isArray(meal.instructions) && meal.instructions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {meal.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-fitness-primary text-white text-sm rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {meal.youtube_search_term && (
            <div className="flex justify-center">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(meal.youtube_search_term)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                Watch Tutorial
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
