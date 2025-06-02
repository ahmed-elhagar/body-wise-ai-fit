
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList";
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

const ShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan, 
  weekId,
  onShoppingListUpdate 
}: ShoppingListDrawerProps) => {
  const { isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  // Use enhanced shopping list functionality
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(weeklyPlan);

  const isLoading = !weeklyPlan;
  const isEmpty = enhancedShoppingItems.items.length === 0 && !!weeklyPlan;

  // Enhanced shopping list update handler
  const handleShoppingListUpdate = async () => {
    if (onShoppingListUpdate) {
      onShoppingListUpdate();
    }
    
    // Additional enhanced functionality can be added here
    console.log('🛒 Shopping list updated with enhanced features');
  };

  // Enhanced email sending handler
  const handleSendEmail = async () => {
    const success = await sendShoppingListEmail();
    if (success && onShoppingListUpdate) {
      onShoppingListUpdate();
    }
  };

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
            totalItems={enhancedShoppingItems.items.length}
            groupedItems={enhancedShoppingItems.groupedItems}
            weekId={weekId}
            onShoppingListUpdate={handleShoppingListUpdate}
            onSendEmail={handleSendEmail}
          />
          
          <div className="flex-1 overflow-y-auto">
            <CategoryAccordion
              groupedItems={enhancedShoppingItems.groupedItems}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              onShoppingListUpdate={handleShoppingListUpdate}
            />
          </div>
          
          <ProgressFooter
            checkedCount={checkedItems.size}
            totalItems={enhancedShoppingItems.items.length}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingListDrawer;
