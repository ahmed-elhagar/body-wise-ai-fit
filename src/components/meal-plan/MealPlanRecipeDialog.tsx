
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, ChefHat } from "lucide-react";

interface MealPlanRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: any;
  onRecipeGenerated: () => void;
}

const MealPlanRecipeDialog = ({
  open,
  onOpenChange,
  meal,
  onRecipeGenerated
}: MealPlanRecipeDialogProps) => {
  if (!meal) return null;

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
              {meal.prep_time + meal.cook_time} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {meal.servings} servings
            </span>
          </div>

          {meal.ingredients && meal.ingredients.length > 0 && (
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

          {meal.instructions && meal.instructions.length > 0 && (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanRecipeDialog;
