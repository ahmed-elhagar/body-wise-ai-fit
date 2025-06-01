
import React from 'react';
import { Button } from '@/components/ui/button';

interface FoodItemProps {
  food: any;
  onFoodAdded: () => void;
}

const FoodItem = ({ food, onFoodAdded }: FoodItemProps) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <span>{food.label}</span>
      <Button onClick={onFoodAdded} size="sm">Add</Button>
    </div>
  );
};

export default FoodItem;
