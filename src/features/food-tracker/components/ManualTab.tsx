
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useFoodTracking } from '../hooks/useFoodTracking';
import { toast } from "sonner";

interface ManualTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
  preSelectedFood?: any;
}

const ManualTab = ({ onFoodAdded, onClose, preSelectedFood }: ManualTabProps) => {
  const { addFoodConsumption, isAdding } = useFoodTracking();

  // Form state
  const [foodName, setFoodName] = React.useState(preSelectedFood?.name || "");
  const [calories, setCalories] = React.useState(String(preSelectedFood?.calories || ""));
  const [protein, setProtein] = React.useState(String(preSelectedFood?.protein || ""));
  const [carbs, setCarbs] = React.useState(String(preSelectedFood?.carbs || ""));
  const [fat, setFat] = React.useState(String(preSelectedFood?.fat || ""));
  const [quantity, setQuantity] = React.useState("100");
  const [mealType, setMealType] = React.useState("snack");
  const [notes, setNotes] = React.useState(
    preSelectedFood?.quantity ? `AI detected: ${preSelectedFood.quantity}` : ""
  );

  const handleSubmit = () => {
    if (!foodName.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    const quantityNum = parseFloat(quantity) || 100;
    const caloriesNum = parseFloat(calories) || 0;
    const proteinNum = parseFloat(protein) || 0;
    const carbsNum = parseFloat(carbs) || 0;
    const fatNum = parseFloat(fat) || 0;

    const multiplier = quantityNum / 100;

    const foodConsumption = {
      food_item_id: crypto.randomUUID(),
      quantity_g: quantityNum,
      calories_consumed: caloriesNum * multiplier,
      protein_consumed: proteinNum * multiplier,
      carbs_consumed: carbsNum * multiplier,
      fat_consumed: fatNum * multiplier,
      meal_type: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      consumed_at: new Date().toISOString(),
      notes: notes || undefined,
      source: (preSelectedFood ? 'ai_analysis' : 'manual') as 'manual' | 'ai_analysis' | 'barcode',
    };

    addFoodConsumption(foodConsumption);
    onFoodAdded();
    onClose();
  };

  return (
    <div className="space-y-6">
      {preSelectedFood && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 mb-2">AI Analyzed Food</h3>
          <p className="text-sm text-purple-600">
            This food was analyzed from your photo. You can adjust the values below if needed.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="foodName">Food Name *</Label>
          <Input
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories">Calories (per 100g)</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="protein">Protein (g per 100g)</Label>
            <Input
              id="protein"
              type="number"
              step="0.1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="carbs">Carbs (g per 100g)</Label>
            <Input
              id="carbs"
              type="number"
              step="0.1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fat">Fat (g per 100g)</Label>
            <Input
              id="fat"
              type="number"
              step="0.1"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity (g)</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="100"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="mt-1">
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
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this food..."
            className="mt-1"
            rows={3}
          />
        </div>

        {(calories || protein || carbs || fat) && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Nutrition Summary</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(calories) || 0) * (parseFloat(quantity) || 100) / 100)}
                </div>
                <div className="text-green-600">cal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(protein) || 0) * (parseFloat(quantity) || 100) / 100)}g
                </div>
                <div className="text-green-600">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(carbs) || 0) * (parseFloat(quantity) || 100) / 100)}g
                </div>
                <div className="text-green-600">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(fat) || 0) * (parseFloat(quantity) || 100) / 100)}g
                </div>
                <div className="text-green-600">fat</div>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isAdding || !foodName.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAdding ? 'Adding...' : 'Add to Log'}
        </Button>
      </div>
    </div>
  );
};

export default ManualTab;
