
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

const ShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan, 
  weekId,
  onShoppingListUpdate 
}: ShoppingListDrawerProps) => {
  const { isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Compute shopping list from meal plan data
  const shoppingItems = useMemo(() => {
    console.log('🔄 Computing shopping list from meal plan data...');
    
    if (!weeklyPlan?.dailyMeals) {
      return [];
    }

    const items: ShoppingItem[] = [];
    
    weeklyPlan.dailyMeals.forEach(meal => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const ingredientName = ingredient.name || ingredient;
          items.push({
            name: ingredientName,
            quantity: parseFloat(ingredient.quantity || '1'),
            unit: ingredient.unit || 'piece',
            category: getCategoryForIngredient(ingredientName)
          });
        });
      }
    });

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
  const isEmpty = shoppingItems.length === 0;

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-lg bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 overflow-y-auto">
          <LoadingState />
        </SheetContent>
      </Sheet>
    );
  }

  if (isEmpty) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-lg bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 overflow-y-auto">
          <EmptyState />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-lg bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 overflow-y-auto">
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

export default ShoppingListDrawer;
