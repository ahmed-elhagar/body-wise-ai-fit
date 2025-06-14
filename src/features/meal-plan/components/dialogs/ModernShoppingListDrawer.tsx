import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Mail, Loader2, Filter } from "lucide-react";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [hideChecked, setHideChecked] = useState<boolean>(false);

  const handleSendEmail = async () => {
    setIsSending(true);
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

  const filteredAndGroupedItems = useMemo(() => {
    if (!enhancedShoppingItems.groupedItems) return {};

    let categoriesToDisplay = Object.entries(enhancedShoppingItems.groupedItems);

    if (selectedCategoryFilter !== 'all') {
      categoriesToDisplay = categoriesToDisplay.filter(([category]) => category === selectedCategoryFilter);
    }

    const result: Record<string, any[]> = {};
    categoriesToDisplay.forEach(([category, items]) => {
      let itemsToDisplay = items;
      if (hideChecked) {
        itemsToDisplay = items.filter(item => !checkedItems.has(getItemKey(item.name, item.unit)));
      }
      if (itemsToDisplay.length > 0) {
        result[category] = itemsToDisplay;
      }
    });
    return result;
  }, [enhancedShoppingItems.groupedItems, selectedCategoryFilter, hideChecked, checkedItems]);
  
  const totalVisibleItems = useMemo(() => {
    return Object.values(filteredAndGroupedItems).reduce((sum, items) => sum + items.length, 0);
  }, [filteredAndGroupedItems]);


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-emerald-700">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 p-1 space-y-3 border-b pb-3">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <Label htmlFor="category-filter" className="text-xs text-gray-600 mb-1 block">Category</Label>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger id="category-filter" className="w-full h-9 text-xs">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {enhancedShoppingItems.categories?.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 justify-self-end mt-3">
              <Switch
                id="hide-checked-filter"
                checked={hideChecked}
                onCheckedChange={setHideChecked}
                aria-label="Hide checked items"
              />
              <Label htmlFor="hide-checked-filter" className="text-xs text-gray-600 cursor-pointer">Hide Checked</Label>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-4 flex-grow overflow-y-auto pr-2">
          {totalVisibleItems > 0 ? (
            Object.entries(filteredAndGroupedItems).map(([category, items]) => (
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
              <p className="text-gray-500 text-lg">
                {enhancedShoppingItems.totalItems === 0 ? "Your shopping list is empty." : "No items match your filters."}
              </p>
              <p className="text-gray-400 text-sm">
                {enhancedShoppingItems.totalItems === 0 ? "Add meals to your plan to see items here." : "Try adjusting your filters."}
              </p>
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
