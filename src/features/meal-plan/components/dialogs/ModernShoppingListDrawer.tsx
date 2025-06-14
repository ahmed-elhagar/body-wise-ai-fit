
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Mail, Loader2 } from "lucide-react";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList";

interface ModernShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: any;
  weekId: string | undefined;
  onShoppingListUpdate: () => void;
}

export const ModernShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan,
  weekId,
  onShoppingListUpdate 
}: ModernShoppingListDrawerProps) => {
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(weeklyPlan);
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    setIsSending(true);
    await sendShoppingListEmail();
    setIsSending(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
          {enhancedShoppingItems.totalItems > 0 ? (
            Object.entries(enhancedShoppingItems.groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
                <ul className="space-y-1">
                  {Array.isArray(items) && items.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      <span className="text-gray-800">{item.name}</span>
                      <span className="text-gray-600 text-sm">{item.quantity} {item.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items in shopping list</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending || enhancedShoppingItems.totalItems === 0} className="flex-1">
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Email List
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ModernShoppingListDrawer;
