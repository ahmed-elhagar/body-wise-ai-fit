
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import type { DailyMeal } from '../../types';

interface RecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
}

export const RecipeDialog = ({ isOpen, onClose, meal }: RecipeDialogProps) => {
  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">{meal.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{meal.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{meal.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{meal.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
