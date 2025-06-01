import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

interface FoodItemCardProps {
  foodItem: any;
  onAdd: (foodItem: any) => void;
}

const FoodItemCard = ({ foodItem, onAdd }: FoodItemCardProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{foodItem.name}</h3>
          <p className="text-xs text-gray-500">{foodItem.calories} cal</p>
        </div>
        <Button size="sm" onClick={() => onAdd(foodItem)}>
          {t('foodTracker.add')}
        </Button>
      </div>
    </Card>
  );
};

export default FoodItemCard;
