
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shuffle, Clock, Users } from "lucide-react";

interface MealPlanExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: any;
  mealIndex: number;
}

const MealPlanExchangeDialog = ({
  open,
  onOpenChange,
  meal,
  mealIndex
}: MealPlanExchangeDialogProps) => {
  if (!meal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{meal.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {meal.prep_time + meal.cook_time} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {meal.servings} servings
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {meal.calories} calories • {meal.protein}g protein
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              Find Similar Meal
            </Button>
            <Button className="w-full" variant="outline">
              Generate Alternative
            </Button>
            <Button className="w-full" variant="outline">
              Browse Categories
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanExchangeDialog;
