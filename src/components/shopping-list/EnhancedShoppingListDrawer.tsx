import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import CategoryAccordion from "./CategoryAccordion";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList";
import { useMealPlan } from "@/hooks/useMealPlanData";

interface EnhancedShoppingListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnhancedShoppingListDrawer = ({ open, onOpenChange }: EnhancedShoppingListDrawerProps) => {
  const { t, isRTL } = useI18n();
  const { currentWeeklyPlan } = useMealPlan();
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(currentWeeklyPlan);
  const [isEmailSending, setIsEmailSending] = useState(false);

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
