
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
}

interface CategoryShoppingCardProps {
  category: string;
  items: ShoppingItem[];
  checkedItems: Set<string>;
  onItemToggle: (itemId: string) => void;
  onCategoryToggle: (category: string) => void;
}

export const CategoryShoppingCard = ({
  category,
  items,
  checkedItems,
  onItemToggle,
  onCategoryToggle
}: CategoryShoppingCardProps) => {
  const checkedCount = items.filter(item => checkedItems.has(item.id)).length;
  const allChecked = checkedCount === items.length;
  const someChecked = checkedCount > 0 && checkedCount < items.length;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900">{category}</span>
            <span className="text-xs text-gray-500">({items.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryToggle(category)}
            className="h-6 px-2 text-xs"
          >
            {allChecked ? 'Uncheck All' : 'Check All'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => onItemToggle(item.id)}
            >
              <Checkbox
                checked={checkedItems.has(item.id)}
                className="border-gray-300"
              />
              <div className="flex-1">
                <span className={`text-sm ${checkedItems.has(item.id) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.name}
                </span>
                <span className={`text-xs ml-2 ${checkedItems.has(item.id) ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {item.quantity} {item.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
