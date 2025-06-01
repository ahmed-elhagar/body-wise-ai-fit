
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import CategoryAccordion from "./CategoryAccordion";
import { useMealPlanData } from "@/hooks/useMealPlanData";

interface EnhancedShoppingListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnhancedShoppingListDrawer = ({ open, onOpenChange }: EnhancedShoppingListDrawerProps) => {
  const { t, isRTL } = useI18n();
  const { data: currentWeekPlan } = useMealPlanData();
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Create mock enhanced shopping items from current week plan
  const enhancedShoppingItems = {
    groupedItems: currentWeekPlan?.dailyMeals?.reduce((acc: any, meal: any) => {
      if (meal.ingredients) {
        const category = 'General';
        if (!acc[category]) acc[category] = [];
        meal.ingredients.forEach((ingredient: any) => {
          acc[category].push({
            name: typeof ingredient === 'string' ? ingredient : ingredient.name,
            quantity: typeof ingredient === 'string' ? '1' : ingredient.quantity,
            checked: false
          });
        });
      }
      return acc;
    }, {}) || {}
  };

  const sendShoppingListEmail = async () => {
    // Mock email sending
    console.log('Sending shopping list email...');
  };

  const handleSendEmail = async () => {
    setIsEmailSending(true);
    try {
      await sendShoppingListEmail();
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={`overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {t('shoppingList')}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 py-2">
          {Object.keys(enhancedShoppingItems.groupedItems).length > 0 ? (
            Object.entries(enhancedShoppingItems.groupedItems).map(([category, items]) => (
              <CategoryAccordion key={category} category={category} items={items as any[]} />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">{t('noItemsInShoppingList')}</p>
            </div>
          )}
        </div>

        <div className="p-4 mt-auto">
          <Button 
            className="w-full" 
            onClick={handleSendEmail} 
            disabled={isEmailSending}
          >
            {isEmailSending ? t('sendingEmail') : t('sendToEmail')}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EnhancedShoppingListDrawer;
