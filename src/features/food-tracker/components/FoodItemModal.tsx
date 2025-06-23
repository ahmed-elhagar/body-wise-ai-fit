
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface FoodItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: any;
  onAddFood: (foodData: any) => void;
  isAdding: boolean;
}

const FoodItemModal: React.FC<FoodItemModalProps> = ({
  isOpen,
  onClose,
  food,
  onAddFood,
  isAdding
}) => {
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
  const [notes, setNotes] = useState('');

  if (!food) return null;

  const multiplier = quantity / 100;
  const calculatedNutrition = {
    calories: Math.round(food.calories_per_100g * multiplier),
    protein: Math.round(food.protein_per_100g * multiplier * 10) / 10,
    carbs: Math.round(food.carbs_per_100g * multiplier * 10) / 10,
    fat: Math.round(food.fat_per_100g * multiplier * 10) / 10
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFood({
      ...food,
      quantity,
      meal_type: mealType,
      notes: notes.trim() || undefined
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Add {food.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{food.name}</h3>
              {food.brand && (
                <Badge variant="outline" className="text-xs">
                  {food.brand}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {food.calories_per_100g} cal per 100g
            </p>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max="2000"
              step="1"
              required
            />
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
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

          {/* Calculated Nutrition */}
          <div className="space-y-2">
            <Label>Nutrition for {quantity}g</Label>
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-orange-600">
                  {calculatedNutrition.calories}
                </p>
                <p className="text-xs text-gray-600">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {calculatedNutrition.protein}g
                </p>
                <p className="text-xs text-gray-600">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {calculatedNutrition.carbs}g
                </p>
                <p className="text-xs text-gray-600">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-600">
                  {calculatedNutrition.fat}g
                </p>
                <p className="text-xs text-gray-600">Fat</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this food..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isAdding ? 'Adding...' : 'Add Food'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodItemModal;
