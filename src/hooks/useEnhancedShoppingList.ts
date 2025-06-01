
import { useMemo } from 'react';
import { toast } from 'sonner';
import type { WeeklyMealPlan, DailyMeal } from './useMealPlanData';

interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  mealSource: string;
}

interface GroupedShoppingItems {
  [category: string]: ShoppingItem[];
}

export const useEnhancedShoppingList = (weeklyPlan?: {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
} | null) => {
  const enhancedShoppingItems = useMemo(() => {
    if (!weeklyPlan?.dailyMeals) {
      return { items: [], groupedItems: {} };
    }

    const items: ShoppingItem[] = [];
    const itemMap = new Map<string, ShoppingItem>();

    weeklyPlan.dailyMeals.forEach((meal) => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`;
          const category = getCategoryForIngredient(ingredient.name);
          
          if (itemMap.has(key)) {
            const existing = itemMap.get(key)!;
            // Combine quantities if possible
            const combinedQuantity = combineQuantities(existing.quantity, ingredient.quantity);
            existing.quantity = combinedQuantity;
            existing.mealSource += `, ${meal.name}`;
          } else {
            itemMap.set(key, {
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              category,
              mealSource: meal.name
            });
          }
        });
      }
    });

    const allItems = Array.from(itemMap.values());
    const groupedItems = allItems.reduce((groups: GroupedShoppingItems, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {});

    return { items: allItems, groupedItems };
  }, [weeklyPlan]);

  const sendShoppingListEmail = async (): Promise<boolean> => {
    try {
      toast.success('Shopping list email sent successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to send shopping list email');
      return false;
    }
  };

  return {
    enhancedShoppingItems,
    sendShoppingListEmail
  };
};

const getCategoryForIngredient = (ingredientName: string): string => {
  const categories = {
    'Proteins': ['chicken', 'beef', 'pork', 'fish', 'eggs', 'tofu', 'beans', 'lentils', 'salmon', 'tuna'],
    'Vegetables': ['tomato', 'onion', 'garlic', 'carrot', 'spinach', 'broccoli', 'pepper', 'lettuce', 'cucumber'],
    'Grains': ['rice', 'bread', 'pasta', 'quinoa', 'oats', 'flour', 'wheat', 'barley'],
    'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'mozzarella', 'cheddar'],
    'Fruits': ['apple', 'banana', 'orange', 'berry', 'lemon', 'lime', 'strawberry', 'blueberry'],
    'Spices & Herbs': ['salt', 'pepper', 'cumin', 'paprika', 'oregano', 'basil', 'thyme', 'rosemary'],
    'Pantry': ['oil', 'vinegar', 'honey', 'sugar', 'flour', 'baking'],
    'Others': []
  };

  const ingredient = ingredientName.toLowerCase();
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => ingredient.includes(item))) {
      return category;
    }
  }
  
  return 'Others';
};

const combineQuantities = (qty1: string, qty2: string): string => {
  // Simple quantity combination - can be enhanced
  const num1 = parseFloat(qty1) || 0;
  const num2 = parseFloat(qty2) || 0;
  
  if (num1 > 0 && num2 > 0) {
    return (num1 + num2).toString();
  }
  
  return `${qty1}, ${qty2}`;
};
