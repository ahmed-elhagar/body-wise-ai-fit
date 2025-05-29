
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFood: any;
  onLogFood: (logData: any) => void;
  isLogging: boolean;
}

const AddFoodDialog = ({ isOpen, onClose, selectedFood, onLogFood, isLogging }: AddFoodDialogProps) => {
  const [quantity, setQuantity] = useState<number>(100);
  const [mealType, setMealType] = useState<string>("snack");
  const [notes, setNotes] = useState<string>("");

  const handleLogFood = () => {
    if (!selectedFood) return;

    const factor = quantity / 100;
    const calories = Math.round(selectedFood.calories_per_100g * factor);
    const protein = Math.round(selectedFood.protein_per_100g * factor * 10) / 10;
    const carbs = Math.round(selectedFood.carbs_per_100g * factor * 10) / 10;
    const fat = Math.round(selectedFood.fat_per_100g * factor * 10) / 10;

    onLogFood({
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
    setQuantity(100);
    setMealType("snack");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                onClick={onClose}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogFood}
                disabled={isLogging}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {isLogging ? (
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
  );
};

export default AddFoodDialog;
