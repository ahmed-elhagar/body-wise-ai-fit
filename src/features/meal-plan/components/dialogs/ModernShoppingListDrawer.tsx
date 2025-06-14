
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-violet-600" />
            Shopping List
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {enhancedShoppingItems.totalItems > 0 ? (
            Object.entries(enhancedShoppingItems.groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2">
                  {category}
                </h3>
                <div className="grid gap-2">
                  {Array.isArray(items) && items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items in shopping list</p>
              <p className="text-sm text-gray-400 mt-1">Generate a meal plan to see ingredients here</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || enhancedShoppingItems.totalItems === 0} 
            className="flex-1 bg-violet-600 hover:bg-violet-700"
          >
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
