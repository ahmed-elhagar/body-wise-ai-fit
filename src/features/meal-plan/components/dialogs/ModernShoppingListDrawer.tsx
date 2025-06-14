
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import
import { ShoppingCart, Mail, Loader2 } from "lucide-react";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList"; // Assuming this hook is in the shared hooks folder

interface ModernShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: any; // Consider defining a more specific type for weeklyPlan
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
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleSendEmail = async () => {
    setIsSending(true);
    // Consider passing only unchecked items or all items based on preference
    await sendShoppingListEmail(); 
    setIsSending(false);
  };

  const handleItemCheck = (itemKey: string, isChecked: boolean) => {
    setCheckedItems(prev => {
      const newCheckedItems = new Set(prev);
      if (isChecked) {
        newCheckedItems.add(itemKey);
      } else {
        newCheckedItems.delete(itemKey);
      }
      return newCheckedItems;
    });
  };

  const getItemKey = (itemName: string, itemUnit: string) => `${itemName.toLowerCase()}-${itemUnit}`;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-emerald-700">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 flex-grow overflow-y-auto pr-2">
          {enhancedShoppingItems.totalItems > 0 ? (
            Object.entries(enhancedShoppingItems.groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
                <ul className="space-y-1.5">
                  {Array.isArray(items) && items.map((item: any, index: number) => {
                    const itemKey = getItemKey(item.name, item.unit);
                    const isChecked = checkedItems.has(itemKey);
                    return (
                      <li 
                        key={`${itemKey}-${index}`} 
                        className="flex items-center py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Checkbox
                          id={itemKey}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleItemCheck(itemKey, !!checked)}
                          className="mr-3 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          aria-label={`Mark ${item.name} as bought`}
                        />
                        <label 
                          htmlFor={itemKey} 
                          className={`flex-grow text-gray-800 cursor-pointer ${isChecked ? 'line-through text-gray-500' : ''}`}
                        >
                          {item.name}
                        </label>
                        <span className={`text-gray-600 text-sm ${isChecked ? 'line-through text-gray-500' : ''}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center py-8 flex flex-col items-center justify-center h-full">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your shopping list is empty.</p>
              <p className="text-gray-400 text-sm">Add meals to your plan to see items here.</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-auto pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || enhancedShoppingItems.totalItems === 0} 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
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
      </SheetContent>
    </Sheet>
  );
};

export default ModernShoppingListDrawer;
