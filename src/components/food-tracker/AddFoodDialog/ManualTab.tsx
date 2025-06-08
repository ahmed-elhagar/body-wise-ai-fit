
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ManualTabProps {
  onAddFood: (food: any) => void;
  onClose: () => void;
  preSelectedFood?: any;
}

const ManualTab = ({ onAddFood, onClose, preSelectedFood }: ManualTabProps) => {
  const [foodData, setFoodData] = useState({
    name: preSelectedFood?.name || '',
    calories: preSelectedFood?.calories || '',
    protein: preSelectedFood?.protein || '',
    carbs: preSelectedFood?.carbs || '',
    fat: preSelectedFood?.fat || '',
    quantity: '1',
    unit: 'serving'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFood({
      ...foodData,
      calories: Number(foodData.calories),
      protein: Number(foodData.protein),
      carbs: Number(foodData.carbs),
      fat: Number(foodData.fat),
      quantity: Number(foodData.quantity)
    });
    onClose();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodData.name}
              onChange={(e) => setFoodData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={foodData.calories}
                onChange={(e) => setFoodData(prev => ({ ...prev, calories: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={foodData.protein}
                onChange={(e) => setFoodData(prev => ({ ...prev, protein: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={foodData.carbs}
                onChange={(e) => setFoodData(prev => ({ ...prev, carbs: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={foodData.fat}
                onChange={(e) => setFoodData(prev => ({ ...prev, fat: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={foodData.quantity}
                onChange={(e) => setFoodData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={foodData.unit}
                onChange={(e) => setFoodData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="serving"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Food
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualTab;
