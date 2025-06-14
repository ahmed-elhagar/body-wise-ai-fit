
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {enhancedShoppingItems.totalItems > 0 ? (
            Object.entries(enhancedShoppingItems.groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-lg">{category}</h3>
                <ul className="space-y-1">
                  {Array.isArray(items) && items.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-gray-500">{item.quantity} {item.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No items in shopping list</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending} className="flex-1">
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
      </DialogContent>
    </Dialog>
  );
};
