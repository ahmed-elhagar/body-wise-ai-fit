
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

interface ManualTabProps {
  onFoodAdd: (food: any) => void;
}

const ManualTab = ({ onFoodAdd }: ManualTabProps) => {
  const [foodData, setFoodData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '1'
  });
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodData.name || !foodData.calories) return;

    onFoodAdd({
      name: foodData.name,
      calories: parseFloat(foodData.calories),
      protein: parseFloat(foodData.protein) || 0,
      carbs: parseFloat(foodData.carbs) || 0,
      fat: parseFloat(foodData.fat) || 0,
      quantity: parseFloat(foodData.quantity) || 1
    });

    setFoodData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      quantity: '1'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="food-name">{String(tFoodTracker('foodName'))}</Label>
        <Input
          id="food-name"
          value={foodData.name}
          onChange={(e) => setFoodData(prev => ({ ...prev, name: e.target.value }))}
          placeholder={String(tFoodTracker('enterFoodName'))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calories">{String(tFoodTracker('calories'))}</Label>
          <Input
            id="calories"
            type="number"
            value={foodData.calories}
            onChange={(e) => setFoodData(prev => ({ ...prev, calories: e.target.value }))}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="quantity">{String(tFoodTracker('quantity'))}</Label>
          <Input
            id="quantity"
            type="number"
            step="0.1"
            value={foodData.quantity}
            onChange={(e) => setFoodData(prev => ({ ...prev, quantity: e.target.value }))}
            placeholder="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="protein">{String(tFoodTracker('protein'))}</Label>
          <Input
            id="protein"
            type="number"
            value={foodData.protein}
            onChange={(e) => setFoodData(prev => ({ ...prev, protein: e.target.value }))}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="carbs">{String(tFoodTracker('carbs'))}</Label>
          <Input
            id="carbs"
            type="number"
            value={foodData.carbs}
            onChange={(e) => setFoodData(prev => ({ ...prev, carbs: e.target.value }))}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="fat">{String(tFoodTracker('fat'))}</Label>
          <Input
            id="fat"
            type="number"
            value={foodData.fat}
            onChange={(e) => setFoodData(prev => ({ ...prev, fat: e.target.value }))}
            placeholder="0"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {String(tFoodTracker('addFood'))}
      </Button>
    </form>
  );
};

export default ManualTab;
