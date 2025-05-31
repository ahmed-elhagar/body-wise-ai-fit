
import { useState, useMemo } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";
import type { WeeklyMealPlan, DailyMeal } from "@/hooks/useMealPlanData";
import DrawerHeader from "./DrawerHeader";
import CategoryAccordion from "./CategoryAccordion";
import ProgressFooter from "./ProgressFooter";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan?: {
    weeklyPlan: WeeklyMealPlan;
    dailyMeals: DailyMeal[];
  } | null;
  weekId?: string;
  onShoppingListUpdate?: () => void;
}

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

const EnhancedShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan, 
  weekId,
  onShoppingListUpdate 
}: ShoppingListDrawerProps) => {
  const { isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Compute shopping list from meal plan data with proper aggregation
  const shoppingItems = useMemo(() => {
    console.log('🛒 Computing shopping list from meal plan data...');
    
    if (!weeklyPlan?.dailyMeals) {
      return [];
    }

    const itemsMap = new Map<string, ShoppingItem>();
    
    weeklyPlan.dailyMeals.forEach(meal => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const ingredientName = ingredient.name || ingredient;
          const quantity = parseFloat(ingredient.quantity || '1');
          const unit = ingredient.unit || 'piece';
          const key = `${ingredientName.toLowerCase()}-${unit}`;
          
          if (itemsMap.has(key)) {
            const existing = itemsMap.get(key)!;
            existing.quantity += quantity;
          } else {
            itemsMap.set(key, {
              name: ingredientName,
              quantity: quantity,
              unit: unit,
              category: getCategoryForIngredient(ingredientName)
            });
          }
        });
      }
    });

    const items = Array.from(itemsMap.values());
    console.log('🛒 Generated shopping items:', items.length);
    return items;
  }, [weeklyPlan?.dailyMeals]);

  // Group items by category
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

  const isLoading = !weeklyPlan;
  const isEmpty = shoppingItems.length === 0 && !!weeklyPlan;

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side={isRTL ? "left" : "right"} 
          className="w-full sm:max-w-lg bg-white border-gray-200 overflow-y-auto z-[100]"
        >
          <LoadingState />
        </SheetContent>
      </Sheet>
    );
  }

  if (isEmpty) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side={isRTL ? "left" : "right"} 
          className="w-full sm:max-w-lg bg-white border-gray-200 overflow-y-auto z-[100]"
        >
          <EmptyState />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:max-w-lg bg-white border-gray-200 overflow-y-auto z-[100]"
      >
        <div className="space-y-6 h-full">
          <DrawerHeader 
            totalItems={shoppingItems.length}
            groupedItems={groupedItems}
            weekId={weekId}
            onShoppingListUpdate={onShoppingListUpdate}
          />
          
          <div className="flex-1 overflow-y-auto">
            <CategoryAccordion
              groupedItems={groupedItems}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              onShoppingListUpdate={onShoppingListUpdate}
            />
          </div>
          
          <ProgressFooter
            checkedCount={checkedItems.size}
            totalItems={shoppingItems.length}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedShoppingListDrawer;
