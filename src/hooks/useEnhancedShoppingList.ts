
import { useMemo } from 'react';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
}

interface UseEnhancedShoppingListProps {
  ingredients?: any[];
  checkedItems?: Set<string>;
}

export const useEnhancedShoppingList = ({ 
  ingredients = [], 
  checkedItems = new Set() 
}: UseEnhancedShoppingListProps) => {
  
  const shoppingItems = useMemo(() => {
    const itemsMap = new Map<string, ShoppingItem>();
    
    ingredients.forEach((ingredient: any, index: number) => {
      const ingredientName = ingredient.name || ingredient;
      const quantity = parseFloat(ingredient.quantity || '1');
      const unit = ingredient.unit || 'piece';
      const key = `${ingredientName.toLowerCase()}-${unit}`;
      
      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key)!;
        existing.quantity += quantity;
      } else {
        itemsMap.set(key, {
          id: key,
          name: ingredientName,
          quantity: quantity,
          unit: unit,
          category: getCategoryForIngredient(ingredientName),
          isChecked: checkedItems.has(key),
        });
      }
    });

    return Array.from(itemsMap.values());
  }, [ingredients, checkedItems]);

  const groupedItems = useMemo(() => {
    return shoppingItems.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  }, [shoppingItems]);

  return {
    shoppingItems,
    groupedItems,
  };
};
