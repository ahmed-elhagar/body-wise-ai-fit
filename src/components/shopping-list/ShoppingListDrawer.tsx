
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import EnhancedShoppingListDrawer from "./EnhancedShoppingListDrawer";

interface ShoppingListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShoppingListDrawer = ({ open, onOpenChange }: ShoppingListDrawerProps) => {
  const { t } = useI18n();
  const [isEnhanced, setIsEnhanced] = useState(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {t('Shopping List')}
          </DrawerTitle>
        </DrawerHeader>

        {isEnhanced ? (
          <EnhancedShoppingListDrawer open={open} onOpenChange={onOpenChange} />
        ) : (
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              {t('Enhanced shopping list is coming soon!')}
            </p>
            <Button onClick={() => setIsEnhanced(true)}>
              {t('Try Enhanced Version')}
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ShoppingListDrawer;
