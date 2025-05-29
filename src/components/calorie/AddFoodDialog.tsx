
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Scale, Clock } from "lucide-react";

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFood: any;
  onLogFood: (data: any) => void;
  isLogging: boolean;
}

const AddFoodDialog = ({ isOpen, onClose, selectedFood, onLogFood, isLogging }: AddFoodDialogProps) => {
  const [quantity, setQuantity] = useState<number>(100);
  const [mealType, setMealType] = useState<string>("snack");
  const [notes, setNotes] = useState<string>("");

  if (!selectedFood) return null;

  // Calculate nutrition based on quantity
  const calculateNutrition = (baseValue: number, quantity: number) => {
    return Math.round((baseValue * quantity / 100) * 10) / 10;
  };

  const calories = calculateNutrition(selectedFood.calories_per_100g || 0, quantity);
  const protein = calculateNutrition(selectedFood.protein_per_100g || 0, quantity);
  const carbs = calculateNutrition(selectedFood.carbs_per_100g || 0, quantity);
  const fat = calculateNutrition(selectedFood.fat_per_100g || 0, quantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const logData = {
      foodItemId: selectedFood.id,
      quantity,
      mealType,
      notes,
      calories,
      protein,
      carbs,
      fat,
      // Include meal data if this is from meal plan
      mealData: selectedFood._mealData || null
    };

    onLogFood(logData);
  };

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Log Food Consumption
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Summary */}
          <Card className="p-4 bg-gray-50 border border-gray-200">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{selectedFood.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedFood.category || 'Food'}
                </Badge>
                {selectedFood.verified && (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                    Verified
                  </Badge>
                )}
              </div>
              {selectedFood.serving_description && (
                <p className="text-xs text-gray-600">
                  Default: {selectedFood.serving_description}
                </p>
              )}
            </div>
          </Card>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <div className="relative">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min="1"
                step="1"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                g
              </span>
            </div>
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calculated Nutrition */}
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Nutrition for {quantity}g</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Calories:</span>
                <span className="font-semibold text-blue-900">{calories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Protein:</span>
                <span className="font-semibold text-blue-900">{protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Carbs:</span>
                <span className="font-semibold text-blue-900">{carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Fat:</span>
                <span className="font-semibold text-blue-900">{fat}g</span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this meal..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLogging}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLogging}
            >
              {isLogging ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  Logging...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Log Food
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
